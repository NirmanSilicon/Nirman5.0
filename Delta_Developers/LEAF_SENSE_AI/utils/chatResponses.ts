import { getDiseaseInfo, DiseaseInfo } from "./diseaseData";

interface ChatResponse {
  answer: string;
}

const GREETING_PATTERNS = [
  /^(hi|hello|hey|greetings)/i,
];

const CAUSE_PATTERNS = [
  /why.*happen/i,
  /what.*cause/i,
  /why.*disease/i,
  /how.*get/i,
  /reason/i,
];

const TREATMENT_PATTERNS = [
  /what.*do/i,
  /how.*treat/i,
  /treatment/i,
  /cure/i,
  /fix/i,
  /help/i,
  /remedy/i,
  /medicine/i,
];

const PREVENTION_PATTERNS = [
  /prevent/i,
  /avoid/i,
  /stop.*from/i,
  /protect/i,
  /future/i,
];

const SEVERITY_PATTERNS = [
  /serious/i,
  /severe/i,
  /bad/i,
  /dangerous/i,
  /worried/i,
  /concern/i,
];

const SYMPTOM_PATTERNS = [
  /symptom/i,
  /sign/i,
  /look.*like/i,
  /identify/i,
  /recognize/i,
];

function formatList(items: string[]): string {
  if (items.length === 0) return "No specific items to list.";
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function matchesAnyPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function generateChatResponse(
  disease: string,
  question: string
): ChatResponse {
  const diseaseInfo = getDiseaseInfo(disease);
  const isHealthy = diseaseInfo.name === "healthy";
  const questionLower = question.toLowerCase();

  if (matchesAnyPattern(questionLower, GREETING_PATTERNS)) {
    return {
      answer: `Hello! I'm LeafSense AI, your digital crop doctor. ${
        isHealthy
          ? "Your plant looks healthy! Feel free to ask me any questions about plant care."
          : `I detected ${diseaseInfo.displayName} in your plant. Ask me about the causes, treatments, or prevention measures.`
      }`,
    };
  }

  if (isHealthy) {
    if (matchesAnyPattern(questionLower, PREVENTION_PATTERNS)) {
      return {
        answer: `Great news - your plant is healthy! Here are tips to keep it that way:\n\n${formatList(diseaseInfo.prevention)}`,
      };
    }
    return {
      answer:
        "Your plant appears healthy! Keep up the good care. I recommend regular monitoring, proper watering, and good air circulation to maintain plant health. Feel free to scan another leaf if you notice any changes.",
    };
  }

  if (matchesAnyPattern(questionLower, CAUSE_PATTERNS)) {
    return {
      answer: `${diseaseInfo.displayName} is typically caused by:\n\n${formatList(diseaseInfo.causes)}\n\n${diseaseInfo.description}`,
    };
  }

  if (matchesAnyPattern(questionLower, TREATMENT_PATTERNS)) {
    return {
      answer: `Here are recommended treatments for ${diseaseInfo.displayName}:\n\n${formatList(diseaseInfo.treatments)}\n\nAct quickly for best results.`,
    };
  }

  if (matchesAnyPattern(questionLower, PREVENTION_PATTERNS)) {
    return {
      answer: `To prevent ${diseaseInfo.displayName} in the future:\n\n${formatList(diseaseInfo.prevention)}`,
    };
  }

  if (matchesAnyPattern(questionLower, SEVERITY_PATTERNS)) {
    const severityMessages = {
      low: "This condition is generally not serious and can be easily managed with basic care.",
      medium: "This is a moderate concern that requires attention. With proper treatment, your plants should recover well.",
      high: "This is a serious condition that requires immediate action. Without treatment, it can spread quickly and cause significant crop damage.",
    };
    return {
      answer: `${diseaseInfo.displayName} severity level: ${diseaseInfo.severity.toUpperCase()}\n\n${severityMessages[diseaseInfo.severity]}`,
    };
  }

  if (matchesAnyPattern(questionLower, SYMPTOM_PATTERNS)) {
    return {
      answer: `Common symptoms of ${diseaseInfo.displayName}:\n\n${formatList(diseaseInfo.symptoms)}`,
    };
  }

  return {
    answer: `I detected ${diseaseInfo.displayName} in your plant. Here's a summary:\n\n${diseaseInfo.description}\n\nYou can ask me about:\n- Why this happened\n- How to treat it\n- How to prevent it\n- How serious it is`,
  };
}
