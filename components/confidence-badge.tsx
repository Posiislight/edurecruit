import { Badge } from './ui/badge'

export type ConfidenceLevel = 'high' | 'low' | 'disqualified'

export interface ConfidenceBadgeProps {
  level: ConfidenceLevel
}

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const config: Record<ConfidenceLevel, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    high: { label: 'High Confidence', variant: 'default' },
    low: { label: 'Low Confidence', variant: 'secondary' },
    disqualified: { label: 'Disqualified', variant: 'destructive' },
  }

  const { label, variant } = config[level]

  return <Badge variant={variant}>{label}</Badge>
}
