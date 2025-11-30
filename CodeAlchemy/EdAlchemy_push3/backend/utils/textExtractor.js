const fs = require('fs').promises;
const path = require('path');

class TextExtractor {
  
  // Extract text from various file types
  static async extractText(filePath, fileType) {
    try {
      console.log(`Extracting text from: ${filePath}, Type: ${fileType}`);
      
      // For now, we'll handle TXT files and mock others
      // In production, you'd integrate pdf-parse, mammoth, tesseract.js
      switch (fileType.toLowerCase()) {
        case 'pdf':
          return await this.extractFromPDF(filePath);
        
        case 'docx':
        case 'doc':
          return await this.extractFromDOCX(filePath);
        
        case 'txt':
          return await this.extractFromTXT(filePath);
        
        default:
          // For unsupported types, try to read as text
          return await this.extractFromTXT(filePath);
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      // Return sample text but don't fail completely
      return {
        text: this.getSampleContent(fileType),
        metadata: {
          pageCount: 1,
          source: 'placeholder'
        }
      };
    }
  }

  // Extract text from PDF (placeholder)
  static async extractFromPDF(filePath) {
    try {
      // Placeholder - in production, use pdf-parse
      const sampleText = `
        Machine Learning Fundamentals
        
        Machine learning is a subset of artificial intelligence that enables computers to learn 
        and make decisions without being explicitly programmed. It uses algorithms to identify 
        patterns in data and make predictions based on those patterns.
        
        There are three main types of machine learning:
        1. Supervised Learning: Uses labeled data to train models
        2. Unsupervised Learning: Finds patterns in unlabeled data
        3. Reinforcement Learning: Learns through trial and error
        
        Deep learning is a specialized form of machine learning that uses neural networks with 
        multiple layers to process complex data like images, speech, and text.
      `;
      
      return {
        text: sampleText,
        metadata: {
          pageCount: 3,
          info: { Title: 'Machine Learning Fundamentals' }
        }
      };
    } catch (error) {
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
  }

  // Extract text from DOCX (placeholder)
  static async extractFromDOCX(filePath) {
    try {
      // Placeholder - in production, use mammoth
      const sampleText = `
        Artificial Intelligence and Its Applications
        
        Artificial Intelligence (AI) refers to the simulation of human intelligence in machines 
        that are programmed to think and learn like humans. The term may also be applied to any 
        machine that exhibits traits associated with a human mind such as learning and problem-solving.
        
        Key Applications of AI:
        - Natural Language Processing (NLP)
        - Computer Vision
        - Robotics
        - Expert Systems
        - Machine Learning
        
        AI technologies are transforming industries including healthcare, finance, transportation, 
        and education by automating complex tasks and providing intelligent insights.
      `;
      
      return {
        text: sampleText,
        metadata: {
          messages: ['DOCX processing placeholder']
        }
      };
    } catch (error) {
      throw new Error(`DOCX extraction failed: ${error.message}`);
    }
  }

  // Extract text from TXT
  static async extractFromTXT(filePath) {
    try {
      const text = await fs.readFile(filePath, 'utf8');
      return {
        text: text,
        metadata: {
          source: 'text_file'
        }
      };
    } catch (error) {
      // If reading fails, return sample text
      return {
        text: this.getSampleContent('txt'),
        metadata: {}
      };
    }
  }

  // Get sample content based on file type
  static getSampleContent(fileType) {
    const samples = {
      pdf: `Sample PDF content about technology and innovation. This document discusses the impact of artificial intelligence on modern society and how machine learning algorithms are transforming various industries.`,
      
      docx: `Sample Word document content. This text discusses the fundamentals of computer science, programming paradigms, and software development methodologies.`,
      
      txt: `Sample study material content for text file. This contains educational content about science and technology that can be used for summarization and analysis. Topics include physics, chemistry, biology, and computer science principles.`,
      
      default: `This is sample content for analysis and summarization. The text discusses various academic topics and provides information that can be processed by the smart summarizer to generate key insights and condensed versions.`
    };

    return samples[fileType] || samples.default;
  }

  // Clean and preprocess extracted text
  static cleanText(text) {
    if (!text) return '';
    
    return text
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .replace(/\s{2,}/g, ' ')    // Replace multiple spaces with single space
      .trim();
  }

  // Calculate word count
  static countWords(text) {
    if (!text) return 0;
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  // Extract sentences for processing
  static extractSentences(text) {
    if (!text) return [];
    
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => 
        sentence.length > 10 && 
        !sentence.match(/^\d+$/) // Exclude pure numbers
      );
  }

  // Check if file exists
  static async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = TextExtractor;