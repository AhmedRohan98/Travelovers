import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

interface Answer {
  questionId: number
  optionId: number
}

interface MultiSelectAnswer {
  questionId: number
  selectedOptions: Array<{
    optionId: number
  }>
}

interface AssessmentResult {
  recommendations: Array<{
    title: string
    description: string
    isPositive?: boolean
  }>
  visaType: string
  score?: number
  maxScore?: number
  scorePercentage?: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers = [], multiSelectAnswers = [], visaType = 'visit' } = body
    
    console.log('=== CALCULATE API CALLED ===')
    console.log('Visa Type:', visaType)
    console.log('Answers:', answers)
    console.log('MultiSelect Answers:', multiSelectAnswers)
    
    if (visaType === 'study') {
      console.log('=== STUDY ASSESSMENT DEBUG ===')
      console.log('Study answers count:', answers.length)
      console.log('Study multi-select answers count:', multiSelectAnswers.length)
      console.log('Study single-select option IDs:', answers.map((a: Answer) => a.optionId))
      console.log('Study multi-select option IDs:', multiSelectAnswers.flatMap((a: MultiSelectAnswer) => a.selectedOptions.map((o: {optionId: number}) => o.optionId)))
    }

    if (!Array.isArray(answers) || !Array.isArray(multiSelectAnswers)) {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 })
    }

    // Calculate scores for visit_visa type only
    let score = 0
    let maxScore = 0
    
    if (visaType === 'visit') {
      // Get all answered question IDs
      const allAnsweredQuestionIds = [
        ...answers.map(a => a.questionId),
        ...multiSelectAnswers.map(a => a.questionId)
      ]
      
      if (allAnsweredQuestionIds.length > 0) {
        // Get all options for answered questions to calculate max score
        const { data: allOptions, error: allOptionsError } = await supabase
          .from('options')
          .select('question_id, points')
          .in('question_id', allAnsweredQuestionIds)
        
        if (!allOptionsError && allOptions) {
          // Calculate max possible score for each question
          const questionMaxScores = new Map<number, number>()
          
          for (const option of allOptions) {
            if (option.points !== null && option.points !== undefined) {
              const currentMax = questionMaxScores.get(option.question_id) || 0
              questionMaxScores.set(option.question_id, Math.max(currentMax, option.points))
            }
          }
          
          maxScore = Array.from(questionMaxScores.values()).reduce((sum, points) => sum + points, 0)
        }
        
        // Calculate actual score from single-select answers
        for (const answer of answers) {
          const { data: optionData, error: optionError } = await supabase
            .from('options')
            .select('points')
            .eq('id', answer.optionId)
            .single()
          
          if (!optionError && optionData && optionData.points !== null && optionData.points !== undefined) {
            score += optionData.points
          }
        }
        
        // Calculate actual score from multi-select answers
        for (const multiAnswer of multiSelectAnswers) {
          for (const selectedOption of multiAnswer.selectedOptions) {
            const { data: optionData, error: optionError } = await supabase
              .from('options')
              .select('points')
              .eq('id', selectedOption.optionId)
              .single()
            
            if (!optionError && optionData && optionData.points !== null && optionData.points !== undefined) {
              score += optionData.points
            }
          }
        }
      }
    }

    // Build recommendations from selected options in DB (no hardcoded recommendations)
    const selectedSingleOptionIds = answers.map((a: Answer) => a.optionId)
    const selectedMultiOptionIds = multiSelectAnswers.flatMap((a: MultiSelectAnswer) => a.selectedOptions.map(o => o.optionId))
    const uniqueSelectedOptionIds = Array.from(new Set([...
      selectedSingleOptionIds,
      ...selectedMultiOptionIds
    ]))

    const recommendations: Array<{ title: string; description: string; isPositive?: boolean }> = []
    if (uniqueSelectedOptionIds.length > 0) {
      console.log('Fetching recommendations for option IDs:', uniqueSelectedOptionIds)
      const { data: optionRows, error: optionErr } = await supabase
        .from('options')
        .select('*')
        .in('id', uniqueSelectedOptionIds)

      if (optionErr) {
        console.error('Error fetching recommendations from options:', optionErr)
      } else {
        console.log('Fetched option rows:', optionRows?.length || 0, 'rows')
        if (optionRows && optionRows.length > 0) {
          console.log('Sample option row structure:', Object.keys(optionRows[0]))
        }
      }
      
      if (optionRows && optionRows.length > 0) {
        // Normalize possible column names: recommendation/recommendations, optional rec_title/rec_description
        type SelectedOptionRow = {
          id: number
          option?: string | null
          text?: string | null
          rec_title?: string | null
          recommendation_title?: string | null
          rec_description?: string | null
          recommendation_description?: string | null
          recommendation?: string | null
          recommendations?: string | null
          remark?: boolean | null
        }

        const recs = (optionRows as SelectedOptionRow[])
          .map((row, index) => {
            console.log(`Processing row ${index} (ID: ${row.id}):`, {
              option: row.option,
              text: row.text,
              recommendations: row.recommendations,
              recommendation: row.recommendation,
              rec_description: row.rec_description,
              recommendation_description: row.recommendation_description,
              remark: row.remark
            })
            
            const titleFromRow = row.rec_title || row.recommendation_title || null
            const descFromRow = row.rec_description || row.recommendation_description || row.recommendation || row.recommendations || null
            const optionText = row.option || row.text || null
            const remark = row.remark

            console.log(`Row ${index} - titleFromRow: "${titleFromRow}", descFromRow: "${descFromRow}", optionText: "${optionText}"`)

            // Skip if no recommendation text present
            if (!descFromRow || String(descFromRow).trim() === '') {
              console.log(`Row ${index} skipped - no recommendation description found`)
              return null
            }

            const title = String(titleFromRow || optionText || 'Recommendation').trim()
            const description = String(descFromRow).trim()
            const isPositive = remark === true
            console.log(`Row ${index} processed - title: "${title}", isPositive: ${isPositive}`)
            return { title, description, isPositive }
          })
          .filter(Boolean) as Array<{ title: string; description: string; isPositive?: boolean }>

        // De-duplicate identical recommendations
        const seen = new Set<string>()
        for (const rec of recs) {
          const key = `${rec.title}::${rec.description}`
          if (!seen.has(key)) {
            recommendations.push(rec)
            seen.add(key)
          }
        }
      }
    } else {
      console.log('No selected options found for recommendations')
    }


    const result: AssessmentResult = {
      recommendations,
      visaType
    }
    
    // Add scores for visit_visa type only
    if (visaType === 'visit') {
      result.score = score
      result.maxScore = maxScore
      result.scorePercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    }

    console.log('=== FINAL RESULT ===')
    console.log('Visa Type:', visaType)
    console.log('Recommendations found:', recommendations.length)
    console.log('Recommendations:', recommendations)
    console.log('Selected option IDs:', uniqueSelectedOptionIds)
    
    if (visaType === 'study') {
      console.log('=== STUDY RECOMMENDATIONS SUMMARY ===')
      console.log('Total selected options:', uniqueSelectedOptionIds.length)
      console.log('Recommendations generated:', recommendations.length)
      if (recommendations.length === 0) {
        console.log('WARNING: No recommendations found for study assessment!')
        console.log('This might indicate missing recommendation data in the options table')
      }
    }
    
    if (visaType === 'visit') {
      console.log('Score:', score)
      console.log('Max Score:', maxScore)
      console.log('Score Percentage:', result.scorePercentage)
    }

    return NextResponse.json({
      success: true,
      result
    })
  } catch (error) {
    console.error('Error in calculate API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
