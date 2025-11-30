"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Bell, Info } from "lucide-react"
import type { Instruction } from "@/types/therapy"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface InstructionCardProps {
  instruction: Instruction
  onToggle: () => void
  onFeedback: () => void
}

export function InstructionCard({ instruction, onToggle, onFeedback }: InstructionCardProps) {
  return (
    <Card
      className={`transition-all duration-200 ${instruction.completed ? "bg-green-50 border-green-300 shadow-green-100" : "hover:shadow-md"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div 
              className={`w-4 h-4 border-2 rounded cursor-pointer transition-all duration-200 ${
                instruction.completed 
                  ? "bg-black border-black" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => {
                console.log('Checkbox clicked for instruction:', instruction.id);
                onToggle();
              }}
            >
              {instruction.completed && (
                <div className="w-full h-full flex items-center justify-center">
                  <svg 
                    className="w-3 h-3 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label
              htmlFor={instruction.id}
              className={`text-sm leading-relaxed cursor-pointer block ${
                instruction.completed ? "line-through text-muted-foreground" : ""
              }`}
              onClick={() => {
                console.log('Label clicked for instruction:', instruction.id);
                onToggle();
              }}
            >
              {instruction.text}
            </label>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {instruction.hasAlert && (
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    {instruction.alertTime}
                  </Badge>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Info className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Additional information about this step</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {instruction.completed && (
                <Button variant="ghost" size="sm" onClick={onFeedback} className="text-xs flex items-center gap-1 h-7">
                  <Star className="h-3 w-3" />
                  Feedback
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
