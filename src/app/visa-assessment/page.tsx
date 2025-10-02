'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import VisaTypeSelector from '@/components/VisaTypeSelector'
import QuestionCard from '@/components/QuestionCard'
import AssessmentProgress from '@/components/AssessmentProgress'
import ResultsDisplay from '@/components/ResultsDisplay'
import CountryRoutingButton from '@/components/CountryRoutingButton'

interface Question {
  id: number
  text: string
  question_type: 'mcq' | 'selection'
  section?: number
  section_name?: string | null
  visa_type: string
  options: Option[]
}

interface Option {
  id: number
  text: string
  points: number
  leads_to_question_id: number | null
  additional_questions?: number | null
  hasRecommendation?: boolean
  remark?: boolean | null
}

interface Answer {
  questionId: number
  optionId: number
  points: number
  questionText: string
  selectedOption: string
}

interface MultiSelectAnswer {
  questionId: number
  questionText: string
  selectedOptions: Array<{
    optionId: number
    optionText: string
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
  const [multiSelectAnswers, setMultiSelectAnswers] = useState<MultiSelectAnswer[]>([])
  const [questionHistory, setQuestionHistory] = useState<number[]>([])
  const [pendingQuestions, setPendingQuestions] = useState<number[]>([]) // Track questions to ask after current path
  const [scheduledAdditionalQuestionIds, setScheduledAdditionalQuestionIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const fetchQuestions = async (type: 'visit' | 'study') => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching questions for type:', type)
      const response = await fetch(`/api/visa-assessment/questions?visa_type=${type}`)
      console.log('Response status:', response.status, response.ok)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success) {
        const fetchedQuestions: Question[] = data.questions

        if (fetchedQuestions.length === 0) {
          setError(`No questions found for ${type} visa type in the database. Please contact support.`)
          return
        }

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
        setError(data.error || 'Failed to fetch questions from database')
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      setError('Network error. Please check your connection and try again.')
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

    // Capture country selection from first question
    if (question.id === 1) {
      setSelectedCountry(option.text)
    }

    // Capture additional questions from Q1 selection if present
    if (question.id === 1 && option.additional_questions) {
      setScheduledAdditionalQuestionIds(prev => {
        if (prev.includes(option.additional_questions!)) return prev
        return [...prev, option.additional_questions!]
      })
    }

    // Check for pending questions first - if there are pending questions from question 50,
    // we should ask those before continuing down any path
    if (pendingQuestions.length > 0) {
      checkForPendingQuestions()
      return
    }

    // Handle conditional navigation
    if (option.leads_to_question_id) {
      // Navigate to specific question by ID
      const targetQuestion = questions.find(q => q.id === option.leads_to_question_id)
      if (targetQuestion) {
        const targetIndex = questions.findIndex(q => q.id === option.leads_to_question_id)
        setQuestionHistory(prev => [...prev, currentQuestionIndex])
        setCurrentQuestionIndex(targetIndex)
      } else {
        // If target question not found, check for pending questions
        checkForPendingQuestions()
      }
    } else {
      // No specific next question, check for pending questions
      checkForPendingQuestions()
    }
  }

  // Helper function to check if there are pending questions to ask
  const checkForPendingQuestions = () => {
    if (pendingQuestions.length > 0) {
      // Get the next pending question
      const nextPendingIndex = pendingQuestions[0]
      const remainingPending = pendingQuestions.slice(1)
      
      // Add current question to history and navigate to pending question
      setQuestionHistory(prev => [...prev, currentQuestionIndex])
      setPendingQuestions(remainingPending)
      setCurrentQuestionIndex(nextPendingIndex)
    } else {
      // If we are at the end of section 3 and have scheduled additional questions, enqueue them now
      const currentQ = questions[currentQuestionIndex]
      const currentSectionName = (currentQ?.section_name || 'PROFILING').toUpperCase()
      const sectionNamesOrdered: string[] = []
      for (const q of questions) {
        const name = (q.section_name || 'PROFILING').toUpperCase()
        if (!sectionNamesOrdered.includes(name)) sectionNamesOrdered.push(name)
      }
      const isEndOfSection3 = sectionNamesOrdered[2] && currentSectionName === sectionNamesOrdered[2]

      if (isEndOfSection3 && scheduledAdditionalQuestionIds.length > 0) {
        const indices = scheduledAdditionalQuestionIds
          .map(id => questions.findIndex(q => q.id === id))
          .filter(idx => idx !== -1)
        if (indices.length > 0) {
          setPendingQuestions(indices)
          setScheduledAdditionalQuestionIds([])
          // Immediately process the first of these pending questions
          const nextIndex = indices[0]
          const remaining = indices.slice(1)
          setQuestionHistory(prev => [...prev, currentQuestionIndex])
          setPendingQuestions(remaining)
          setCurrentQuestionIndex(nextIndex)
          return
        }
      }

      // No more questions to ask, end assessment
      calculateResults()
    }
  }

  const handleMultiSelectConfirm = (selectedOptions: Option[], question: Question) => {
    const newMultiSelectAnswer: MultiSelectAnswer = {
      questionId: question.id,
      questionText: question.text,
      selectedOptions: selectedOptions.map(option => ({
        optionId: option.id,
        optionText: option.text,
        points: option.points
      })),
      totalPoints: selectedOptions.reduce((sum, option) => sum + option.points, 0)
    }

    setMultiSelectAnswers(prev => [...prev, newMultiSelectAnswer])

    // Special handling for question ID 50 - handle multiple branching paths
    if (question.id === 50) {
      // Get all unique leads_to_question_id values from selected options
      const uniqueLeadsTo = [...new Set(selectedOptions
        .map(option => option.leads_to_question_id)
        .filter(id => id !== null)
      )] as number[]
      
      if (uniqueLeadsTo.length > 0) {
        // Find the question indices for the target questions
        const targetQuestionIndices = uniqueLeadsTo
          .map(questionId => questions.findIndex(q => q.id === questionId))
          .filter(index => index !== -1)
        
        if (targetQuestionIndices.length > 0) {
          // Navigate to the first question
          const firstTargetIndex = targetQuestionIndices[0]
          
          // Store the remaining questions as pending (these are the immediate follow-ups)
          const remainingIndices = targetQuestionIndices.slice(1)
          setPendingQuestions(prev => [...prev, ...remainingIndices])
          
          // Add current question to history and navigate to first target
          setQuestionHistory(prev => [...prev, currentQuestionIndex])
          setCurrentQuestionIndex(firstTargetIndex)
        } else {
          calculateResults()
        }
      } else {
        calculateResults()
      }
    } else {
      // For other multi-select questions, navigation is based on leads_to_question_id
      // Since we've already ensured all selected options have the same leads_to_question_id
      // (through the disabled logic), we can safely use the first option's leads_to_question_id
      
      const targetQuestionId = selectedOptions[0]?.leads_to_question_id
      
      if (targetQuestionId) {
        const targetQuestion = questions.find(q => q.id === targetQuestionId)
        if (targetQuestion) {
          const targetIndex = questions.findIndex(q => q.id === targetQuestionId)
          setQuestionHistory(prev => [...prev, currentQuestionIndex])
          setCurrentQuestionIndex(targetIndex)
        } else {
          // If target question not found, check for pending questions
          checkForPendingQuestions()
        }
      } else {
        // If no leads_to_question_id, check for pending questions
        checkForPendingQuestions()
      }
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
          multiSelectAnswers,
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
    setMultiSelectAnswers([])
    setQuestionHistory([])
    setPendingQuestions([])
    setError(null)
    setResult(null)
    setSelectedCountry(null)
  }

  const currentQuestion = questions[currentQuestionIndex]

  // Determine current section (1-4) and section progress
  const currentSectionName = (currentQuestion?.section_name || 'PROFILING').toUpperCase()
  // Build ordered, unique section names list based on the question order
  const sectionNames: string[] = []
  for (const q of questions) {
    const name = (q.section_name || 'PROFILING').toUpperCase()
    if (!sectionNames.includes(name)) sectionNames.push(name)
  }
  
  // Calculate progress based on answered questions
  // Since the assessment flow is dynamic, we'll show progress based on questions answered
  const totalAnsweredQuestions = answers.length + multiSelectAnswers.length
  const currentQuestionNumber = totalAnsweredQuestions + 1
  
  // For progress bar, we'll use a simple approach: show progress based on questions answered
  // with a reasonable maximum to avoid showing 100% too early
  const maxReasonableQuestions = 25 // Most assessments won't exceed this
  const progress = Math.min((totalAnsweredQuestions / maxReasonableQuestions) * 100, 95) // Cap at 95% until completion

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
              Exit
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Visa Application Strength Check</h1>
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
              current={currentQuestionNumber}
              progress={progress}
            sectionNames={sectionNames}
            currentSectionName={currentSectionName}
            />
            
            <QuestionCard
              question={currentQuestion}
              questionNumber={answers.length + multiSelectAnswers.length + 1}
              onAnswerSelect={(option) => handleAnswerSelect(option, currentQuestion)}
              onMultiSelectConfirm={(selectedOptions) => handleMultiSelectConfirm(selectedOptions, currentQuestion)}
              onBack={goBack}
              canGoBack={questionHistory.length > 0}
            />

            {/* Show country routing after first question is answered */}
            {selectedCountry && answers.length > 0 && (
              <div className="flex justify-center items-center">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Checkout {selectedCountry} Document Requirements Now
                  </h3>
                  <CountryRoutingButton 
                    selectedCountry={selectedCountry}
                    visaType={visaType}
                    showAfterFirstQuestion={true}
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {currentStep === 'results' && result && (
          <div className="space-y-6">
            <ResultsDisplay
              result={result}
              answers={answers}
              multiSelectAnswers={multiSelectAnswers}
              onRestart={resetAssessment}
            />
            
            {/* Show country routing on results page as well */}
            {selectedCountry && answers.length > 0 && (
              <div className="flex justify-center items-center">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Checkout {selectedCountry} Document Requirements Now
                  </h3>
                  <CountryRoutingButton 
                    selectedCountry={selectedCountry}
                    visaType={visaType}
                    showAfterFirstQuestion={true}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600 font-bold">!</span>
                </div>
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null)
                  setCurrentStep('type-selection')
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
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
