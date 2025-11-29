"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  instructionId: string
}

export function FeedbackDialog({ open, onOpenChange, instructionId }: FeedbackDialogProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = () => {
    // Save feedback to localStorage
    const feedback = {
      instructionId,
      rating,
      comment,
      timestamp: new Date().toISOString()
    };

    try {
      // Get existing feedback
      const existingFeedback = JSON.parse(localStorage.getItem('instructionFeedback') || '[]');
      
      // Add new feedback
      const updatedFeedback = [...existingFeedback, feedback];
      
      // Save back to localStorage
      localStorage.setItem('instructionFeedback', JSON.stringify(updatedFeedback));
      
      console.log("Feedback saved:", feedback);
    } catch (error) {
      console.error("Error saving feedback:", error);
    }

    // Reset form
    setRating(0)
    setComment("")
    onOpenChange(false)
  }

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            How was your experience with this instruction? Your feedback helps us improve.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingClick(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 hover:scale-110 transition-transform"
                  aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                  title={`Rate ${value} star${value > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-6 w-6 ${
                      value <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Comments (Optional)
            </label>
            <Textarea
              id="comment"
              placeholder="Share any additional thoughts or suggestions..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={rating === 0}>
              Submit Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
