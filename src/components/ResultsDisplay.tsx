'use client'

import { useState } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RefreshIcon from '@mui/icons-material/Refresh'
import DownloadIcon from '@mui/icons-material/Download'

interface AssessmentResult {
  totalScore: number
  maxPossibleScore: number
  percentage: number
  approvalChance: 'High' | 'Medium' | 'Low'
  recommendations: Array<{
    title: string
    description: string
    isPositive?: boolean
  }>
  visaType: string
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

interface ResultsDisplayProps {
  result: AssessmentResult
  answers: Answer[]
  multiSelectAnswers?: MultiSelectAnswer[]
  onRestart: () => void
}

export default function ResultsDisplay({ result, answers, multiSelectAnswers = [], onRestart }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'details'>('overview')
  const [isDownloading, setIsDownloading] = useState(false)

  const getApprovalIcon = () => {
    switch (result.approvalChance) {
      case 'High':
        return <TrendingUpIcon className="w-8 h-8 text-green-500" />
      case 'Medium':
        return <TrendingFlatIcon className="w-8 h-8 text-yellow-500" />
      case 'Low':
        return <TrendingDownIcon className="w-8 h-8 text-red-500" />
    }
    return null
  }

  const getApprovalColor = () => {
    switch (result.approvalChance) {
      case 'High':
        return 'text-green-600 bg-green-100'
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'Low':
        return 'text-red-600 bg-red-100'
    }
    return 'text-gray-600 bg-gray-100'
  }

  const getScoreColor = () => {
    if (result.percentage >= 80) return 'text-green-600'
    if (result.percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBarColor = () => {
    if (result.percentage >= 80) return 'from-green-500 to-green-600'
    if (result.percentage >= 60) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }


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
            {getApprovalIcon()}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {result.approvalChance} Approval Chance
          </h3>
          
          <div className="flex justify-center mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getApprovalColor()}`}>
              {result.percentage}% Score
            </span>
          </div>

          {/* Score Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>0</span>
              <span className="font-medium">Your Score: {result.totalScore}</span>
              <span>{result.maxPossibleScore}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full bg-gradient-to-r ${getScoreBarColor()} transition-all duration-1000 ease-out`}
                style={{ width: `${result.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'recommendations', label: 'Recommendations' },
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
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Score Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Score</span>
                      <span className="font-medium">{result.totalScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Possible</span>
                      <span className="font-medium">{result.maxPossibleScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Percentage</span>
                      <span className={`font-bold ${getScoreColor()}`}>{result.percentage}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Visa Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visa Type</span>
                      <span className="font-medium capitalize">{result.visaType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions Answered</span>
                      <span className="font-medium">{answers.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assessment Date</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
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
                      <span className="text-sm text-gray-500">+{answer.points} points</span>
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
                      <span className="text-sm text-gray-500">+{answer.totalPoints} points</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-2">{answer.questionText}</p>
                    <div className="space-y-1">
                      {answer.selectedOptions.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center justify-between text-gray-700">
                          <span>• {option.optionText}</span>
                          <span className="text-sm text-gray-500">+{option.points} pts</span>
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