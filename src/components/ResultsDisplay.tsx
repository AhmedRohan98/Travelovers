'use client'

import { useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RefreshIcon from '@mui/icons-material/Refresh'
import DownloadIcon from '@mui/icons-material/Download'

interface AssessmentResult {
  recommendations: Array<{
    title: string
    description: string
    isPositive?: boolean
  }>
  visaType: string
  score?: number
  maxScore?: number
  scorePercentage?: number
}

interface Answer {
  questionId: number
  optionId: number
  questionText: string
  selectedOption: string
}

interface MultiSelectAnswer {
  questionId: number
  questionText: string
  selectedOptions: Array<{
    optionId: number
    optionText: string
  }>
}

interface ResultsDisplayProps {
  result: AssessmentResult
  answers: Answer[]
  multiSelectAnswers?: MultiSelectAnswer[]
  onRestart: () => void
}

export default function ResultsDisplay({ result, answers, multiSelectAnswers = [], onRestart }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'overview' | 'details'>('recommendations')
  const [isDownloading, setIsDownloading] = useState(false)



  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch('/api/visa-assessment/download-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          multiSelectAnswers,
          visaType: result.visaType,
          results: result
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `Application Strength Test.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Assessment Complete!
        </h2>
        <p className="text-lg text-gray-600">
          Here are your visa approval results
        </p>
      </div>

      {/* Main Result Card */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Assessment Complete
          </h3>
          
          <p className="text-gray-600">
            Review your personalized recommendations below
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6">
            {(
              [
                { id: 'recommendations', label: 'Recommendations' },
                { id: 'overview', label: 'Overview' },
                { id: 'details', label: 'Details' }
              ] as Array<{ id: 'overview' | 'recommendations' | 'details'; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score Display for Visit Visa Type */}
              {result.visaType === 'visit' && result.score !== undefined && result.maxScore !== undefined && (
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Your Application Strength Score</h4>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 50}`}
                          strokeDashoffset={`${2 * Math.PI * 50 * (1 - (result.scorePercentage || 0) / 100)}`}
                          className="text-blue-600 transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">
                          {result.scorePercentage || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      Score: {result.score} / {result.maxScore}
                    </div>
                    <div className="text-sm text-gray-600">
                      {result.scorePercentage && result.scorePercentage >= 70 ? (
                        <span className="text-green-600 font-medium">Strong Application</span>
                      ) : result.scorePercentage && result.scorePercentage >= 50 ? (
                        <span className="text-yellow-600 font-medium">Moderate Application</span>
                      ) : (
                        <span className="text-red-600 font-medium">Needs Improvement</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Assessment Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visa Type</span>
                    <span className="font-medium capitalize">{result.visaType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions Answered</span>
                    <span className="font-medium">{answers.length + multiSelectAnswers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assessment Date</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">Recommendations</h4>
              <div className="space-y-3">
                {result.recommendations.map((recommendation, index) => {
                  const isPositive = recommendation.isPositive === true
                  const isNegative = recommendation.isPositive === false
                  
                  return (
                    <div key={index} className={`flex items-start space-x-3 p-4 rounded-xl ${
                      isPositive ? 'bg-green-50 border border-green-200' : 
                      isNegative ? 'bg-red-50 border border-red-200' : 
                      'bg-blue-50 border border-blue-200'
                    }`}>
                      {isPositive ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : isNegative ? (
                        <span className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0 text-xl">✗</span>
                      ) : (
                        <CheckCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <h5 className={`font-medium mb-1 ${
                          isPositive ? 'text-green-900' : 
                          isNegative ? 'text-red-900' : 
                          'text-gray-900'
                        }`}>
                          {recommendation.title}
                        </h5>
                        <p className={`${
                          isPositive ? 'text-green-700' : 
                          isNegative ? 'text-red-700' : 
                          'text-gray-700'
                        }`}>
                          {recommendation.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">Your Answers</h4>
              <div className="space-y-4">
                {/* Single-select answers */}
                {answers.map((answer, index) => (
                  <div key={`single-${index}`} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">Question {index + 1}</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-2">{answer.questionText}</p>
                    <p className="text-gray-700">{answer.selectedOption}</p>
                  </div>
                ))}
                
                {/* Multi-select answers */}
                {multiSelectAnswers.map((answer, index) => (
                  <div key={`multi-${index}`} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">Question {answers.length + index + 1}</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-2">{answer.questionText}</p>
                    <div className="space-y-1">
                      {answer.selectedOptions.map((option, optionIndex) => (
                        <div key={optionIndex} className="text-gray-700">
                          <span>• {option.optionText}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          <RefreshIcon className="w-5 h-5 mr-2" />
          Take Assessment Again
        </button>
        
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          {isDownloading ? 'Generating...' : 'Download PDF Report'}
        </button>
        

      </div>

      {/* Disclaimer */}
      <div className="text-center">
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          This assessment is for informational purposes only and does not guarantee visa approval. 
          Visa decisions are made by consular officers based on various factors not covered in this assessment.
        </p>
      </div>
    </div>
  )
}