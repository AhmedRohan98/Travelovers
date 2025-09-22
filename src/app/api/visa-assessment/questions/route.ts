import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'
import { getQuestionsByVisaType } from '@/lib/data/visaQuestions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visaTypeParam = searchParams.get('visa_type') || 'visit'
    
    // Convert visa type string to numeric ID
    const visaTypeId = visaTypeParam === 'study' ? 2 : 1

    // Fetch questions with their options using proper joins
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select(`
        *,
        options (*),
        visa_type!inner(id, type)
      `)
      .eq('visa_type_id', visaTypeId)
      .order('id')


    if (questionsError || !questions || questions.length === 0) {
      
      // Fallback to sample data
      const sampleQuestions = getQuestionsByVisaType(visaTypeParam)
      const formattedQuestions = sampleQuestions.map(question => ({
        id: question.id,
        text: question.question,
        visa_type: visaTypeParam,
        options: question.options.map(option => ({
          id: option.id,
          text: option.option,
          points: option.points,
          leads_to_question_id: option.leads_to_question_id
        }))
      }))

      return NextResponse.json({
        success: true,
        questions: formattedQuestions,
        source: 'sample_data'
      })
    }

    // Format the response using correct column names
    type DBOption = {
      id: number
      option: string
      points: number
      leads_to_question_id: number | null
    }

    type DBQuestion = {
      id: number
      question: string
      options: DBOption[]
    }

    const formattedQuestions = (questions as DBQuestion[] | null)?.map((question) => ({
      id: question.id,
      text: question.question,
      visa_type: visaTypeParam, // Use the original visaType string for consistency
      options: (question.options as DBOption[]).map((option) => ({
        id: option.id,
        text: option.option,
        points: option.points,
        leads_to_question_id: option.leads_to_question_id
      }))
    }))

    return NextResponse.json({
      success: true,
      questions: formattedQuestions
    })
  } catch (error) {
    console.error('Error in questions API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
