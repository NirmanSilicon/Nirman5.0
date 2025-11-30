"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Calendar, Clock, MapPin } from "lucide-react"
import type { TherapyModule, DoshaType } from "@/types/therapy"
import { InstructionCard } from "./instruction-card"
import { FeedbackDialog } from "./feedback-dialog"

interface TherapyCardProps {
  therapy: TherapyModule
  onUpdateProgress: (therapyId: string, progress: number) => void
  onToggleInstruction: (therapyId: string, sectionId: string, instructionId: string) => void
}

const doshaColors: Record<DoshaType, string> = {
  vata: "bg-blue-500 text-white",
  pitta: "bg-red-500 text-white",
  kapha: "bg-green-600 text-white",
}

const doshaIcons: Record<DoshaType, string> = {
  vata: "💨",
  pitta: "🔥",
  kapha: "🌱",
}

export function TherapyCard({ therapy, onUpdateProgress, onToggleInstruction }: TherapyCardProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedInstructionId, setSelectedInstructionId] = useState<string>("")

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const handleInstructionToggle = (sectionId: string, instructionId: string) => {
    onToggleInstruction(therapy.therapyId, sectionId, instructionId)
  }

  const handleFeedbackClick = (instructionId: string) => {
    setSelectedInstructionId(instructionId)
    setShowFeedback(true)
  }

  const getSectionProgress = (sectionId: string) => {
    const section = therapy.sections.find((s) => s.id === sectionId)
    if (!section) return 0

    const completed = section.instructions.filter((inst) => inst.completed).length
    return Math.round((completed / section.instructions.length) * 100)
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl font-bold text-balance">{therapy.name}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {therapy.clinic}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(therapy.scheduledDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {therapy.scheduledTime}
                </div>
              </div>
            </div>
            <Badge className={`${doshaColors[therapy.dominantDosha]} flex items-center gap-1`}>
              <span>{doshaIcons[therapy.dominantDosha]}</span>
              {therapy.dominantDosha.charAt(0).toUpperCase() + therapy.dominantDosha.slice(1)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">{therapy.overallProgress}%</span>
            </div>
            <Progress value={therapy.overallProgress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {therapy.sections.map((section) => (
            <Collapsible
              key={section.id}
              open={openSections[section.id]}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <h3 className="font-semibold">{section.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={getSectionProgress(section.id)} className="h-1 w-24" />
                        <span className="text-xs text-muted-foreground">{getSectionProgress(section.id)}%</span>
                      </div>
                    </div>
                  </div>
                  {openSections[section.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-2 mt-2">
                {section.instructions.map((instruction) => (
                  <InstructionCard
                    key={instruction.id}
                    instruction={instruction}
                    onToggle={() => handleInstructionToggle(section.id, instruction.id)}
                    onFeedback={() => handleFeedbackClick(instruction.id)}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      <FeedbackDialog open={showFeedback} onOpenChange={setShowFeedback} instructionId={selectedInstructionId} />
    </>
  )
}
