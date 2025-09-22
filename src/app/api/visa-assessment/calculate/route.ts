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
  recommendations: Array<{
    title: string
    description: string
  }>
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
    let recommendations: Array<{ title: string; description: string }> = []

    if (percentage >= 80) {
      approvalChance = 'High'
      recommendations = [
        {
          title: 'Strong Application Profile',
          description: 'Your visa application has a strong chance of approval based on your current profile.'
        },
        {
          title: 'Maintain Current Standards',
          description: 'Continue maintaining your current profile and ensure all documentation remains accurate.'
        },
        {
          title: 'Documentation Review',
          description: 'Ensure all documentation is complete, accurate, and up-to-date before submission.'
        },
        {
          title: 'Apply with Confidence',
          description: 'You have a solid foundation for visa approval - proceed with confidence.'
        }
      ]
    } else if (percentage >= 60) {
      approvalChance = 'Medium'
      recommendations = [
        {
          title: 'Moderate Approval Chance',
          description: 'Your visa application has a moderate chance of approval with some areas for improvement.'
        },
        {
          title: 'Financial Documentation',
          description: 'Consider strengthening your financial documentation and showing consistent income sources.'
        },
        {
          title: 'Travel History',
          description: 'Improve your travel history if possible by visiting visa-compliant countries first.'
        },
        {
          title: 'Home Country Ties',
          description: 'Ensure strong ties to your home country through employment, family, or property ownership.'
        },
        {
          title: 'Professional Consultation',
          description: 'Consider getting professional visa consultation to optimize your application.'
        }
      ]
    } else {
      approvalChance = 'Low'
      recommendations = [
        {
          title: 'Application Challenges',
          description: 'Your visa application may face challenges that need to be addressed before applying.'
        },
        {
          title: 'Financial Position',
          description: 'Strengthen your financial position and provide comprehensive financial documentation.'
        },
        {
          title: 'Home Country Ties',
          description: 'Build stronger ties to your home country through stable employment or business ownership.'
        },
        {
          title: 'Language Skills',
          description: 'Consider improving your language skills and obtaining relevant certifications.'
        },
        {
          title: 'Professional Help',
          description: 'Seek professional visa consultation to identify and address application weaknesses.'
        },
        {
          title: 'Alternative Options',
          description: 'Consider alternative visa categories or countries that may have more favorable requirements.'
        }
      ]
    }

    // Add visa-specific recommendations
    if (visaType === 'visit') {
      recommendations.push(
        {
          title: 'Travel Itinerary',
          description: 'Provide detailed itinerary and confirmed accommodation bookings for your visit.'
        },
        {
          title: 'Return Proof',
          description: 'Show proof of return ticket and sufficient funds for the entire duration of stay.'
        },
        {
          title: 'Home Country Connections',
          description: 'Demonstrate strong family, employment, or business ties to your home country.'
        }
      )
    } else if (visaType === 'study') {
      recommendations.push(
        {
          title: 'Educational Institution',
          description: 'Secure admission to a recognized educational institution with good reputation.'
        },
        {
          title: 'Financial Capacity',
          description: 'Demonstrate sufficient funds for tuition fees and living expenses throughout your studies.'
        },
        {
          title: 'Academic Preparation',
          description: 'Show strong academic qualifications and meet language proficiency requirements.'
        },
        {
          title: 'Study Plan',
          description: 'Provide a clear study plan and demonstrate future career goals aligned with your studies.'
        }
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
