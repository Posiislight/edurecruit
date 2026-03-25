'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download } from 'lucide-react'

interface AuditEntry {
  id: string
  date: string
  studentName: string
  programme: string
  aiScore: number
  aiRecommendation: 'admit' | 'review' | 'reject'
  finalDecision: 'admitted' | 'pending' | 'rejected'
  decidedBy: string
  overrideReason?: string
}

const mockAuditLog: AuditEntry[] = [
  {
    id: '1',
    date: '2024-03-20 14:32',
    studentName: 'Chioma Eze',
    programme: 'Computer Science',
    aiScore: 78,
    aiRecommendation: 'admit',
    finalDecision: 'admitted',
    decidedBy: 'Dr. Okafor',
  },
  {
    id: '2',
    date: '2024-03-20 13:15',
    studentName: 'Abdullahi Musa',
    programme: 'Medicine',
    aiScore: 65,
    aiRecommendation: 'review',
    finalDecision: 'pending',
    decidedBy: 'Dr. Okafor',
  },
  {
    id: '3',
    date: '2024-03-20 11:47',
    studentName: 'Zainab Ibrahim',
    programme: 'Law',
    aiScore: 82,
    aiRecommendation: 'admit',
    finalDecision: 'admitted',
    decidedBy: 'Prof. Adeyemi',
  },
  {
    id: '4',
    date: '2024-03-19 16:22',
    studentName: 'Emeka Okafor',
    programme: 'Engineering',
    aiScore: 45,
    aiRecommendation: 'reject',
    finalDecision: 'rejected',
    decidedBy: 'Dr. Okafor',
  },
  {
    id: '5',
    date: '2024-03-19 15:08',
    studentName: 'Fatima Hassan',
    programme: 'Nursing',
    aiScore: 72,
    aiRecommendation: 'review',
    finalDecision: 'pending',
    decidedBy: 'Mrs. Oluwaseun',
    overrideReason: 'Strong extracurricular activities and community service',
  },
  {
    id: '6',
    date: '2024-03-19 12:45',
    studentName: 'Segun Adigun',
    programme: 'Computer Science',
    aiScore: 89,
    aiRecommendation: 'admit',
    finalDecision: 'admitted',
    decidedBy: 'Prof. Adeyemi',
  },
  {
    id: '7',
    date: '2024-03-18 10:30',
    studentName: 'Amara Okoro',
    programme: 'Business Administration',
    aiScore: 58,
    aiRecommendation: 'review',
    finalDecision: 'rejected',
    decidedBy: 'Dr. Okafor',
    overrideReason: 'JAMB score below minimum threshold despite AI recommendation',
  },
  {
    id: '8',
    date: '2024-03-18 09:15',
    studentName: 'Kwame Mensah',
    programme: 'Engineering',
    aiScore: 70,
    aiRecommendation: 'admit',
    finalDecision: 'admitted',
    decidedBy: 'Mrs. Oluwaseun',
  },
]

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [decisionFilter, setDecisionFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filtered = mockAuditLog.filter((entry) => {
    const matchesSearch = entry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.programme.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDecision = decisionFilter === 'all' || !decisionFilter || entry.finalDecision === decisionFilter
    const matchesDateRange = true // Simplified for demo

    return matchesSearch && matchesDecision && matchesDateRange
  })

  const handleExportCSV = () => {
    const headers = ['Date', 'Student Name', 'Programme', 'AI Score', 'AI Recommendation', 'Final Decision', 'Decided By', 'Override Reason']
    const rows = filtered.map((entry) => [
      entry.date,
      entry.studentName,
      entry.programme,
      entry.aiScore,
      entry.aiRecommendation,
      entry.finalDecision,
      entry.decidedBy,
      entry.overrideReason || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="dashboard" />

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Log</h1>
            <p className="text-muted-foreground">Complete history of all admissions decisions</p>
          </div>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Search</label>
                <Input
                  placeholder="Student name or programme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Decision Type</label>
                <Select value={decisionFilter} onValueChange={setDecisionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All decisions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All decisions</SelectItem>
                    <SelectItem value="admitted">Admitted</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">From Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">To Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Decisions ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Student Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Programme</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">AI Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">AI Rec.</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Final Decision</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Decided By</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Override Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 text-xs text-muted-foreground">{entry.date}</td>
                      <td className="py-3 px-4 font-medium">{entry.studentName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{entry.programme}</td>
                      <td className="py-3 px-4 font-semibold text-primary">{entry.aiScore}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          entry.aiRecommendation === 'admit'
                            ? 'bg-blue-100 text-blue-800'
                            : entry.aiRecommendation === 'reject'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {entry.aiRecommendation === 'admit' ? 'Admit' : entry.aiRecommendation === 'reject' ? 'Reject' : 'Review'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          entry.finalDecision === 'admitted'
                            ? 'bg-green-100 text-green-800'
                            : entry.finalDecision === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {entry.finalDecision === 'admitted' ? 'Admitted' : entry.finalDecision === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{entry.decidedBy}</td>
                      <td className="py-3 px-4 text-xs">
                        {entry.overrideReason ? (
                          <span className="px-2 py-1 bg-amber-50 border border-amber-200 rounded inline-block max-w-xs truncate" title={entry.overrideReason}>
                            {entry.overrideReason}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No entries found matching your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
