'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { fetchAllPages } from '@/lib/api'

interface Programme {
  id: number
  name: string
}

interface OLevelResult {
  subject: string
  grade: string
}

interface ScreeningDecision {
  ai_score: number
  confidence: 'high' | 'low' | 'disqualified'
  recommendation: 'admit' | 'review' | 'reject'
}

interface ApplicantRecord {
  id: number
  student_name: string
  jamb_score: number
  olevel_results: OLevelResult[]
  ai_score: number | null
  status: 'pending' | 'screened' | 'review' | 'admitted' | 'rejected'
  programme: Programme
  screening_decision?: ScreeningDecision | null
}

function formatOLevel(results: OLevelResult[]) {
  if (!results.length) {
    return 'No results supplied'
  }

  return results
    .slice(0, 4)
    .map((result) => `${result.subject}: ${result.grade}`)
    .join(', ')
}

function formatStatus(status: ApplicantRecord['status']) {
  if (status === 'admitted') {
    return { label: 'Admitted', className: 'bg-green-100 text-green-800' }
  }
  if (status === 'rejected') {
    return { label: 'Rejected', className: 'bg-red-100 text-red-800' }
  }
  if (status === 'review') {
    return { label: 'Needs Review', className: 'bg-amber-100 text-amber-800' }
  }
  if (status === 'screened') {
    return { label: 'AI Screened', className: 'bg-blue-100 text-blue-800' }
  }

  return { label: 'Pending', className: 'bg-slate-100 text-slate-700' }
}

function formatRecommendation(recommendation?: ScreeningDecision['recommendation']) {
  if (!recommendation) {
    return { label: 'Pending', className: 'bg-slate-100 text-slate-700' }
  }
  if (recommendation === 'admit') {
    return { label: 'Admit', className: 'bg-blue-100 text-blue-800' }
  }
  if (recommendation === 'reject') {
    return { label: 'Reject', className: 'bg-red-100 text-red-800' }
  }

  return { label: 'Review', className: 'bg-amber-100 text-amber-800' }
}

function formatConfidence(confidence?: ScreeningDecision['confidence']) {
  if (!confidence) {
    return { label: 'Pending', className: 'bg-slate-100 text-slate-700' }
  }
  if (confidence === 'high') {
    return { label: 'High', className: 'bg-green-100 text-green-800' }
  }
  if (confidence === 'disqualified') {
    return { label: 'Disqualified', className: 'bg-red-100 text-red-800' }
  }

  return { label: 'Low', className: 'bg-amber-100 text-amber-800' }
}

export default function ApplicantsPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')    
  const [programmeFilter, setProgrammeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [confidenceFilter, setConfidenceFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'name' | 'jamb' | 'aiScore'>('name')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const itemsPerPage = 10

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError('')

        const [applicationRows, programmeRows] = await Promise.all([
          fetchAllPages<ApplicantRecord>('/api/applications/'),
          fetchAllPages<Programme>('/api/programmes/'),
        ])

        setApplicants(applicationRows)
        setProgrammes(programmeRows)
      } catch (loadError) {
        console.error('Failed to load applicants', loadError)
        setError('Could not load live applicant data.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  let filtered = applicants.filter((applicant) => {
    const name = applicant.student_name.toLowerCase()
    const programmeName = applicant.programme?.name?.toLowerCase() || ''
    const matchesSearch =
      !searchTerm ||
      name.includes(searchTerm.toLowerCase()) ||
      programmeName.includes(searchTerm.toLowerCase())
    const matchesProgramme =
      programmeFilter === 'all' || applicant.programme?.id.toString() === programmeFilter
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter
    const matchesConfidence =
      confidenceFilter === 'all' || applicant.screening_decision?.confidence === confidenceFilter

    return matchesSearch && matchesProgramme && matchesStatus && matchesConfidence
  })

  filtered = filtered.sort((left, right) => {
    if (sortBy === 'name') {
      return left.student_name.localeCompare(right.student_name)
    }
    if (sortBy === 'jamb') {
      return right.jamb_score - left.jamb_score
    }

    return (right.ai_score || 0) - (left.ai_score || 0)
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginatedApplicants = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, programmeFilter, statusFilter, confidenceFilter, sortBy])

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Applicants</h1>
          <p className="text-muted-foreground">Live admissions queue with AI recommendations and officer review status.</p>
        </div>

        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Search</label>
                <Input
                  placeholder="Student or programme..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
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
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="screened">AI Screened</SelectItem>
                    <SelectItem value="review">Needs Review</SelectItem>
                    <SelectItem value="admitted">Admitted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Confidence</label>
                <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All confidence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All confidence</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="disqualified">Disqualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'jamb' | 'aiScore')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="jamb">JAMB Score</SelectItem>
                    <SelectItem value="aiScore">AI Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Applicants ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Loading applicants...</div>
            ) : error ? (
              <div className="py-12 text-center text-red-600">{error}</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Programme</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">JAMB</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">O&apos;level</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">AI Score</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Confidence</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Recommendation</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedApplicants.map((applicant) => {
                        const status = formatStatus(applicant.status)
                        const confidence = formatConfidence(applicant.screening_decision?.confidence)
                        const recommendation = formatRecommendation(applicant.screening_decision?.recommendation)

                        return (
                          <tr key={applicant.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4 font-medium">{applicant.student_name}</td>
                            <td className="py-3 px-4 text-muted-foreground text-xs">{applicant.programme?.name || 'Unknown'}</td>
                            <td className="py-3 px-4 font-semibold">{applicant.jamb_score}</td>
                            <td className="py-3 px-4 text-xs text-muted-foreground max-w-56">{formatOLevel(applicant.olevel_results || [])}</td>
                            <td className="py-3 px-4 font-semibold text-primary">{applicant.ai_score ?? applicant.screening_decision?.ai_score ?? 0}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${confidence.className}`}>
                                {confidence.label}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${recommendation.className}`}>
                                {recommendation.label}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${status.className}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button size="sm" variant="ghost" asChild>
                                <Link href={`/dashboard/applicant/${applicant.id}`}>
                                  <Eye className="w-4 h-4" />
                                  View
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {filtered.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    No live applicants match the current filters.
                  </div>
                )}

                <div className="flex items-center justify-between mt-8">
                  <p className="text-sm text-muted-foreground">
                    Showing {paginatedApplicants.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                    {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} applicants
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                      const page = index + 1

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
