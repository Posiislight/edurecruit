'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'

interface Applicant {
  id: string
  name: string
  jambScore: number
  olevels: string
  aiScore: number
  recommendation: 'admit' | 'review' | 'reject'
  status: 'admitted' | 'pending' | 'rejected'
  programme: string
}

const mockApplicants: Applicant[] = [
  { id: '1', name: 'Chioma Eze', jambScore: 220, olevels: '3A1, 1B2, 1B3', aiScore: 78, recommendation: 'admit', status: 'admitted', programme: 'Computer Science' },
  { id: '2', name: 'Abdullahi Musa', jambScore: 185, olevels: '2B2, 3C4, 2D7', aiScore: 65, recommendation: 'review', status: 'pending', programme: 'Medicine' },
  { id: '3', name: 'Zainab Ibrahim', jambScore: 235, olevels: '4A1, 2B2', aiScore: 82, recommendation: 'admit', status: 'admitted', programme: 'Law' },
  { id: '4', name: 'Emeka Okafor', jambScore: 160, olevels: '1C4, 3D7, 3F9', aiScore: 45, recommendation: 'reject', status: 'rejected', programme: 'Engineering' },
  { id: '5', name: 'Fatima Hassan', jambScore: 210, olevels: '2A1, 3B2, 1C4', aiScore: 72, recommendation: 'review', status: 'pending', programme: 'Nursing' },
  { id: '6', name: 'Segun Adigun', jambScore: 240, olevels: '5A1', aiScore: 89, recommendation: 'admit', status: 'admitted', programme: 'Computer Science' },
  { id: '7', name: 'Amara Okoro', jambScore: 175, olevels: '2B2, 3C4, 2D7', aiScore: 58, recommendation: 'review', status: 'pending', programme: 'Business Administration' },
  { id: '8', name: 'Kwame Mensah', jambScore: 195, olevels: '3A1, 1B2, 1C4', aiScore: 70, recommendation: 'admit', status: 'admitted', programme: 'Engineering' },
]

export default function ApplicantsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [programmeFilter, setProgrammeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [confidenceFilter, setConfidenceFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'name' | 'jamb' | 'aiScore'>('name')
  const itemsPerPage = 10

  let filtered = mockApplicants.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProgramme = !programmeFilter || app.programme === programmeFilter
    const matchesStatus = !statusFilter || app.status === statusFilter

    return matchesSearch && matchesProgramme && matchesStatus
  })

  filtered = filtered.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'jamb') return b.jambScore - a.jambScore
    if (sortBy === 'aiScore') return b.aiScore - a.aiScore
    return 0
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedApplicants = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="dashboard" />

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Applicants</h1>
          <p className="text-muted-foreground">Review and manage all applications</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Search Name</label>
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Programme</label>
                <Select value={programmeFilter} onValueChange={(value) => {
                  setProgrammeFilter(value)
                  setCurrentPage(1)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All programmes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All programmes</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Medicine">Medicine</SelectItem>
                    <SelectItem value="Law">Law</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Business Administration">Business Administration</SelectItem>
                    <SelectItem value="Nursing">Nursing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={(value) => {
                  setStatusFilter(value)
                  setCurrentPage(1)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="admitted">Admitted</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
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

        {/* Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Applicants ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Programme</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">JAMB</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">O&apos;level</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">AI Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Recommendation</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedApplicants.map((app) => (
                    <tr
                      key={app.id}
                      className={`border-b hover:bg-muted/50 transition-colors ${
                        app.status === 'admitted'
                          ? 'bg-green-50'
                          : app.status === 'rejected'
                          ? 'bg-red-50'
                          : 'bg-amber-50'
                      }`}
                    >
                      <td className="py-3 px-4 font-medium">{app.name}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{app.programme}</td>
                      <td className="py-3 px-4 font-semibold">{app.jambScore}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{app.olevels}</td>
                      <td className="py-3 px-4 font-semibold text-primary">{app.aiScore}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          app.recommendation === 'admit'
                            ? 'bg-blue-100 text-blue-800'
                            : app.recommendation === 'reject'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.recommendation === 'admit' ? 'Admit' : app.recommendation === 'reject' ? 'Reject' : 'Review'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          app.status === 'admitted'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status === 'admitted' ? 'Admitted' : app.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/dashboard/applicant/${app.id}`}>
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
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
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
