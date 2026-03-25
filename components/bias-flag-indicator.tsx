import { AlertCircle, CheckCircle2 } from 'lucide-react'

export interface BiasFlagIndicatorProps {
  detected: boolean
  explanation?: string
}

export function BiasFlagIndicator({ detected, explanation }: BiasFlagIndicatorProps) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${
      detected ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
    }`}>
      <div className="mt-0.5">
        {detected ? (
          <AlertCircle className="w-5 h-5 text-red-600" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        )}
      </div>
      <div className="flex-1">
        <p className={`font-semibold text-sm ${
          detected ? 'text-red-900' : 'text-green-900'
        }`}>
          {detected ? 'Bias Flagged' : 'No Bias Detected'}
        </p>
        {explanation && (
          <p className={`text-xs mt-1 ${
            detected ? 'text-red-700' : 'text-green-700'
          }`}>
            {explanation}
          </p>
        )}
      </div>
    </div>
  )
}
