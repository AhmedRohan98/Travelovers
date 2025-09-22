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
          {current} of {total} questions
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Progress Percentage */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Progress</span>
        <span className="font-semibold text-blue-600">{Math.round(progress)}%</span>
      </div>
      
      {/* Progress Steps */}
      <div className="mt-4 flex space-x-2">
        {Array.from({ length: Math.min(total, 10) }, (_, index) => {
          const stepProgress = ((index + 1) / Math.min(total, 10)) * 100
          const isCompleted = stepProgress <= progress
          const isCurrent = Math.abs(stepProgress - progress) < 5
          
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
        {total > 10 && (
          <div className="text-xs text-gray-500 flex items-center">
            +{total - 10} more
          </div>
        )}
      </div>
    </div>
  )
}