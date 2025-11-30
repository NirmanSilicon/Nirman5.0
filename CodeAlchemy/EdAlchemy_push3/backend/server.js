const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/database');

const app = express();

// Connect to SQLite database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the correct path
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
// Add this to your routes section in server.js
app.use('/api/summarizer', require('./routes/summarizer'));
// Add this to your routes section
app.use('/api/summarizer', require('./routes/summarizer'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quiz', require('./routes/quiz')); // Quiz routes added

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'EdAlchemy API is running!',
    timestamp: new Date().toISOString()
  });
});

// Test quiz route
app.get('/api/test-quiz', (req, res) => {
  res.json({
    success: true,
    message: 'Quiz endpoint is accessible!',
    data: {
      availableEndpoints: [
        'GET /api/quiz/test',
        'POST /api/quiz/generate-simple', 
        'POST /api/quiz/submit-simple',
        'GET /api/quiz/list'
      ]
    }
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 EdAlchemy Server Started!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`✅ Health: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Quiz Test: http://localhost:${PORT}/api/test-quiz`);
  console.log('💾 Database: SQLite (database.sqlite)');
  console.log(`📁 Frontend path: ${frontendPath}`);
});