import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

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


    if (questionsError) {
      console.error('Error fetching questions from database:', questionsError)
      return NextResponse.json({ error: 'Failed to fetch questions from database' }, { status: 500 })
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ 
        success: true, 
        questions: [],
        message: 'No questions found for this visa type in the database'
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
      question_type: string
      options: DBOption[]
    }

    const formattedQuestions = (questions as DBQuestion[] | null)?.map((question) => ({
      id: question.id,
      text: question.question,
      question_type: question.question_type,
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
      questions: formattedQuestions,
      source: 'database'
    })
  } catch (error) {
    console.error('Error in questions API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
