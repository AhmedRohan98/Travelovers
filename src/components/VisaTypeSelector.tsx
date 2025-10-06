'use client'

import { useState } from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

interface VisaTypeSelectorProps {
  onSelect: (type: 'visit' | 'study') => void
  onResume?: () => void
  loading: boolean
  hasResumableState?: boolean
}

export default function VisaTypeSelector({ onSelect, onResume, loading, hasResumableState }: VisaTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<'visit' | 'study' | null>(null)

  const handleSelect = (type: 'visit' | 'study') => {
    setSelectedType(type)
    setTimeout(() => onSelect(type), 300) // Small delay for animation
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Visa Type
        </h2>
        <p className="text-lg text-gray-600">
          Select the type of visa you&apos;re applying for to get a personalized assessment
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Visit Visa */}
        <div
          className={`relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
            selectedType === 'visit'
              ? 'border-black-500 bg-gradient-to-b from-blue-200 to-blue-400 shadow-lg scale-105'
              : 'border-black-200 bg-gradient-to-b from-blue-100 to-blue-300 hover:border-black-300 hover:shadow-md'
          }`}
          
          onClick={() => handleSelect('visit')}
        >
<div className="text-center p-6 rounded-lg relative">
  <h3 className="text-4xl font-semibold text-gray-900 mb-1">
    Visit Visa
  </h3>
  <p className="mb-2">Free Assessment</p>
  <div className="flex justify-center relative">
    <p className="whitespace-nowrap relative top-[50px]">Get Your Application Strength</p>
  </div>
</div>



          
          {selectedType === 'visit' && (
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <ArrowForwardIosIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Study Visa */}
        <div
          className={`relative p-8 rounded-2xl border-2 border-black-200 transition-all duration-300 cursor-pointer group ${
            selectedType === 'visit'
              ? 'border-black-500 bg-gradient-to-b from-green-200 to-green-400 shadow-lg scale-105'
              : 'border-black-200 bg-gradient-to-b from-green-100 to-green-300 hover:border-black-300 hover:shadow-md'
          }`}
          onClick={() => handleSelect('study')}
        >
          <div className="text-center p-6 rounded-lg">
            <h3 className="text-4xl font-semibold text-gray-900 mb-1">
              Study Visa
            </h3>
            <p className="mb-6">Eligibility Check</p>
            <div className="flex justify-center relative">
              <p className="whitespace-nowrap relative top-[35px]">Get to know where you can apply</p>
            </div>
          </div>
          
          {selectedType === 'study' && (
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <ArrowForwardIosIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            Loading questions...
          </div>
        </div>
      )}

      {/* Resume Assessment Button */}
      {hasResumableState && onResume && (
        <div className="text-center mt-6">
          <button
            onClick={onResume}
            className="px-6 py-3 bg-red-400 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium border border-gray-300"
          >
            📋 Resume Previous Assessment
          </button>
        </div>
      )}

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Don&apos;t worry - you can change your selection at any time during the assessment
        </p>
      </div>
    </div>
  )
}