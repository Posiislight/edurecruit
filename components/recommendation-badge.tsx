import { Badge } from './ui/badge'

export type RecommendationType = 'admit' | 'review' | 'reject'

export interface RecommendationBadgeProps {
  recommendation: RecommendationType
}

export function RecommendationBadge({ recommendation }: RecommendationBadgeProps) {
  const config: Record<RecommendationType, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    admit: { label: 'Admit', variant: 'default' },
    review: { label: 'Send for Review', variant: 'secondary' },
    reject: { label: 'Reject', variant: 'destructive' },
  }

  const { label, variant } = config[recommendation]

  return <Badge variant={variant}>{label}</Badge>
}
