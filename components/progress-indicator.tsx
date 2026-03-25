import { Check } from 'lucide-react'

export interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  index < currentStep
                    ? 'bg-accent text-white'
                    : index === currentStep
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    index < currentStep ? 'bg-accent' : 'bg-muted'
                  }`}
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center max-w-24">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
