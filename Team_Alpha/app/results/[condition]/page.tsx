import { analyzeSymptoms } from '@/lib/gemini'

const getQuestionCategory = (questionNum: number): string => {
    if ([1, 3, 7, 15, 30].includes(questionNum)) return "pain/discomfort"
    if ([2, 5, 11, 24, 25].includes(questionNum)) return "respiratory symptoms"
    if ([6, 12, 27, 28].includes(questionNum)) return "neurological symptoms"
    if ([9, 26].includes(questionNum)) return "gastrointestinal symptoms"
    return "general symptoms"
  }
=======
  const getQuestionCategory = (questionNum: number): string => {
    if ([1, 3, 7, 15, 30].includes(questionNum)) return "pain/discomfort"
    if ([2, 5, 11, 24, 25].includes(questionNum)) return "respiratory symptoms"
    if ([6, 12, 27, 28].includes(questionNum)) return "neurological symptoms"
    if ([9, 26].includes(questionNum)) return "gastrointestinal symptoms"
    return "general symptoms"
  }

  const performAiAnalysis = async (answers: any, condition: string) => {
    setIsAiLoading(true)
    try {
      const result = await analyzeSymptoms(condition, answers)
      setAiAnalysis(result.analysis)
    } catch (error) {
      console.error("Error performing AI analysis:", error)
      setAiAnalysis("Unable to generate AI analysis at this time. Please consult with a healthcare professional.")
    } finally {
      setIsAiLoading(false)
    }
  }
