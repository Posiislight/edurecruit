'use client'

export interface ScoreComponent {
  label: string
  percentage: number
  color: string
}

export interface ScoreBreakdownBarProps {
  components: ScoreComponent[]
  totalScore: number
  maxScore: number
}

export function ScoreBreakdownBar({
  components,
  totalScore,
  maxScore,
}: ScoreBreakdownBarProps) {
  const displayPercentage = Math.round((totalScore / maxScore) * 100)

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-bold text-primary">{totalScore}</div>
        <div className="text-sm text-muted-foreground">/{maxScore}</div>
      </div>
      
      <div className="flex h-3 gap-1 rounded-full overflow-hidden bg-muted">
        {components.map((component, index) => (
          <div
            key={index}
            className="h-full"
            style={{
              width: `${component.percentage}%`,
              backgroundColor: component.color,
            }}
            title={`${component.label}: ${component.percentage}%`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {components.map((component, index) => (
          <div key={index} className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: component.color }}
              />
              <span className="text-muted-foreground">{component.label}</span>
            </div>
            <div className="font-semibold text-sm">{component.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
