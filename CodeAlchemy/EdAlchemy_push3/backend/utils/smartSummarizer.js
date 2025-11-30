class SmartSummarizer {
  
  // Generate comprehensive summary
  static generateSummary(text, type = 'standard') {
    if (!text || text.length < 50) {
      return {
        summary: "Not enough content to generate a meaningful summary.",
        keyPoints: [],
        keyConcepts: []
      };
    }

    const sentences = this.extractSentences(text);
    const paragraphs = this.splitIntoParagraphs(text);
    
    switch (type) {
      case 'brief':
        return this.generateBriefSummary(sentences, paragraphs);
      case 'detailed':
        return this.generateDetailedSummary(sentences, paragraphs);
      case 'bullet':
        return this.generateBulletSummary(sentences, paragraphs);
      default:
        return this.generateStandardSummary(sentences, paragraphs);
    }
  }

  // Standard summary (3-5 sentences)
  static generateStandardSummary(sentences, paragraphs) {
    if (sentences.length === 0) return this.getFallbackSummary();

    const summarySentences = [];
    
    // Include first sentence (usually introduction)
    if (sentences.length > 0) {
      summarySentences.push(sentences[0]);
    }
    
    // Include key middle sentences
    if (sentences.length > 3) {
      const middleIndex = Math.floor(sentences.length / 2);
      summarySentences.push(sentences[middleIndex]);
    }
    
    // Include conclusion if available
    if (sentences.length > 1) {
      summarySentences.push(sentences[sentences.length - 1]);
    }
    
    // Add one more important sentence based on length
    if (sentences.length > 5) {
      const importantIndex = Math.floor(sentences.length * 0.75);
      summarySentences.push(sentences[importantIndex]);
    }

    const summary = summarySentences.slice(0, 4).join(' ') + '.';
    const keyPoints = this.extractKeyPoints(summarySentences);
    const keyConcepts = this.extractKeyConcepts(summary);

    return {
      summary: summary,
      keyPoints: keyPoints,
      keyConcepts: keyConcepts,
      type: 'standard',
      sentenceCount: summarySentences.length
    };
  }

  // Brief summary (2-3 sentences)
  static generateBriefSummary(sentences, paragraphs) {
    if (sentences.length === 0) return this.getFallbackSummary();

    const summarySentences = [];
    
    if (sentences.length > 0) {
      summarySentences.push(sentences[0]);
    }
    
    if (sentences.length > 2) {
      summarySentences.push(sentences[sentences.length - 1]);
    }

    const summary = summarySentences.join(' ') + '.';
    const keyPoints = this.extractKeyPoints(summarySentences);
    const keyConcepts = this.extractKeyConcepts(summary);

    return {
      summary: summary,
      keyPoints: keyPoints,
      keyConcepts: keyConcepts,
      type: 'brief',
      sentenceCount: summarySentences.length
    };
  }

  // Detailed summary (5-7 sentences)
  static generateDetailedSummary(sentences, paragraphs) {
    if (sentences.length === 0) return this.getFallbackSummary();

    const summarySentences = [];
    const sentenceCount = Math.min(7, Math.max(5, Math.floor(sentences.length * 0.3)));
    
    // Strategic selection of sentences
    const indices = [
      0, // Introduction
      Math.floor(sentences.length * 0.25),
      Math.floor(sentences.length * 0.5),
      Math.floor(sentences.length * 0.75),
      sentences.length - 1 // Conclusion
    ];

    // Add additional important sentences
    for (let i = 2; i < sentences.length - 2 && summarySentences.length < sentenceCount; i++) {
      if (this.isImportantSentence(sentences[i]) && !indices.includes(i)) {
        indices.push(i);
      }
    }

    // Get unique sorted indices
    const uniqueIndices = [...new Set(indices)].sort((a, b) => a - b);
    
    uniqueIndices.slice(0, sentenceCount).forEach(index => {
      if (sentences[index]) {
        summarySentences.push(sentences[index]);
      }
    });

    const summary = summarySentences.join(' ') + '.';
    const keyPoints = this.extractKeyPoints(summarySentences);
    const keyConcepts = this.extractKeyConcepts(summary);

    return {
      summary: summary,
      keyPoints: keyPoints,
      keyConcepts: keyConcepts,
      type: 'detailed',
      sentenceCount: summarySentences.length
    };
  }

  // Bullet point summary
  static generateBulletSummary(sentences, paragraphs) {
    if (sentences.length === 0) return this.getFallbackSummary();

    const keyPoints = this.extractKeyPoints(sentences);
    const keyConcepts = this.extractKeyConcepts(sentences.join(' '));
    
    // Create summary from top key points
    const summary = "Key points:\n" + keyPoints.slice(0, 5).map(point => `• ${point}`).join('\n');

    return {
      summary: summary,
      keyPoints: keyPoints,
      keyConcepts: keyConcepts,
      type: 'bullet',
      sentenceCount: keyPoints.length
    };
  }

  // Extract key points from sentences
  static extractKeyPoints(sentences, maxPoints = 8) {
    if (!sentences || sentences.length === 0) return [];

    const points = [];
    const usedConcepts = new Set();

    sentences.forEach(sentence => {
      if (sentence.length > 20 && sentence.length < 150) {
        // Clean and shorten the sentence for key points
        const cleanPoint = sentence
          .replace(/^[^a-zA-Z]*/, '') // Remove leading non-alphabet characters
          .replace(/[.!?]+$/, '') // Remove trailing punctuation
          .trim();

        if (cleanPoint.length > 15 && cleanPoint.length < 100) {
          const mainConcept = this.getMainConcept(cleanPoint);
          if (!usedConcepts.has(mainConcept)) {
            points.push(cleanPoint);
            usedConcepts.add(mainConcept);
          }
        }
      }
    });

    return points.slice(0, maxPoints);
  }

  // Extract key concepts
  static extractKeyConcepts(text, maxConcepts = 10) {
    if (!text) return [];

    const words = text.toLowerCase()
      .split(/\s+/)
      .filter(word => 
        word.length > 4 && 
        word.length < 20 &&
        !this.isStopWord(word)
      );

    // Frequency analysis
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxConcepts)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
  }

  // Helper methods
  static extractSentences(text) {
    if (!text) return [];
    
    return text.split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 10)
      .slice(0, 50);
  }

  static splitIntoParagraphs(text) {
    if (!text) return [];
    
    return text.split(/\n\s*\n/)
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0);
  }

  static isImportantSentence(sentence) {
    if (!sentence) return false;
    
    const importantIndicators = [
      'important', 'key', 'essential', 'critical', 'main', 'primary',
      'significantly', 'crucially', 'fundamentally', 'notably'
    ];
    
    const lowerSentence = sentence.toLowerCase();
    return importantIndicators.some(indicator => lowerSentence.includes(indicator)) ||
           sentence.length > 50; // Longer sentences often contain more information
  }

  static getMainConcept(sentence) {
    const words = sentence.split(' ');
    return words.length > 0 ? words[0].toLowerCase() : '';
  }

  static isStopWord(word) {
    const stopWords = new Set([
      'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their'
    ]);
    
    return stopWords.has(word.toLowerCase());
  }

  static getFallbackSummary() {
    return {
      summary: "Unable to generate summary from the provided content.",
      keyPoints: ["Content too short or unclear for summarization"],
      keyConcepts: [],
      type: 'fallback',
      sentenceCount: 0
    };
  }

  // Calculate reading time (words per minute)
  static calculateReadingTime(wordCount, wordsPerMinute = 200) {
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Analyze difficulty level
  static analyzeDifficulty(text) {
    if (!text) return 'intermediate';
    
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const characters = text.replace(/\s/g, '').length;
    
    const avgSentenceLength = words / sentences;
    const avgWordLength = characters / words;
    
    if (avgSentenceLength > 25 && avgWordLength > 5.5) return 'advanced';
    if (avgSentenceLength > 18 && avgWordLength > 4.8) return 'intermediate';
    return 'beginner';
  }
}

module.exports = SmartSummarizer;