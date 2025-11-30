import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export interface AiAnalysisResult {
  analysis: string
  severity: string
  recommendations: string[]
  riskFactors: string[]
  specialist: string
}

// Mock data for when API fails
const getMockAnalysis = (condition: string): AiAnalysisResult => {
  const mockAnalyses: Record<string, AiAnalysisResult> = {
    diabetes: {
      analysis: "Based on your responses, you show moderate risk factors for diabetes. Your symptoms suggest possible insulin resistance and elevated blood sugar levels.",
      severity: "Moderate",
      recommendations: [
        "Schedule a blood glucose test with your doctor",
        "Maintain a balanced diet with controlled carbohydrate intake",
        "Engage in regular physical activity (30 minutes daily)",
        "Monitor your weight and aim for gradual weight loss if overweight"
      ],
      riskFactors: [
        "Family history of diabetes",
        "Sedentary lifestyle",
        "Poor dietary habits",
        "Age over 45"
      ],
      specialist: "Endocrinologist"
    },
    hypertension: {
      analysis: "Your questionnaire responses indicate potential hypertension concerns. The reported symptoms suggest elevated blood pressure that requires medical attention.",
      severity: "High",
      recommendations: [
        "Consult a healthcare provider for blood pressure monitoring",
        "Reduce sodium intake in your diet",
        "Practice stress management techniques",
        "Limit alcohol consumption and quit smoking if applicable"
      ],
      riskFactors: [
        "High stress levels",
        "Excessive salt consumption",
        "Lack of regular exercise",
        "Family history of hypertension"
      ],
      specialist: "Cardiologist"
    },
    asthma: {
      analysis: "Your symptoms are consistent with asthma triggers. The respiratory symptoms you've described suggest airway inflammation and possible asthma exacerbation.",
      severity: "Moderate to High",
      recommendations: [
        "Consult a pulmonologist for proper diagnosis",
        "Keep rescue inhaler accessible at all times",
        "Identify and avoid asthma triggers in your environment",
        "Learn proper inhaler technique and create an asthma action plan"
      ],
      riskFactors: [
        "Environmental allergens",
        "Respiratory infections",
        "Air pollution exposure",
        "Physical exertion without proper warm-up"
      ],
      specialist: "Pulmonologist"
    },
    "heart disease": {
      analysis: "Your questionnaire responses suggest potential cardiovascular concerns. The symptoms you've reported may indicate issues with heart function or blood vessel health.",
      severity: "High",
      recommendations: [
        "Schedule an immediate appointment with a cardiologist",
        "Undergo comprehensive cardiac testing including ECG and echocardiogram",
        "Monitor blood pressure and heart rate regularly",
        "Adopt a heart-healthy diet low in saturated fats and cholesterol",
        "Engage in moderate exercise as approved by your doctor"
      ],
      riskFactors: [
        "Family history of heart disease",
        "High blood pressure",
        "High cholesterol levels",
        "Smoking or tobacco use",
        "Sedentary lifestyle",
        "Obesity"
      ],
      specialist: "Cardiologist"
    },
    cancer: {
      analysis: "Your symptoms may be indicative of various types of cancer. Early detection and medical evaluation are crucial for proper diagnosis and treatment.",
      severity: "Critical",
      recommendations: [
        "Consult an oncologist immediately for comprehensive evaluation",
        "Undergo appropriate diagnostic tests based on your symptoms",
        "Keep detailed records of all symptoms and their progression",
        "Seek second opinions if necessary",
        "Consider genetic counseling if family history suggests hereditary cancers"
      ],
      riskFactors: [
        "Family history of cancer",
        "Age over 50",
        "Exposure to carcinogens",
        "Unhealthy lifestyle factors",
        "Certain genetic mutations"
      ],
      specialist: "Oncologist"
    },
    depression: {
      analysis: "Your responses indicate symptoms consistent with depression. Mental health evaluation is recommended to assess the severity and determine appropriate treatment.",
      severity: "Moderate",
      recommendations: [
        "Consult a psychiatrist or psychologist for proper diagnosis",
        "Consider therapy options such as cognitive behavioral therapy",
        "Evaluate medication options if recommended by a healthcare provider",
        "Establish a support system and consider support groups",
        "Practice stress management and self-care techniques"
      ],
      riskFactors: [
        "Family history of mental health disorders",
        "Chronic stress or trauma",
        "Major life changes",
        "Substance abuse",
        "Chronic medical conditions"
      ],
      specialist: "Psychiatrist"
    },
    arthritis: {
      analysis: "Your symptoms suggest joint inflammation and possible arthritis. Proper diagnosis is important to determine the type of arthritis and appropriate management.",
      severity: "Moderate",
      recommendations: [
        "Consult a rheumatologist for specialized evaluation",
        "Undergo joint imaging and blood tests as recommended",
        "Consider physical therapy for joint mobility and strength",
        "Explore pain management options including medications and lifestyle modifications",
        "Maintain a healthy weight to reduce joint stress"
      ],
      riskFactors: [
        "Age over 40",
        "Family history of arthritis",
        "Previous joint injuries",
        "Obesity",
        "Repetitive joint use"
      ],
      specialist: "Rheumatologist"
    }
  }

  return mockAnalyses[condition.toLowerCase()] || {
    analysis: "Based on your responses, we recommend consulting with a healthcare professional for a comprehensive evaluation. While we cannot provide a specific diagnosis, your symptoms warrant medical attention.",
    severity: "Unknown - Requires Medical Evaluation",
    recommendations: [
      "Schedule an appointment with your primary care physician",
      "Keep a symptom diary for better tracking",
      "Avoid self-diagnosis and seek professional medical advice",
      "Consider lifestyle modifications for overall health improvement"
    ],
    riskFactors: [
      "Multiple symptoms reported",
      "Need for comprehensive medical evaluation",
      "Importance of professional healthcare consultation"
    ],
    specialist: "General Practitioner"
  }
}

export async function analyzeSymptoms(condition: string, answers: any): Promise<AiAnalysisResult> {
  try {
    // Check if API key is available
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.log('Gemini API key not found, using mock data')
      return getMockAnalysis(condition)
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Analyze the following symptom questionnaire responses for ${condition}. Provide a structured analysis including:

1. Overall assessment of the condition severity
2. Key symptoms identified
3. Risk factors present
4. Recommended next steps
5. When to seek immediate medical attention
6. Recommended medical specialist for this condition

Questionnaire responses: ${JSON.stringify(answers)}

Please format your response as a JSON object with the following structure:
{
  "analysis": "comprehensive analysis text",
  "severity": "Low/Moderate/High/Critical",
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "riskFactors": ["risk factor 1", "risk factor 2", ...],
  "specialist": "name of the medical specialist"
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      // Try to parse as JSON first
      const parsedResponse = JSON.parse(text)
      return {
        analysis: parsedResponse.analysis || text,
        severity: parsedResponse.severity || "Moderate",
        recommendations: parsedResponse.recommendations || [],
        riskFactors: parsedResponse.riskFactors || [],
        specialist: parsedResponse.specialist || "General Practitioner"
      }
    } catch (parseError) {
      // If JSON parsing fails, return the text as analysis
      console.log('Failed to parse AI response as JSON, using raw text')
      return {
        analysis: text,
        severity: "Moderate",
        recommendations: ["Consult with a healthcare professional for personalized advice"],
        riskFactors: ["Further medical evaluation needed"],
        specialist: "General Practitioner"
      }
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error)
    console.log('Falling back to mock data due to API error')
    return getMockAnalysis(condition)
  }
}
