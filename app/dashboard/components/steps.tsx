import { CheckCircle } from 'lucide-react'

type Step = {
  id: string
  title: string
}

type StepsProps = {
  steps: Step[]
  currentStep: string
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className='flex items-center justify-center'>
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = steps.findIndex((s) => s.id === currentStep) > index

        return (
          <div key={step.id} className='flex items-center'>
            {index > 0 && (
              <div
                className={`h-1 w-16 mx-2 ${
                  isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
            <div className='flex flex-col items-center'>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isCompleted ? <CheckCircle className='h-5 w-5' /> : index + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isActive || isCompleted ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
