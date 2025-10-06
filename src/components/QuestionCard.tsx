'use client'

import React, { useState } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StudyCountryRecommendations from './StudyCountryRecommendations'

interface Question {
  id: number
  text: string
  question_type: 'mcq' | 'selection'
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
  recommended_countries?: string[] | null
}

interface QuestionCardProps {
  question: Question
  questionNumber: number
  onAnswerSelect: (option: Option) => void
  onMultiSelectConfirm: (selectedOptions: Option[]) => void
  onBack: () => void
  canGoBack: boolean
  isDisabled?: boolean
}

export default function QuestionCard({ 
  question, 
  questionNumber, 
  onAnswerSelect, 
  onMultiSelectConfirm,
  onBack, 
  canGoBack,
  isDisabled = false
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const isMultiSelectMode = question.question_type === 'selection'
  
  // Debug: Force multi-select for question 11
  const forceMultiSelect = question.id === 11
  const actualMultiSelectMode = isMultiSelectMode || forceMultiSelect
  
  // Reset selections when question changes
  React.useEffect(() => {
    console.log('Question changed - ID:', question.id, 'Type:', question.question_type, 'IsMultiSelect:', isMultiSelectMode)
    
    
    setSelectedOption(null)
    setSelectedOptions([])
    setIsAnimating(false)
  }, [question.id, question.question_type, isMultiSelectMode])
  
  // Function to check if an option should be disabled based on current selections
  const isOptionDisabled = (option: Option) => {
    if (!actualMultiSelectMode || selectedOptions.length === 0) {
      return false
    }

    // Special handling for question ID 50
    // Rule: If "None of the mentioned" is selected, disable all other options
    //       If any other option is selected, disable the "None of the mentioned" option
    if (question.id === 50) {
      const normalize = (text: string) => text.trim().toLowerCase()
      const isNoneOption = (opt: Option) => normalize(opt.text) === 'none of the mentioned'
      const anyNoneSelected = selectedOptions.some(isNoneOption)
      const isCurrentlySelected = selectedOptions.some(opt => opt.id === option.id)
      const thisIsNone = isNoneOption(option)

      if (anyNoneSelected) {
        // None is selected → disable all others except the selected none option itself
        return !thisIsNone && !isCurrentlySelected
      }

      // Some other options are selected → disable selecting the none option
      if (thisIsNone) {
        return true
      }

      // Otherwise allow multiple selections freely for Q50
      return false
    }

    // Default multi-select behavior: restrict to same leads_to_question_id group
    const firstSelectedLeadsTo = selectedOptions[0]?.leads_to_question_id
    return option.leads_to_question_id !== firstSelectedLeadsTo
  }

  const handleOptionSelect = (option: Option) => {
    if (actualMultiSelectMode) {
      // Toggle selection for multi-select mode
      setSelectedOptions(prev => {
        const isSelected = prev.some(opt => opt.id === option.id)
        if (isSelected) {
          return prev.filter(opt => opt.id !== option.id)
        } else {
          return [...prev, option]
        }
      })
    } else {
      // Single select mode (MCQ)
      setSelectedOption(option)
      
      // For study visa, don't auto-proceed - let user click Next button
      if (question.visa_type === 'study') {
        return
      }
      
      // For other cases, proceed as before
      setIsAnimating(true)
      setTimeout(() => {
        onAnswerSelect(option)
        setIsAnimating(false)
        setSelectedOption(null)
      }, 500)
    }
  }

  const handleNextClick = () => {
    if (selectedOptions.length > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        onMultiSelectConfirm(selectedOptions)
        setIsAnimating(false)
        setSelectedOptions([])
      }, 300)
    } else if (selectedOption) {
      // Handle single select Next button (for study visa with recommendations)
      setIsAnimating(true)
      setTimeout(() => {
        onAnswerSelect(selectedOption)
        setIsAnimating(false)
        setSelectedOption(null)
      }, 300)
    }
  }

  const getOptionIcon = (option: Option) => {
    if (actualMultiSelectMode) {
      const isSelected = selectedOptions.some(opt => opt.id === option.id)
      if (isSelected) {
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      }
      return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
    } else {
      if (selectedOption?.id === option.id) {
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      }
      return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
    }
  }

  const getOptionStyle = (option: Option) => {
    if (actualMultiSelectMode) {
      const isSelected = selectedOptions.some(opt => opt.id === option.id)
      if (isSelected) {
        return 'border-green-500 bg-green-50 text-green-900'
      }
      return 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
    } else {
      if (selectedOption?.id === option.id) {
        return 'border-green-500 bg-green-50 text-green-900'
      }
      return 'border-gray-200 hover:border-red-300 hover:bg-red-50'
    }
  }

  return (
    <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Main Container with Question and Recommendations */}
      <div className="relative">
        {/* Question Card - Keep Full Width */}
        <div className="bg-white rounded-t-2xl p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {canGoBack && (
              <button
                onClick={onBack}
                disabled={isDisabled}
                className={`mr-4 p-2 rounded-full transition-colors ${
                  isDisabled 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
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
        {actualMultiSelectMode && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <span className="mr-1">☑️</span>
            Multiple Selection {forceMultiSelect ? '' : ''}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="bg-white rounded-b-2xl p-6">
        <div className="space-y-3">
          {question.options.map((option) => {
            const isDisabled = isOptionDisabled(option)
            const isCurrentlySelected = actualMultiSelectMode 
              ? selectedOptions.some(opt => opt.id === option.id)
              : selectedOption?.id === option.id
            
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                disabled={
                  isDisabled ||
                  (!actualMultiSelectMode && selectedOption !== null && question.visa_type !== 'study') || 
                  (actualMultiSelectMode && isDisabled && !isCurrentlySelected)
                }
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center space-x-4 ${
                  isDisabled ||
                  (!actualMultiSelectMode && selectedOption !== null && question.visa_type !== 'study') || 
                  (actualMultiSelectMode && isDisabled && !isCurrentlySelected)
                    ? 'cursor-not-allowed opacity-50' 
                    : 'cursor-pointer'
                } ${getOptionStyle(option)}`}
              >
                {getOptionIcon(option)}
                <div className="flex-1">
                  <span className="font-medium">{option.text}</span>
                  {actualMultiSelectMode && isDisabled && !isCurrentlySelected && (
                    <span className="block text-xs text-gray-400 mt-1">
                      Conflicts with selected options
                    </span>
                  )}
                </div>
                {!actualMultiSelectMode && option.leads_to_question_id && (
                  <ArrowForwardIosIcon className="w-4 h-4 text-gray-400" />
                )}
              </button>
            )
          })}
        </div>

        {/* Selection Summary */}
        {actualMultiSelectMode && selectedOptions.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="text-blue-800">
              <div className="flex items-center mb-2">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span className="font-medium">Selected ({selectedOptions.length}):</span>
              </div>
              <div className="text-sm space-y-1">
                {selectedOptions.map((option) => (
                  <div key={option.id}>
                    <span>• {option.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!actualMultiSelectMode && selectedOption && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center text-green-800">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Selected: {selectedOption.text}</span>
            </div>
          </div>
        )}

        {/* Next Button for Multi-select */}
        {actualMultiSelectMode && selectedOptions.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleNextClick}
              disabled={isAnimating}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Next Button for Study Visa Single Select */}
        {!actualMultiSelectMode && selectedOption && question.visa_type === 'study' && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleNextClick}
              disabled={isAnimating}
              className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue Assessment
            </button>
          </div>
        )}
        </div>

        {/* Helper Text */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            {actualMultiSelectMode 
              ? 'Select all options that apply to your situation, then click Next'
              : 'Choose the option that best describes your situation'
            }
          </p>
        </div>

        {/* Study Country Recommendations - Beside on Desktop */}
        {!actualMultiSelectMode && selectedOption && question.visa_type === 'study' && selectedOption.recommended_countries && selectedOption.recommended_countries.length > 0 && (
          <div className="absolute top-24 right-0 transform translate-x-full ml-4 hidden lg:block">
            <StudyCountryRecommendations 
              countries={selectedOption.recommended_countries}
            />
          </div>
        )}
      </div>

      {/* Study Country Recommendations - Below on Mobile */}
      {!actualMultiSelectMode && selectedOption && question.visa_type === 'study' && selectedOption.recommended_countries && selectedOption.recommended_countries.length > 0 && (
        <div className="mt-4 lg:hidden">
          <StudyCountryRecommendations 
            countries={selectedOption.recommended_countries}
          />
        </div>
      )}
    </div>
  )
}