'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, BookOpen, GraduationCap, Users, Clock, TrendingUp, Settings2 } from 'lucide-react'

// Update the Programme interface
interface Programme {
  id: string
  name: string
  faculty: string
  degree: string
  demand: 'High Demand' | 'Moderate' | 'Low Demand'
  description: string
  duration: string
  places: number
  applicants: number
  ratio: string
  tags: string[]
  requirements: string
}

const mockProgrammes: Programme[] = [
  {
    id: '1',
    name: 'Computer Science',
    faculty: 'Faculty of Science',
    degree: 'BSc (Hons)',
    demand: 'High Demand',
    description: 'A comprehensive programme covering algorithms, data structures, software engineering, and artificial intelligence.',
    duration: '4 years',
    places: 150,
    applicants: 4200,
    ratio: '28:1',
    tags: ['STEM', 'AI & ML', 'Software Dev'],
    requirements: '5 O\'Level Credits in Math, English, Physics & Chemistry. Minimum JAMB: 200',
  },
  {
    id: '2',
    name: 'Medicine and Surgery',
    faculty: 'College of Medicine',
    degree: 'MBBS',
    demand: 'High Demand',
    description: 'Intensive medical training program with rigorous clinical rotations and scientific foundations for future doctors.',
    duration: '6 years',
    places: 120,
    applicants: 8500,
    ratio: '70:1',
    tags: ['Clinical', 'Healthcare', 'Research'],
    requirements: '5 O\'Level Credits (Math, English, Bio, Chem, Physics) in one sitting. Minimum JAMB: 280',
  },
  {
    id: '3',
    name: 'Law',
    faculty: 'Faculty of Law',
    degree: 'LLB (Hons)',
    demand: 'High Demand',
    description: 'Develop strong analytical and advocacy skills to understand the Nigerian legal system and international law.',
    duration: '5 years',
    places: 200,
    applicants: 5100,
    ratio: '25.5:1',
    tags: ['Legal Practice', 'Advocacy', 'Corporate Law'],
    requirements: '5 O\'Level Credits including English & Literature in English. Minimum JAMB: 250',
  },
  {
    id: '4',
    name: 'Architecture',
    faculty: 'Faculty of Environmental Sciences',
    degree: 'BSc',
    demand: 'Moderate',
    description: 'Studio-led programme exploring sustainable design, urban planning, and environmental aesthetics in Nigeria.',
    duration: '4 years',
    places: 80,
    applicants: 1200,
    ratio: '15:1',
    tags: ['Design', 'Urban Planning', 'Studio'],
    requirements: '5 O\'Level Credits in Math, English, Physics. Minimum JAMB: 220',
  },
  {
    id: '5',
    name: 'Economics',
    faculty: 'Faculty of Social Sciences',
    degree: 'BSc',
    demand: 'High Demand',
    description: 'Study economic theories applied to Nigerian and global markets, financial analysis, and policy formulation.',
    duration: '4 years',
    places: 250,
    applicants: 3800,
    ratio: '15.2:1',
    tags: ['Quantitative', 'Finance', 'Policy'],
    requirements: '5 O\'Level Credits including Math, English, & Economics. Minimum JAMB: 200',
  },
  {
    id: '6',
    name: 'Psychology',
    faculty: 'Faculty of Social Sciences',
    degree: 'BSc',
    demand: 'Moderate',
    description: 'Explore the human mind, behavioral science, and cognitive processes with applications in organizational behavior.',
    duration: '4 years',
    places: 150,
    applicants: 1900,
    ratio: '12.6:1',
    tags: ['Behavioural Science', 'Clinical', 'HR'],
    requirements: '5 O\'Level Credits including Math, English, & Biology. Minimum JAMB: 200',
  },
]

const filters = ["All", "Science", "Medicine", "Social Sciences", "Law", "Environmental Sciences"]

export default function ProgrammesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredProgrammes = mockProgrammes.filter(
    (prog) => {
      const matchesSearch = prog.name.toLowerCase().includes(searchTerm.toLowerCase()) || prog.faculty.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = activeFilter === 'All' || prog.faculty.includes(activeFilter)
      return matchesSearch && matchesFilter
    }
  )

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col">

      {/* Hero Section */}
      <section className="bg-[#1a2f44] py-16 text-white w-full">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-amber-400 text-sm font-semibold mb-3">2025/26 Academic Year</p>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Explore Our <span className="text-[#38b2ac]">Programmes</span>
          </h1>
          <p className="text-slate-300 max-w-2xl text-lg mb-10 leading-relaxed">
            Browse available courses, understand entry requirements, and see real-time application demand powered by transparent AI screening.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl border-t border-slate-700/50 pt-8 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-800/80 flex items-center justify-center">
                <BookOpen className="text-[#38b2ac] w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-2xl">9</p>
                <p className="text-slate-400 text-sm">Programmes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-800/80 flex items-center justify-center">
                <GraduationCap className="text-[#38b2ac] w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-2xl">800</p>
                <p className="text-slate-400 text-sm">Total Places</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-800/80 flex items-center justify-center">
                <Users className="text-[#38b2ac] w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-2xl">11,050</p>
                <p className="text-slate-400 text-sm">Total Applicant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="bg-white border-b sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search Programmes..."
              className="pl-9 bg-white border-slate-200 rounded-full h-9 text-sm focus-visible:ring-1 focus-visible:ring-[#38b2ac]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto w-full pb-2 md:pb-0 hide-scrollbar scrollbar-hide">
            <Settings2 className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="flex gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
                    ${activeFilter === filter 
                      ? 'bg-slate-800 text-white border-slate-800' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredProgrammes.map((programme) => (
            <Card key={programme.id} className="p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs text-slate-500 font-medium tracking-wide">
                  {programme.faculty} &bull; {programme.degree}
                </p>
                <Badge 
                  className={`font-semibold text-[10px] px-2.5 py-0.5 rounded-full ${
                    programme.demand === 'High Demand' 
                      ? 'bg-[#38b2ac] hover:bg-[#38b2ac] text-white border-transparent' 
                      : 'bg-teal-500/10 text-teal-700 hover:bg-teal-500/20 border-transparent'
                  }`}
                >
                  {programme.demand}
                </Badge>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{programme.name}</h3>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed flex-1">
                {programme.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">{programme.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">{programme.places} places</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">{programme.applicants} applicants</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">{programme.ratio} ratio</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {programme.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pl-3 border-l-2 border-slate-200 mb-6 py-1">
                <p className="text-xs text-slate-600 leading-tight">
                  {programme.requirements}
                </p>
              </div>

              <div className="flex gap-3 mt-auto pt-2">
                <Button asChild className="bg-[#38b2ac] hover:bg-teal-500 text-white rounded-full px-6 flex-1 shadow-none h-10">
                  <Link href={`/apply?programme=${programme.id}`}>Apply Now &rarr;</Link>
                </Button>
                <Button asChild variant="outline" className="text-[#38b2ac] border-[#38b2ac] hover:bg-[#38b2ac]/5 rounded-full px-6 flex-1 shadow-none h-10">
                  <Link href={`/programmes/${programme.id}`}>View Details</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredProgrammes.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No programmes found</h3>
            <p className="text-slate-500 text-sm">We couldn't find any programmes matching your search.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2f44] py-16 text-slate-300 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">EduRecruit</h2>
              <p className="text-sm text-slate-400 max-w-sm">
                Transparent, explainable, and fair AI-powered university admissions.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-white mb-1">Platforms</h3>
              <Link href="/programmes" className="text-sm hover:text-white transition-colors">Programmes</Link>
              <Link href="/apply" className="text-sm hover:text-white transition-colors">Apply</Link>
              <Link href="/application-status" className="text-sm hover:text-white transition-colors">Status</Link>
              <Link href="/officer-login" className="text-sm hover:text-white transition-colors">Officer Portals</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-white mb-1">Trust & Transparency</h3>
              <span className="text-sm hover:text-white transition-colors cursor-pointer">Every Decision Explained</span>
              <span className="text-sm hover:text-white transition-colors cursor-pointer">Bias Detection Built-in</span>
              <span className="text-sm hover:text-white transition-colors cursor-pointer">Human Final Review Always</span>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 flex items-center justify-center md:justify-start">
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>&copy;</span> 2026 EduRecruit. Fairness In Admission
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
