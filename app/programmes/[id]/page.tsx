import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, BookOpen, Users, TrendingUp, ArrowLeft, CheckCircle2 } from 'lucide-react'

// Mock Data
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

export default async function ProgrammeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const programme = mockProgrammes.find((p) => p.id === id)

  if (!programme) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mb-6" />
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Programme Not Found</h1>
          <p className="text-slate-500 mb-8 max-w-md">We couldn't find the programme you're looking for. Please check the URL or browse our available programmes.</p>
          <Button asChild className="bg-[#38b2ac] hover:bg-teal-500 text-white rounded-full px-8 font-medium">
            <Link href="/programmes">Browse Programmes</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col">
      
      {/* Hero Section */}
      <section className="bg-[#1a2f44] py-16 text-white w-full border-b-[6px] border-[#38b2ac]">
        <div className="max-w-7xl mx-auto px-6 relative">
          <Link href="/programmes" className="inline-flex items-center text-slate-400 hover:text-white mb-8 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programmes
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-400 text-sm font-bold tracking-widest uppercase">{programme.faculty}</span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-slate-300 text-sm font-medium">{programme.degree}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                {programme.name}
              </h1>
              <div className="flex flex-wrap gap-3 mb-2">
                <Badge 
                  className={`font-semibold px-4 py-1.5 rounded-full text-xs tracking-wide uppercase ${
                    programme.demand === 'High Demand' 
                      ? 'bg-[#38b2ac] hover:bg-[#38b2ac] text-white border-transparent' 
                      : 'bg-teal-500/20 text-teal-300 border-transparent'
                  }`}
                >
                  {programme.demand}
                </Badge>
                {programme.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-700/60 text-slate-200 hover:bg-slate-600 border-transparent px-4 py-1.5 rounded-full text-xs font-medium">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="shrink-0 mt-2 md:mt-0">
              <Button asChild size="lg" className="w-full md:w-auto bg-[#38b2ac] hover:bg-teal-500 text-white rounded-full px-10 py-6 text-base font-bold shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95">
                <Link href={`/apply?programme=${programme.id}`}>Start Application</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">About this Programme</h2>
              <div className="prose prose-slate prose-lg max-w-none">
                <p className="text-slate-700 leading-relaxed font-medium">
                  {programme.description}
                </p>
                <p className="text-slate-600 mt-5 leading-relaxed">
                  Join a community of dedicated learners and experts. This programme is designed to equip you with the practical skills and theoretical knowledge necessary to succeed in today's dynamic professional landscape. Our curriculum is constantly updated to reflect industry trends, ensuring that our graduates are highly sought after by top employers globally.
                </p>
                <p className="text-slate-600 mt-5 leading-relaxed">
                  Students will have the opportunity to engage in hands-on projects, research initiatives, and internships that provide real-world experience. Our distinguished faculty members are committed to mentoring students and fostering an environment of academic excellence and innovation.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10"></div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Entry Requirements</h2>
              <ul className="space-y-6">
                <li className="flex gap-5">
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[#38b2ac]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">O'Level Qualifications</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed">{programme.requirements.split('. ')[0]}. All credits must be obtained in not more than two sittings.</p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[#38b2ac]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">JAMB Score Requirement</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed">{programme.requirements.split('. ')[1]}. Candidates must ensure they select EduRecruit University as their first choice institution.</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column - Stats Card */}
          <div className="lg:col-span-1">
            <Card className="p-8 sticky top-28 border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl bg-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#38b2ac] to-teal-300"></div>
              
              <h3 className="font-extrabold text-xl mb-8 text-slate-900 tracking-tight">Programme Overview</h3>
              
              <div className="space-y-7">
                <div className="flex items-center gap-5 pb-7 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Clock className="w-6 h-6 text-[#38b2ac]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Duration</p>
                    <p className="font-bold text-lg text-slate-900">{programme.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 pb-7 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                    <BookOpen className="w-6 h-6 text-[#38b2ac]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Available Places</p>
                    <p className="font-bold text-lg text-slate-900">{programme.places} students</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 pb-7 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Users className="w-6 h-6 text-[#38b2ac]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Applicants</p>
                    <p className="font-bold text-lg text-slate-900">{programme.applicants.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                    <TrendingUp className="w-6 h-6 text-[#38b2ac]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Competition Ratio</p>
                    <p className="font-bold text-lg text-slate-900">{programme.ratio}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Button asChild className="w-full bg-[#38b2ac] hover:bg-teal-500 text-white rounded-xl py-6 text-base font-bold shadow-md shadow-teal-500/20 transition-transform active:scale-95">
                  <Link href={`/apply?programme=${programme.id}`}>Begin Application Now</Link>
                </Button>
                <div className="bg-slate-50 rounded-xl p-4 mt-4 text-center border border-slate-100">
                  <p className="text-xs font-medium text-slate-600">
                    Application closes on <span className="font-bold text-slate-800">August 30th, 2026</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>

        </div>
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
