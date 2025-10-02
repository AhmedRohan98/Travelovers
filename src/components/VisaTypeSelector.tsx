'use client'

import { useState } from 'react'
import PublicIcon from '@mui/icons-material/Public'
import SchoolIcon from '@mui/icons-material/School'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

interface VisaTypeSelectorProps {
  onSelect: (type: 'visit' | 'study') => void
  loading: boolean
}

export default function VisaTypeSelector({ onSelect, loading }: VisaTypeSelectorProps) {
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
          className={`relative p-8 rounded-2xl border-2 border-blue-200 transition-all duration-300 cursor-pointer group ${
            selectedType === 'visit'
              ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
              : 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:shadow-md'
          }`}
          onClick={() => handleSelect('visit')}
        >
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              selectedType === 'visit' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              <PublicIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Visit Visa
            </h3>
            <p>Free Assessment</p>
            <p>Get Your Application Strength</p>
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
          className={`relative p-8 rounded-2xl border-2 border-green-200 transition-all duration-300 cursor-pointer group ${
            selectedType === 'study'
              ? 'border-green-200 bg-green-50 shadow-lg scale-105'
              : 'border-gray-200 bg-green-50 hover:border-green-300 hover:shadow-md'
          }`}
          onClick={() => handleSelect('study')}
        >
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              selectedType === 'study' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'
            }`}>
              <SchoolIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Study Visa
            </h3>
            <p>Eligibility Check</p>
            <p>Get to know where you can apply</p>
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

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Don&apos;t worry - you can change your selection at any time during the assessment
        </p>
      </div>
    </div>
  )
}