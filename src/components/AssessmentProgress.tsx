'use client'

interface AssessmentProgressProps {
  current: number
  progress: number
  sectionNames: string[]
  currentSectionName: string
}

export default function AssessmentProgress({ progress, sectionNames, currentSectionName }: AssessmentProgressProps) {
  const normalizedSectionNames = sectionNames && sectionNames.length > 0 ? sectionNames : ['General']
  const currentIndex = Math.max(0, normalizedSectionNames.indexOf(currentSectionName))
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Assessment Progress
        </h3>
      </div>
      
      {/* Progress Bar - Simplified */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Section Progress Bars with labels */}
      <div className="mt-2">
        <div className="flex space-x-2 mb-2">
          {normalizedSectionNames.map((name, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex
            const isJustCompleted = index === currentIndex - 1
            return (
              <div
                key={name}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500'
                    : isJustCompleted
                    ? 'bg-blue-500'
                    : isCurrent
                    ? 'bg-gray-200'
                    : 'bg-gray-200'
                }`}
                title={name}
              />
            )
          })}
        </div>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
            <span className="uppercase tracking-wide">{currentSectionName}</span>
          </div>
          <div className="text-xs text-gray-500">
            Section {currentIndex + 1} of {normalizedSectionNames.length}
          </div>
        </div>
      </div>
      
      {/* Removed bottom per-question step indicators to keep only two bars */}
    </div>
  )
}