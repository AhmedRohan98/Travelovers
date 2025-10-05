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
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers = [], multiSelectAnswers = [], visaType = 'visit' } = body
    
    console.log('=== CALCULATE API CALLED ===')
    console.log('Visa Type:', visaType)
    console.log('Answers:', answers)
    console.log('MultiSelect Answers:', multiSelectAnswers)

    if (!Array.isArray(answers) || !Array.isArray(multiSelectAnswers)) {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 })
    }

    // No points calculation needed - just generate recommendations

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

            // Skip if no recommendation text present
            if (!descFromRow || String(descFromRow).trim() === '') {
              return null
            }

            const title = String(titleFromRow || optionText || 'Recommendation').trim()
            const description = String(descFromRow).trim()
            const isPositive = remark === true
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
    }

    const result: AssessmentResult = {
      recommendations,
      visaType
    }

    console.log('=== FINAL RESULT ===')
    console.log('Recommendations found:', recommendations.length)
    console.log('Recommendations:', recommendations)

    return NextResponse.json({
      success: true,
      result
    })
  } catch (error) {
    console.error('Error in calculate API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
