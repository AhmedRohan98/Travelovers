import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

interface Answer {
  questionId: number
  optionId: number
  points: number
}

interface AssessmentResult {
  totalScore: number
  maxPossibleScore: number
  percentage: number
  approvalChance: 'High' | 'Medium' | 'Low'
  recommendations: string[]
  visaType: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, visaType = 'visit' } = body

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 })
    }

    // Convert visa type string to numeric ID (not needed for max calc now)

    // Calculate total score
    const totalScore = answers.reduce((sum: number, answer: Answer) => sum + answer.points, 0)

    // Max possible = sum of max points per question actually asked (answers' questionIds)
    const answeredQuestionIds: number[] = Array.from(
      new Set((answers as Answer[]).map(a => a.questionId))
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

    // Determine approval chance
    let approvalChance: 'High' | 'Medium' | 'Low'
    let recommendations: string[] = []

    if (percentage >= 80) {
      approvalChance = 'High'
      recommendations = [
        'Your visa application has a strong chance of approval',
        'Continue maintaining your current profile',
        'Ensure all documentation is complete and accurate',
        'Apply with confidence'
      ]
    } else if (percentage >= 60) {
      approvalChance = 'Medium'
      recommendations = [
        'Your visa application has a moderate chance of approval',
        'Consider strengthening your financial documentation',
        'Improve your travel history if possible',
        'Ensure strong ties to your home country',
        'Consider getting professional consultation'
      ]
    } else {
      approvalChance = 'Low'
      recommendations = [
        'Your visa application may face challenges',
        'Strengthen your financial position and documentation',
        'Build stronger ties to your home country',
        'Consider improving your language skills',
        'Seek professional visa consultation',
        'Consider alternative visa categories if applicable'
      ]
    }

    // Add visa-specific recommendations
    if (visaType === 'visit') {
      recommendations.push(
        'Provide detailed itinerary and accommodation bookings',
        'Show proof of return ticket and sufficient funds',
        'Demonstrate strong family/employment ties to home country'
      )
    } else if (visaType === 'study') {
      recommendations.push(
        'Secure admission to a recognized educational institution',
        'Demonstrate sufficient funds for tuition and living expenses',
        'Show academic qualifications and language proficiency',
        'Provide study plan and future career goals'
      )
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
