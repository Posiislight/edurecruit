'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { ProgressIndicator } from '@/components/progress-indicator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type FormStep = 'personal' | 'programme' | 'olevels' | 'documents' | 'review'

interface PersonalInfo {
  name: string
  email: string
  phone: string
  stateOfOrigin: string
}

interface OLevelResult {
  subject: string
  grade: string
}

const STEPS = ['Personal Info', 'Programme', 'O\'level Results', 'Documents', 'Review']

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>('personal')
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    stateOfOrigin: '',
  })
  const [programme, setProgramme] = useState('')
  const [jambScore, setJambScore] = useState('')
  const [olevels, setOlevels] = useState<OLevelResult[]>([])
  const [newSubject, setNewSubject] = useState('')
  const [newGrade, setNewGrade] = useState('')
  const [documentFile, setDocumentFile] = useState<string>('')

  const currentStepIndex = STEPS.indexOf(STEPS[['personal', 'programme', 'olevels', 'documents', 'review'].indexOf(currentStep)])

  const handlePersonalChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddOLevel = () => {
    if (newSubject && newGrade && olevels.length < 9) {
      setOlevels((prev) => [...prev, { subject: newSubject, grade: newGrade }])
      setNewSubject('')
      setNewGrade('')
    }
  }

  const handleRemoveOLevel = (index: number) => {
    setOlevels((prev) => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    const stepOrder: FormStep[] = ['personal', 'programme', 'olevels', 'documents', 'review']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const stepOrder: FormStep[] = ['personal', 'programme', 'olevels', 'documents', 'review']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">Application Form</h1>
          <p className="text-muted-foreground">Step {STEPS.indexOf(STEPS[['personal', 'programme', 'olevels', 'documents', 'review'].indexOf(currentStep)]) + 1} of {STEPS.length}</p>
        </div>

        <ProgressIndicator steps={STEPS} currentStep={currentStepIndex} />

        <Card className="mt-12 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>{STEPS[currentStepIndex]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 'personal' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={personalInfo.name}
                    onChange={(e) => handlePersonalChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={personalInfo.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+234 800 000 0000"
                    value={personalInfo.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State of Origin</Label>
                  <Select value={personalInfo.stateOfOrigin} onValueChange={(value) => handlePersonalChange('stateOfOrigin', value)}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="abuja">Abuja</SelectItem>
                      <SelectItem value="kano">Kano</SelectItem>
                      <SelectItem value="oyo">Oyo</SelectItem>
                      <SelectItem value="rivers">Rivers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 'programme' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="programme">Select Programme</Label>
                  <Select value={programme} onValueChange={setProgramme}>
                    <SelectTrigger id="programme">
                      <SelectValue placeholder="Choose a programme..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="law">Law</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="business">Business Administration</SelectItem>
                      <SelectItem value="nursing">Nursing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jamb">JAMB Score</Label>
                  <Input
                    id="jamb"
                    type="number"
                    placeholder="200"
                    min="0"
                    max="400"
                    value={jambScore}
                    onChange={(e) => setJambScore(e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 'olevels' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Add your O&apos;level results (up to 9 subjects)</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={newSubject} onValueChange={setNewSubject}>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English Language</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="economics">Economics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select value={newGrade} onValueChange={setNewGrade}>
                      <SelectTrigger id="grade">
                        <SelectValue placeholder="Select grade..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1</SelectItem>
                        <SelectItem value="B2">B2</SelectItem>
                        <SelectItem value="B3">B3</SelectItem>
                        <SelectItem value="C4">C4</SelectItem>
                        <SelectItem value="C5">C5</SelectItem>
                        <SelectItem value="C6">C6</SelectItem>
                        <SelectItem value="D7">D7</SelectItem>
                        <SelectItem value="E8">E8</SelectItem>
                        <SelectItem value="F9">F9</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {olevels.length < 9 && (
                  <Button onClick={handleAddOLevel} variant="outline" className="w-full">
                    Add Subject
                  </Button>
                )}

                {olevels.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Your Results ({olevels.length}/9)</p>
                    {olevels.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">
                          {result.subject} - <span className="font-semibold">{result.grade}</span>
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOLevel(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 'documents' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="document">Upload O&apos;level Result (PDF or Image)</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Input
                      id="document"
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setDocumentFile(e.target.files[0].name)
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="document" className="cursor-pointer">
                      <p className="text-sm text-muted-foreground">
                        {documentFile ? (
                          <>
                            <span className="font-semibold text-primary">{documentFile}</span>
                            <br />
                            Click to change
                          </>
                        ) : (
                          <>
                            Click to upload or drag and drop
                            <br />
                            <span className="text-xs">PDF, JPG or PNG (max 10MB)</span>
                          </>
                        )}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <div className="bg-accent/10 border border-accent rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2">Personal Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {personalInfo.name}</p>
                    <p><span className="text-muted-foreground">Email:</span> {personalInfo.email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {personalInfo.phone}</p>
                    <p><span className="text-muted-foreground">State:</span> {personalInfo.stateOfOrigin}</p>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2">Programme & Scores</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Programme:</span> {programme}</p>
                    <p><span className="text-muted-foreground">JAMB Score:</span> {jambScore}</p>
                    <p><span className="text-muted-foreground">O&apos;level Subjects:</span> {olevels.length}</p>
                  </div>
                </div>

                <Button className="w-full" size="lg" asChild>
                  <Link href="/confirmation">Submit Application</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 'personal'}
            className="flex-1"
          >
            Previous
          </Button>
          {currentStep !== 'review' && (
            <Button onClick={handleNext} className="flex-1">
              Next
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
