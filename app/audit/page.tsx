'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download } from 'lucide-react'
import { fetchAllPages, fetchApi } from '@/lib/api'

interface Programme {
  id: number
  name: string
}

interface AuditEntry {
  id: number
  application: number
  application_reference: string
  programme_id: number
  programme_name: string
  decision: 'admitted' | 'rejected' | 'review'
  ai_recommendation: 'admit' | 'reject' | 'review'
  ai_score: number
  officer_name: string
  student_name: string
  override_reason?: string | null
  is_override: boolean
  decided_at: string
}

function startOfDay(date: string) {
  return `${date}T00:00:00Z`
}

function endOfDay(date: string) {
  return `${date}T23:59:59Z`
}

function badgeClass(value: string) {
  if (value === 'admit' || value === 'admitted') {
    return 'bg-green-100 text-green-800'
  }
  if (value === 'reject' || value === 'rejected') {
    return 'bg-red-100 text-red-800'
  }

  return 'bg-amber-100 text-amber-800'
}

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [decisionFilter, setDecisionFilter] = useState('all')
  const [programmeFilter, setProgrammeFilter] = useState('all')
  const [overrideFilter, setOverrideFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    async function loadAuditData() {
      try {
        setLoading(true)
        setError('')

        const [auditRows, programmeRows] = await Promise.all([
          fetchAllPages<AuditEntry>('/api/audit/'),
          fetchAllPages<Programme>('/api/programmes/'),
        ])

        setEntries(auditRows)
        setProgrammes(programmeRows)
      } catch (loadError) {
        console.error('Failed to load audit records', loadError)
        setError('Could not load the live audit trail.')
      } finally {
        setLoading(false)
      }
    }

    loadAuditData()
  }, [])

  const filtered = entries.filter((entry) => {
    const query = searchTerm.toLowerCase()
    const matchesSearch =
      !query ||
      entry.student_name.toLowerCase().includes(query) ||
      entry.programme_name.toLowerCase().includes(query) ||
      entry.application_reference.toLowerCase().includes(query)
    const matchesDecision = decisionFilter === 'all' || entry.decision === decisionFilter
    const matchesProgramme = programmeFilter === 'all' || entry.programme_id.toString() === programmeFilter
    const matchesOverride =
      overrideFilter === 'all' ||
      (overrideFilter === 'override' && entry.is_override) ||
      (overrideFilter === 'aligned' && !entry.is_override)
    const entryDate = entry.decided_at.slice(0, 10)
    const matchesStart = !startDate || entryDate >= startDate
    const matchesEnd = !endDate || entryDate <= endDate

    return matchesSearch && matchesDecision && matchesProgramme && matchesOverride && matchesStart && matchesEnd
  })

  const handleExportCSV = async () => {
    try {
      setIsExporting(true)
      const params = new URLSearchParams()

      if (programmeFilter !== 'all') {
        params.set('programme', programmeFilter)
      }
      if (decisionFilter !== 'all') {
        params.set('decision', decisionFilter)
      }
      if (overrideFilter === 'override') {
        params.set('is_override', 'true')
      }
      if (overrideFilter === 'aligned') {
        params.set('is_override', 'false')
      }
      if (searchTerm) {
        params.set('search', searchTerm)
      }
      if (startDate) {
        params.set('from_date', startOfDay(startDate))
      }
      if (endDate) {
        params.set('to_date', endOfDay(endDate))
      }

      const query = params.toString()
      const response = await fetchApi(`/api/audit/export/${query ? `?${query}` : ''}`)
      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (exportError) {
      console.error('Failed to export audit log', exportError)
      alert('Could not export the audit log.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Log</h1>
            <p className="text-muted-foreground">Live history of AI recommendations, overrides, and final officer decisions.</p>
          </div>
          <Button onClick={handleExportCSV} variant="outline" disabled={loading || !!error || isExporting}>
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>

        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Search</label>
                <Input
                  placeholder="Student, ref, programme..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Decision</label>
                <Select value={decisionFilter} onValueChange={setDecisionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All decisions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All decisions</SelectItem>
                    <SelectItem value="admitted">Admitted</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Programme</label>
                <Select value={programmeFilter} onValueChange={setProgrammeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All programmes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All programmes</SelectItem>
                    {programmes.map((programme) => (
                      <SelectItem key={programme.id} value={programme.id.toString()}>
                        {programme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Override</label>
                <Select value={overrideFilter} onValueChange={setOverrideFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All records" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All records</SelectItem>
                    <SelectItem value="override">Overrides only</SelectItem>
                    <SelectItem value="aligned">AI-aligned only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">From Date</label>
                <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">To Date</label>
                <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Decisions ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Loading audit log...</div>
            ) : error ? (
              <div className="py-12 text-center text-red-600">{error}</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Reference</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Student Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Programme</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">AI Score</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">AI Rec.</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Final Decision</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Officer</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Override</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((entry) => (
                        <tr key={entry.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 text-xs text-muted-foreground">
                            {new Date(entry.decided_at).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-xs font-medium">{entry.application_reference}</td>
                          <td className="py-3 px-4 font-medium">{entry.student_name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{entry.programme_name}</td>
                          <td className="py-3 px-4 font-semibold text-primary">{entry.ai_score}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClass(entry.ai_recommendation)}`}>
                              {entry.ai_recommendation === 'admit'
                                ? 'Admit'
                                : entry.ai_recommendation === 'reject'
                                  ? 'Reject'
                                  : 'Review'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClass(entry.decision)}`}>
                              {entry.decision === 'admitted'
                                ? 'Admitted'
                                : entry.decision === 'rejected'
                                  ? 'Rejected'
                                  : 'Review'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{entry.officer_name}</td>
                          <td className="py-3 px-4 text-xs">
                            {entry.is_override ? (
                              <span
                                className="px-2 py-1 bg-amber-50 border border-amber-200 rounded inline-block max-w-xs truncate text-amber-900"
                                title={entry.override_reason || 'Officer override recorded.'}
                              >
                                {entry.override_reason || 'Officer override recorded'}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Aligned with AI</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filtered.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    No audit records match the current filters.
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
