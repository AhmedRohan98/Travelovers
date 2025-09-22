'use client'

import { useState } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

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

interface QuestionCardProps {
  question: Question
  questionNumber: number
  onAnswerSelect: (option: Option) => void
  onBack: () => void
  canGoBack: boolean
}

export default function QuestionCard({ 
  question, 
  questionNumber, 
  onAnswerSelect, 
  onBack, 
  canGoBack 
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option)
    setIsAnimating(true)
    
    setTimeout(() => {
      onAnswerSelect(option)
      setIsAnimating(false)
      setSelectedOption(null)
    }, 500)
  }

  const getOptionIcon = (option: Option) => {
    if (selectedOption?.id === option.id) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    }
    return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
  }

  const getOptionStyle = (option: Option) => {
    if (selectedOption?.id === option.id) {
      return 'border-green-500 bg-green-50 text-green-900'
    }
    return 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
  }

  return (
    <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Header */}
      <div className="bg-white rounded-t-2xl p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {canGoBack && (
              <button
                onClick={onBack}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowBackIosIcon className="w-5 h-5" />
              </button>
            )}
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Question {questionNumber}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {question.visa_type.charAt(0).toUpperCase() + question.visa_type.slice(1)} Visa
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {question.text}
        </h3>
      </div>

      {/* Options */}
      <div className="bg-white rounded-b-2xl p-6">
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center space-x-4 ${
                selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer'
              } ${getOptionStyle(option)}`}
            >
              {getOptionIcon(option)}
              <div className="flex-1">
                <span className="font-medium">{option.text}</span>
              </div>
              {option.leads_to_question_id && (
                <ArrowForwardIosIcon className="w-4 h-4 text-gray-400" />
              )}
            </button>
          ))}
        </div>

        {selectedOption && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center text-green-800">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Selected: {selectedOption.text}</span>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Choose the option that best describes your situation
        </p>
      </div>
    </div>
  )
}