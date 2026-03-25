'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface Programme {
  id: string
  name: string
  faculty: string
  jambCutoff: number
  availableSlots: number
  requiredSubjects: string[]
}

const mockProgrammes: Programme[] = [
  {
    id: '1',
    name: 'Computer Science',
    faculty: 'Science',
    jambCutoff: 200,
    availableSlots: 120,
    requiredSubjects: ['Mathematics', 'English', 'Physics'],
  },
  {
    id: '2',
    name: 'Medicine',
    faculty: 'Health Sciences',
    jambCutoff: 240,
    availableSlots: 80,
    requiredSubjects: ['English', 'Biology', 'Chemistry'],
  },
  {
    id: '3',
    name: 'Law',
    faculty: 'Social Sciences',
    jambCutoff: 180,
    availableSlots: 100,
    requiredSubjects: ['English', 'Government', 'History'],
  },
  {
    id: '4',
    name: 'Engineering',
    faculty: 'Engineering',
    jambCutoff: 220,
    availableSlots: 150,
    requiredSubjects: ['Mathematics', 'Physics', 'Chemistry'],
  },
  {
    id: '5',
    name: 'Business Administration',
    faculty: 'Social Sciences',
    jambCutoff: 160,
    availableSlots: 200,
    requiredSubjects: ['English', 'Mathematics', 'Economics'],
  },
  {
    id: '6',
    name: 'Nursing',
    faculty: 'Health Sciences',
    jambCutoff: 190,
    availableSlots: 60,
    requiredSubjects: ['English', 'Biology', 'Chemistry'],
  },
]

export default function ProgrammesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProgrammes = mockProgrammes.filter(
    (prog) =>
      prog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Available Programmes</h1>
          <p className="text-muted-foreground">Browse and apply to our university programmes</p>
        </div>

        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search programmes or faculty..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProgrammes.map((programme) => (
            <Card key={programme.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{programme.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{programme.faculty}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">JAMB Cutoff</p>
                    <p className="text-lg font-bold text-primary">{programme.jambCutoff}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Available Slots</p>
                    <p className="text-lg font-bold text-accent">{programme.availableSlots}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Required Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {programme.requiredSubjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/apply?programme=${programme.id}`}>Apply Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProgrammes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No programmes found matching your search</p>
          </div>
        )}
      </section>
    </div>
  )
}
