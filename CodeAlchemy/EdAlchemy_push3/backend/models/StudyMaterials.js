const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StudyMaterial = sequelize.define('StudyMaterial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  extractedText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Summarization fields
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  keyPoints: {
    type: DataTypes.JSON,
    allowNull: true
  },
  keyConcepts: {
    type: DataTypes.JSON,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON
  },
  subject: {
    type: DataTypes.STRING
  },
  // Analysis fields
  readingTime: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 0
  },
  difficultyLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'intermediate'
  },
  wordCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  pageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Processing status
  processingStatus: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  processingError: {
    type: DataTypes.TEXT
  },
  isProcessed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  metadata: {
    type: DataTypes.JSON
  }
}, {
  tableName: 'study_materials'
});

module.exports = StudyMaterial;