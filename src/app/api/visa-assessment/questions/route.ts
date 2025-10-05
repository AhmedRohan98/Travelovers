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
      additional_questions?: number | null
      // Optional recommendation-related columns
      recommendation?: string | null
      recommendations?: string | null
      recommendation_description?: string | null
      rec_description?: string | null
      recommendation_title?: string | null
      rec_title?: string | null
      remark?: boolean | null // true => positive, false => negative
      // Study country recommendations
      recommended_countries?: string[] | string | null
    }

    type DBQuestion = {
      id: number
      question: string
      question_type: string
      section?: number | string | null
      sections?: number | null
      section_name?: string | null
      sectionname?: string | null
      section_title?: string | null
      sectionlabel?: string | null
      options: DBOption[]
    }

    const formattedQuestions = (questions as DBQuestion[] | null)?.map((question) => {
      // Debug: Log questions with country recommendations
      const hasCountryRecommendations = question.options.some(opt => 
        (opt as DBOption).recommended_countries && 
        Array.isArray((opt as DBOption).recommended_countries) && 
        (opt as DBOption).recommended_countries!.length > 0
      )
      if (hasCountryRecommendations) {
        console.log('Question with country recommendations:', question.id, question.options.filter(opt => 
          (opt as DBOption).recommended_countries
        ).map(opt => ({
          id: opt.id,
          text: opt.option,
          recommended_countries: (opt as DBOption).recommended_countries
        })))
      }
      const rawSection = (question.section ?? question.sections ?? 1) as number | string
      const parsedSection = typeof rawSection === 'number' ? rawSection : parseInt(String(rawSection), 10)
      const numericSection = Number.isFinite(parsedSection) && parsedSection >= 1 ? parsedSection : 1

      const explicitSectionName = (
        question.section_name ??
        question.sectionname ??
        question.section_title ??
        question.sectionlabel ??
        null
      ) as string | null

      const rawSectionNameFromSection = typeof rawSection === 'string' && Number.isNaN(parseInt(rawSection, 10))
        ? rawSection
        : null

      return {
        id: question.id,
        text: question.question,
        question_type: question.question_type,
        section: numericSection as number,
        section_name: (explicitSectionName || rawSectionNameFromSection) as string | null,
        visa_type: visaTypeParam,
        options: [...(question.options as DBOption[])]
          .sort((a, b) => a.id - b.id)
          .map((option) => ({
            id: option.id,
            text: option.option,
            points: option.points,
          leads_to_question_id: option.leads_to_question_id,
          additional_questions: (option as DBOption).additional_questions ?? null,
          // Expose recommendation flags
          hasRecommendation: Boolean(
            (option as DBOption).rec_description ??
            (option as DBOption).recommendation_description ??
            (option as DBOption).recommendation ??
            (option as DBOption).recommendations ?? null
          ),
          remark: (option as DBOption).remark ?? null,
          // Study country recommendations
          recommended_countries: (() => {
            const countries = (option as DBOption).recommended_countries
            if (!countries) return null
            // Handle both string and array formats
            if (typeof countries === 'string') {
              try {
                return JSON.parse(countries)
              } catch {
                return countries.split(',').map(c => c.trim()).filter(c => c.length > 0)
              }
            }
            return countries
          })()
          }))
      }
    })

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
