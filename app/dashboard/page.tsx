'use client'

import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { fetchApi } from '@/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [recentApplications, setRecentApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, appsRes, progsRes] = await Promise.all([
          fetchApi('/api/dashboard/stats/'),
          fetchApi('/api/applications/'),
          fetchApi('/api/programmes/')
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
          setChartData(statsData.applications_per_programme.map((p: any) => ({
            name: p.programme_name,
            total: p.count,
          })));
        }

        if (appsRes.ok && progsRes.ok) {
          const appsData = await appsRes.json();
          const progsData = await progsRes.json();
          
          const progMap = new Map();
          progsData.results?.forEach((p: any) => progMap.set(p.id, p.name));
          // If Programmes API isn't paginated, it might be an array:
          if (Array.isArray(progsData)) {
            progsData.forEach((p: any) => progMap.set(p.id, p.name));
          }

          const formattedApps = appsData.results?.slice(0, 10).map((app: any) => ({
            id: app.id,
            name: app.student_name,
            programme: progMap.get(app.programme) || 'Unknown',
            aiScore: app.ai_score || '-',
            confidence: app.screening_decision?.confidence || '-',
            recommendation: app.screening_decision?.recommendation || '-',
            status: app.status,
          })) || [];
          setRecentApplications(formattedApps);
        }
      } catch (e) {
        console.error("Dashboard error", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [])

  if (loading) {
     return <div className="min-h-screen bg-slate-50 p-6">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Officer. Here&apos;s your application overview.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Applications"
            value={stats?.total_applications?.toString() || "0"}
            icon={<Users className="w-5 h-5" />}
            description="This cycle"
          />
          <StatsCard
            title="Pending Review"
            value={stats?.pending_review?.toString() || "0"}
            icon={<Clock className="w-5 h-5" />}
            description="Awaiting decision"
          />
          <StatsCard
            title="Admitted"
            value={stats?.admitted?.toString() || "0"}
            icon={<CheckCircle2 className="w-5 h-5" />}
            description="Accepted candidates"
          />
          <StatsCard
            title="Rejected"
            value={stats?.rejected?.toString() || "0"}
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
                <Bar dataKey="total" fill="var(--chart-1)" name="Total Applications" />
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
