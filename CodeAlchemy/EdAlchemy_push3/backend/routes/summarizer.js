const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudyMaterial = require('../models/StudyMaterials');
const SmartSummarizer = require('../utils/smartSummarizer');
const TextExtractor = require('../utils/textExtractor');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/materials');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.txt', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, Text, and Word documents are allowed for summarization'));
    }
  }
});

// Auth middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, 'edalchemy_super_secret_key_2023');
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

router.use(authenticate);

// Upload and summarize document
router.post('/upload-summarize', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { title, subject, summaryType = 'standard' } = req.body;

    // Create study material record
    const studyMaterial = await StudyMaterial.create({
      userId: req.user.id,
      title: title || req.file.originalname,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: path.extname(req.file.originalname).substring(1).toLowerCase(),
      fileSize: req.file.size,
      subject: subject || 'General',
      processingStatus: 'processing'
    });

    // Process in background
    processAndSummarize(studyMaterial.id, summaryType).catch(console.error);

    res.json({
      success: true,
      message: 'File uploaded successfully! Summarization in progress...',
      material: {
        id: studyMaterial.id,
        title: studyMaterial.title,
        processingStatus: studyMaterial.processingStatus
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
});

// Summarize existing material
router.post('/material/:id/summarize', async (req, res) => {
  try {
    const { summaryType = 'standard' } = req.body;
    const materialId = req.params.id;

    const material = await StudyMaterial.findByPk(materialId);
    
    if (!material || material.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    if (!material.isProcessed || !material.extractedText) {
      return res.status(400).json({
        success: false,
        message: 'Material not processed yet or no text content available'
      });
    }

    // Generate summary
    const summaryResult = SmartSummarizer.generateSummary(material.extractedText, summaryType);
    
    // Update material with new summary
    await material.update({
      summary: summaryResult.summary,
      keyPoints: summaryResult.keyPoints,
      keyConcepts: summaryResult.keyConcepts,
      metadata: {
        ...material.metadata,
        lastSummarized: new Date().toISOString(),
        summaryType: summaryType
      }
    });

    res.json({
      success: true,
      message: 'Summary generated successfully!',
      summary: summaryResult,
      material: {
        id: material.id,
        title: material.title
      }
    });

  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({
      success: false,
      message: 'Summarization failed',
      error: error.message
    });
  }
});

// Generate multiple summary types
router.post('/material/:id/summarize-all', async (req, res) => {
  try {
    const materialId = req.params.id;

    const material = await StudyMaterial.findByPk(materialId);
    
    if (!material || material.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    if (!material.isProcessed || !material.extractedText) {
      return res.status(400).json({
        success: false,
        message: 'Material not processed yet or no text content available'
      });
    }

    // Generate all summary types
    const summaries = {
      brief: SmartSummarizer.generateSummary(material.extractedText, 'brief'),
      standard: SmartSummarizer.generateSummary(material.extractedText, 'standard'),
      detailed: SmartSummarizer.generateSummary(material.extractedText, 'detailed'),
      bullet: SmartSummarizer.generateSummary(material.extractedText, 'bullet')
    };

    res.json({
      success: true,
      message: 'All summary types generated successfully!',
      summaries: summaries,
      material: {
        id: material.id,
        title: material.title,
        wordCount: material.wordCount
      }
    });

  } catch (error) {
    console.error('Multi-summarization error:', error);
    res.status(500).json({
      success: false,
      message: 'Multi-summarization failed',
      error: error.message
    });
  }
});

// Get material summary
router.get('/material/:id/summary', async (req, res) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    
    if (!material || material.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    if (!material.summary) {
      return res.status(404).json({
        success: false,
        message: 'No summary available for this material'
      });
    }

    res.json({
      success: true,
      summary: {
        content: material.summary,
        keyPoints: material.keyPoints,
        keyConcepts: material.keyConcepts,
        readingTime: material.readingTime,
        difficultyLevel: material.difficultyLevel,
        wordCount: material.wordCount
      },
      material: {
        id: material.id,
        title: material.title,
        subject: material.subject
      }
    });

  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summary',
      error: error.message
    });
  }
});

// Analyze text without saving
router.post('/analyze-text', async (req, res) => {
  try {
    const { text, summaryType = 'standard' } = req.body;

    if (!text || text.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Text too short for analysis (minimum 50 characters required)'
      });
    }

    const wordCount = text.split(/\s+/).length;
    const readingTime = SmartSummarizer.calculateReadingTime(wordCount);
    const difficultyLevel = SmartSummarizer.analyzeDifficulty(text);
    const summaryResult = SmartSummarizer.generateSummary(text, summaryType);

    res.json({
      success: true,
      message: 'Text analyzed successfully!',
      analysis: {
        wordCount: wordCount,
        readingTime: readingTime,
        difficultyLevel: difficultyLevel,
        summary: summaryResult
      }
    });

  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Text analysis failed',
      error: error.message
    });
  }
});

// Get user's summarized materials
router.get('/my-summaries', async (req, res) => {
  try {
    const materials = await StudyMaterial.findAll({
      where: { 
        userId: req.user.id,
        summary: { [Op.ne]: null } // Only materials with summaries
      },
      attributes: ['id', 'title', 'subject', 'summary', 'keyPoints', 'readingTime', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      materials: materials,
      totalSummaries: materials.length
    });

  } catch (error) {
    console.error('Get summaries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summaries',
      error: error.message
    });
  }
});

// Background processing function
async function processAndSummarize(materialId, summaryType) {
  try {
    const material = await StudyMaterial.findByPk(materialId);
    if (!material) return;

    await material.update({ processingStatus: 'processing' });

    const filePath = path.join(__dirname, '../uploads/materials', material.filename);

    // Extract text from file
    const extractionResult = await TextExtractor.extractText(filePath, material.fileType);
    const cleanedText = TextExtractor.cleanText(extractionResult.text);
    const wordCount = TextExtractor.countWords(cleanedText);

    // Generate summary and analysis
    const summaryResult = SmartSummarizer.generateSummary(cleanedText, summaryType);
    const readingTime = SmartSummarizer.calculateReadingTime(wordCount);
    const difficultyLevel = SmartSummarizer.analyzeDifficulty(cleanedText);

    // Update material with processed data
    await material.update({
      content: extractionResult.text,
      extractedText: cleanedText,
      summary: summaryResult.summary,
      keyPoints: summaryResult.keyPoints,
      keyConcepts: summaryResult.keyConcepts,
      wordCount: wordCount,
      readingTime: readingTime,
      difficultyLevel: difficultyLevel,
      pageCount: extractionResult.metadata.pageCount || 0,
      processingStatus: 'completed',
      isProcessed: true,
      metadata: {
        ...extractionResult.metadata,
        summaryType: summaryType,
        processingTime: new Date().toISOString()
      }
    });

    console.log(`Successfully processed and summarized: ${material.title}`);

  } catch (error) {
    console.error('Processing error:', error);
    
    const material = await StudyMaterial.findByPk(materialId);
    if (material) {
      await material.update({
        processingStatus: 'failed',
        processingError: error.message
      });
    }
  }
}

module.exports = router;