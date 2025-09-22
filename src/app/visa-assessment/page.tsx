'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import VisaTypeSelector from '@/components/VisaTypeSelector'
import QuestionCard from '@/components/QuestionCard'
import AssessmentProgress from '@/components/AssessmentProgress'
import ResultsDisplay from '@/components/ResultsDisplay'

interface Question {
  id: number
  text: string
  visa_type: string
  options: Option[]
}

interface Option {
  id: number
  text: string
  points: number
  leads_to_question_id: number | null
}

interface Answer {
  questionId: number
  optionId: number
  points: number
  questionText: string
  selectedOption: string
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

export default function VisaAssessmentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'type-selection' | 'questions' | 'results'>('type-selection')
  const [visaType, setVisaType] = useState<'visit' | 'study'>('visit')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [questionHistory, setQuestionHistory] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)

  const fetchQuestions = async (type: 'visit' | 'study') => {
    setLoading(true)
    try {
      const response = await fetch(`/api/visa-assessment/questions?visa_type=${type}`)
      const data = await response.json()
      
      if (data.success) {
        const fetchedQuestions: Question[] = data.questions

        // Determine start question:
        // Prefer a question that is not a child AND has at least one outgoing lead
        const childIds = new Set<number>()
        for (const q of fetchedQuestions) {
          for (const opt of q.options) {
            if (opt.leads_to_question_id) childIds.add(opt.leads_to_question_id)
          }
        }
        const hasLead = (q: Question) => q.options.some(o => !!o.leads_to_question_id)
        let root = fetchedQuestions.find(q => !childIds.has(q.id) && hasLead(q))
        if (!root) root = fetchedQuestions.find(q => hasLead(q)) || fetchedQuestions[0]

        setQuestions(fetchedQuestions)
        setCurrentQuestionIndex(fetchedQuestions.findIndex(q => q.id === root.id))
        setCurrentStep('questions')
      } else {
        console.error('Failed to fetch questions:', data.error)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVisaTypeSelect = (type: 'visit' | 'study') => {
    setVisaType(type)
    fetchQuestions(type)
  }

  const handleAnswerSelect = (option: Option, question: Question) => {
    const newAnswer: Answer = {
      questionId: question.id,
      optionId: option.id,
      points: option.points,
      questionText: question.text,
      selectedOption: option.text
    }

    setAnswers(prev => [...prev, newAnswer])

    // Handle conditional navigation
    if (option.leads_to_question_id) {
      // Navigate to specific question by ID
      const targetQuestion = questions.find(q => q.id === option.leads_to_question_id)
      if (targetQuestion) {
        const targetIndex = questions.findIndex(q => q.id === option.leads_to_question_id)
        setQuestionHistory(prev => [...prev, currentQuestionIndex])
        setCurrentQuestionIndex(targetIndex)
      } else {
        // If target question not found, end assessment
        calculateResults()
      }
    } else {
      // No specific next question, end assessment here
      calculateResults()
    }
  }

  // Removed sequential fallback to satisfy strict leads-only flow

  const goBack = () => {
    if (questionHistory.length > 0) {
      const previousIndex = questionHistory[questionHistory.length - 1]
      setQuestionHistory(prev => prev.slice(0, -1))
      setCurrentQuestionIndex(previousIndex)
      // Remove the last answer
      setAnswers(prev => prev.slice(0, -1))
    }
  }

  const calculateResults = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/visa-assessment/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          visaType
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data.result)
        setCurrentStep('results')
      } else {
        console.error('Failed to calculate results:', data.error)
      }
    } catch (error) {
      console.error('Error calculating results:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetAssessment = () => {
    setCurrentStep('type-selection')
    setQuestions([])
    setCurrentQuestionIndex(0)
    setAnswers([])
    setQuestionHistory([])
    setResult(null)
  }

  const currentQuestion = questions[currentQuestionIndex]
  // Calculate progress based on answered questions vs total questions
  const progress = questions.length > 0 ? (answers.length / questions.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowBackIosIcon className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Visa Assessment</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentStep === 'type-selection' && (
          <VisaTypeSelector 
            onSelect={handleVisaTypeSelect}
            loading={loading}
          />
        )}

        {currentStep === 'questions' && currentQuestion && (
          <div className="space-y-6">
            <AssessmentProgress 
              current={answers.length + 1}
              total={questions.length}
              progress={progress}
            />
            
            <QuestionCard
              question={currentQuestion}
              questionNumber={answers.length + 1}
              onAnswerSelect={(option) => handleAnswerSelect(option, currentQuestion)}
              onBack={goBack}
              canGoBack={questionHistory.length > 0}
            />
          </div>
        )}

        {currentStep === 'results' && result && (
          <ResultsDisplay
            result={result}
            answers={answers}
            onRestart={resetAssessment}
          />
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  )
}
