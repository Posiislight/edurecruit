'use client'

import { Navbar } from '@/components/navbar'
import { StatsCard } from '@/components/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, CheckCircle2, XCircle, Clock } from 'lucide-react'

const chartData = [
  { name: 'Computer Science', applications: 240, admitted: 80, pending: 100, rejected: 60 },
  { name: 'Medicine', applications: 180, admitted: 50, pending: 80, rejected: 50 },
  { name: 'Law', applications: 200, admitted: 70, pending: 65, rejected: 65 },
  { name: 'Engineering', applications: 280, admitted: 100, pending: 120, rejected: 60 },
  { name: 'Business', applications: 320, admitted: 140, pending: 100, rejected: 80 },
  { name: 'Nursing', applications: 160, admitted: 50, pending: 70, rejected: 40 },
]

const recentApplications = [
  {
    id: '1',
    name: 'Chioma Eze',
    programme: 'Computer Science',
    aiScore: 78,
    confidence: 'high',
    recommendation: 'admit',
    status: 'admitted',
  },
  {
    id: '2',
    name: 'Abdullahi Musa',
    programme: 'Medicine',
    aiScore: 65,
    confidence: 'low',
    recommendation: 'review',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Zainab Ibrahim',
    programme: 'Law',
    aiScore: 82,
    confidence: 'high',
    recommendation: 'admit',
    status: 'admitted',
  },
  {
    id: '4',
    name: 'Emeka Okafor',
    programme: 'Engineering',
    aiScore: 45,
    confidence: 'low',
    recommendation: 'reject',
    status: 'rejected',
  },
  {
    id: '5',
    name: 'Fatima Hassan',
    programme: 'Nursing',
    aiScore: 72,
    confidence: 'high',
    recommendation: 'review',
    status: 'pending',
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="dashboard" />

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Officer. Here&apos;s your application overview.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Applications"
            value="1,380"
            icon={<Users className="w-5 h-5" />}
            description="This cycle"
          />
          <StatsCard
            title="Pending Review"
            value="535"
            icon={<Clock className="w-5 h-5" />}
            description="Awaiting decision"
          />
          <StatsCard
            title="Admitted"
            value="490"
            icon={<CheckCircle2 className="w-5 h-5" />}
            description="Accepted candidates"
          />
          <StatsCard
            title="Rejected"
            value="355"
            icon={<XCircle className="w-5 h-5" />}
            description="Not qualified"
          />
        </div>

        {/* Chart */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Applications per Programme</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: `1px solid var(--border)`,
                  }}
                />
                <Legend />
                <Bar dataKey="admitted" stackId="a" fill="var(--chart-1)" />
                <Bar dataKey="pending" stackId="a" fill="var(--chart-3)" />
                <Bar dataKey="rejected" stackId="a" fill="var(--chart-4)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Applications Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Programme</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">AI Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Confidence</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Recommendation</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
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
                      <td className="py-3 px-4">
                        <a href={`/dashboard/applicant/${app.id}`} className="text-primary hover:underline font-medium">
                          {app.name}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{app.programme}</td>
                      <td className="py-3 px-4 font-semibold">{app.aiScore}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          app.confidence === 'high'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.confidence === 'high' ? 'High' : 'Low'}
                        </span>
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
