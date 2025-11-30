const express = require('express');
const router = express.Router();

// Simple in-memory storage for testing
let quizzes = [];
let questions = [];

// Test route - check if quiz API is working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Quiz API is working!',
    timestamp: new Date().toISOString()
  });
});

// Generate a simple quiz
router.post('/generate-simple', (req, res) => {
  try {
    const { numQuestions = 5, topic = 'general' } = req.body;

    // Simple quiz questions
    const sampleQuestions = [
      {
        id: 1,
        questionText: "What is the capital of France?",
        questionType: "mcq",
        options: {
          a: "London",
          b: "Paris", 
          c: "Berlin",
          d: "Madrid"
        },
        correctAnswer: "b",
        explanation: "Paris is the capital city of France.",
        difficulty: "easy",
        points: 1
      },
      {
        id: 2,
        questionText: "JavaScript is a programming language primarily used for:",
        questionType: "mcq",
        options: {
          a: "Backend development only",
          b: "Mobile app development",
          c: "Web development", 
          d: "Data analysis"
        },
        correctAnswer: "c",
        explanation: "JavaScript is mainly used for web development.",
        difficulty: "easy",
        points: 1
      },
      {
        id: 3,
        questionText: "True or False: HTML is a programming language.",
        questionType: "true_false", 
        options: {
          a: "True",
          b: "False"
        },
        correctAnswer: "b",
        explanation: "HTML is a markup language, not a programming language.",
        difficulty: "medium",
        points: 2
      },
      {
        id: 4,
        questionText: "The process of finding and fixing errors in code is called __________.",
        questionType: "fill_blank",
        correctAnswer: "debugging",
        explanation: "Debugging is the process of finding and resolving defects.",
        difficulty: "easy",
        points: 1
      },
      {
        id: 5,
        questionText: "Which data structure uses LIFO (Last In First Out) principle?",
        questionType: "mcq",
        options: {
          a: "Queue",
          b: "Array", 
          c: "Stack",
          d: "Linked List"
        },
        correctAnswer: "c",
        explanation: "Stack uses LIFO principle.",
        difficulty: "medium",
        points: 2
      }
    ];

    const selectedQuestions = sampleQuestions.slice(0, numQuestions);

    // Create quiz object
    const quiz = {
      id: quizzes.length + 1,
      title: `Sample Quiz - ${topic}`,
      description: `A ${numQuestions}-question quiz about ${topic}`,
      questions: selectedQuestions,
      totalQuestions: numQuestions,
      createdAt: new Date().toISOString()
    };

    quizzes.push(quiz);

    res.json({
      success: true,
      message: 'Quiz generated successfully!',
      quiz: quiz
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quiz',
      error: error.message
    });
  }
});

// Submit quiz answers
router.post('/submit-simple', (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let score = 0;
    let maxScore = 0;

    quiz.questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      
      if (userAnswer && userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
        score += question.points;
      }
    });

    const percentage = Math.round((score / maxScore) * 100);

    res.json({
      success: true,
      message: 'Quiz submitted successfully!',
      results: {
        score: score,
        maxScore: maxScore,
        percentage: percentage,
        correctAnswers: score,
        totalQuestions: quiz.questions.length
      },
      quiz: quiz,
      userAnswers: answers
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
});

// Get all quizzes
router.get('/list', (req, res) => {
  res.json({
    success: true,
    quizzes: quizzes
  });
});

module.exports = router;