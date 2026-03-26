export type ScreeningDecisionLike = {
  confidence?: string | null
  reasoning?: string | null
  factors_used?: unknown
  jamb_component?: number | null
  olevel_component?: number | null
  sitting_component?: number | null
  recency_component?: number | null
}

type ScoreBreakdownRow = {
  label: string
  score: number
  max: number
}

function getReasonSummaryPoints(decision?: ScreeningDecisionLike | null): string[] {
  if (!Array.isArray(decision?.factors_used)) {
    return []
  }

  return decision.factors_used.filter((step): step is string => {
    return typeof step === 'string' && step.trim().length > 0
  })
}

export function isHardRuleDisqualification(decision?: ScreeningDecisionLike | null): boolean {
  return decision?.confidence === 'disqualified'
}

export function getHardRuleReason(decision?: ScreeningDecisionLike | null): string | null {
  if (!isHardRuleDisqualification(decision)) {
    return null
  }

  const reasoning = typeof decision?.reasoning === 'string' ? decision.reasoning.trim() : ''
  return reasoning || null
}

export function getTransparencyBreakdown(decision?: ScreeningDecisionLike | null): string[] {
  const steps = getReasonSummaryPoints(decision)
  const hardRuleReason = getHardRuleReason(decision)

  if (!hardRuleReason) {
    return steps
  }

  return steps.length > 0 ? steps : [hardRuleReason]
}

export function getScoreBreakdown(decision?: ScreeningDecisionLike | null): ScoreBreakdownRow[] {
  return [
    { label: 'JAMB', score: Number(decision?.jamb_component || 0), max: 50 },
    { label: "O'level", score: Number(decision?.olevel_component || 0), max: 30 },
    { label: 'Consistency', score: Number(decision?.sitting_component || 0), max: 10 },
    { label: 'Recency', score: Number(decision?.recency_component || 0), max: 10 },
  ]
}
