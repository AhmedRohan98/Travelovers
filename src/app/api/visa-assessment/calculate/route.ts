import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

interface Answer {
  questionId: number
  optionId: number
  points: number
}

interface MultiSelectAnswer {
  questionId: number
  selectedOptions: Array<{
    optionId: number
    points: number
  }>
  totalPoints: number
}

interface AssessmentResult {
  totalScore: number
  maxPossibleScore: number
  percentage: number
  approvalChance: 'High' | 'Medium' | 'Low'
  recommendations: Array<{
    title: string
    description: string
    isPositive?: boolean
  }>
  visaType: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers = [], multiSelectAnswers = [], visaType = 'visit' } = body

    if (!Array.isArray(answers) || !Array.isArray(multiSelectAnswers)) {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 })
    }

    // Convert visa type string to numeric ID (not needed for max calc now)

    // Calculate total score from both single and multi-select answers
    const singleSelectScore = answers.reduce((sum: number, answer: Answer) => sum + answer.points, 0)
    const multiSelectScore = multiSelectAnswers.reduce((sum: number, answer: MultiSelectAnswer) => sum + answer.totalPoints, 0)
    const totalScore = singleSelectScore + multiSelectScore

    // Max possible = sum of max points per question actually asked (both single and multi-select)
    const singleSelectQuestionIds = answers.map(a => a.questionId)
    const multiSelectQuestionIds = multiSelectAnswers.map(a => a.questionId)
    const answeredQuestionIds: number[] = Array.from(
      new Set([...singleSelectQuestionIds, ...multiSelectQuestionIds])
    )

    let maxPossibleScore = 0
    if (answeredQuestionIds.length > 0) {
      const { data: optionPointsByQuestion, error: optErr } = await supabase
        .from('options')
        .select('question_id, points')
        .in('question_id', answeredQuestionIds)

      if (optErr) {
        console.error('Error fetching options by question for max score:', optErr)
        return NextResponse.json({ error: 'Failed to calculate score' }, { status: 500 })
      }

      const questionIdToMax: Record<number, number> = {}
      for (const row of optionPointsByQuestion || []) {
        const qid = Number(row?.question_id)
        const pts = Number(row?.points) || 0
        if (!(qid in questionIdToMax) || pts > questionIdToMax[qid]) {
          questionIdToMax[qid] = pts
        }
      }
      maxPossibleScore = answeredQuestionIds.reduce((sum, qid) => sum + (questionIdToMax[qid] || 0), 0)
    }

    const denominator = maxPossibleScore > 0 ? maxPossibleScore : 1
    const percentage = Math.round((totalScore / denominator) * 100)

    // Determine approval chance (retain chance, but recommendations now come from DB)
    let approvalChance: 'High' | 'Medium' | 'Low'
    if (percentage >= 80) {
      approvalChance = 'High'
    } else if (percentage >= 60) {
      approvalChance = 'Medium'
    } else {
      approvalChance = 'Low'
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
        console.log('Sample option row:', optionRows?.[0])
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
          .map((row) => {
            const titleFromRow = row.rec_title || row.recommendation_title || null
            const descFromRow = row.rec_description || row.recommendation_description || row.recommendation || row.recommendations || null
            const optionText = row.option || row.text || null
            const remark = row.remark

            console.log('Processing option row:', { 
              id: row.id, 
              option: row.option, 
              rec_title: row.rec_title, 
              rec_description: row.rec_description,
              recommendation: row.recommendation,
              recommendations: row.recommendations,
              remark: row.remark 
            })

            // Skip if no recommendation text present
            if (!descFromRow || String(descFromRow).trim() === '') {
              console.log('Skipping option', row.id, 'no recommendation text')
              return null
            }

            const title = String(titleFromRow || optionText || 'Recommendation').trim()
            const description = String(descFromRow).trim()
            const isPositive = remark === true
            console.log('Created recommendation:', { title, description, isPositive })
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
        console.log('Final recommendations count:', recommendations.length)
      }
    } else {
      console.log('No selected option IDs found')
    }

    const result: AssessmentResult = {
      totalScore,
      maxPossibleScore,
      percentage,
      approvalChance,
      recommendations,
      visaType
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
