'use client'

interface AssessmentProgressProps {
  current: number
  total: number
  progress: number
}

export default function AssessmentProgress({ current, total, progress }: AssessmentProgressProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Assessment Progress
        </h3>
        <span className="text-sm font-medium text-gray-600">
          Question {current}
        </span>
      </div>
      
      {/* Progress Bar - Simplified */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      {/* Progress Steps - Simplified */}
      <div className="mt-4 flex space-x-2">
        {Array.from({ length: Math.min(total, 8) }, (_, index) => {
          const isCompleted = index < current - 1
          const isCurrent = index === current - 1
          
          return (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-blue-500'
                  : isCurrent
                  ? 'bg-blue-300'
                  : 'bg-gray-200'
              }`}
            />
          )
        })}
        {total > 8 && (
          <div className="text-xs text-gray-500 flex items-center">
            ...
          </div>
        )}
      </div>
    </div>
  )
}