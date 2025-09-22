'use client'

import { useState } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RefreshIcon from '@mui/icons-material/Refresh'
import ShareIcon from '@mui/icons-material/Share'

interface AssessmentResult {
  totalScore: number
  maxPossibleScore: number
  percentage: number
  approvalChance: 'High' | 'Medium' | 'Low'
  recommendations: string[]
  visaType: string
}

interface Answer {
  questionId: number
  optionId: number
  points: number
  questionText: string
  selectedOption: string
}

interface ResultsDisplayProps {
  result: AssessmentResult
  answers: Answer[]
  onRestart: () => void
}

export default function ResultsDisplay({ result, answers, onRestart }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'details'>('overview')

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Visa Assessment Results',
        text: `My visa approval chance is ${result.approvalChance} (${result.percentage}%)`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Visa Assessment Results: ${result.approvalChance} approval chance (${result.percentage}%)`
      )
      alert('Results copied to clipboard!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Assessment Complete! 🎉
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
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                    <CheckCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">Your Answers</h4>
              <div className="space-y-4">
                {answers.map((answer, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">Question {index + 1}</span>
                      <span className="text-sm text-gray-500">+{answer.points} points</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-2">{answer.questionText}</p>
                    <p className="text-gray-700">{answer.selectedOption}</p>
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
          onClick={handleShare}
          className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
        >
          <ShareIcon className="w-5 h-5 mr-2" />
          Share Results
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