import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Stack,
  Chip,
  Divider,
  Container,
  Paper,
  Alert,
  AlertTitle
} from '@mui/material';
import { CheckCircle, Cancel, BarChart, Home, ArrowForward, Refresh } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import axios from "axios"

const Quiz = ({ onNavigate }) => {
    const {topicname, topicId,subId} = useParams()
  // --- STATE ---
  const [view, setView] = useState('quiz'); // 'quiz', 'result', 'analytics'
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [userAnswers, setUserAnswers] = useState([]); 
  const [score, setScore] = useState(0);
  const [mockQuestions,setMockQuestions] = useState([]);

  const navigate = useNavigate()

  // --- HANDLERS ---
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  useEffect(()=>{
    const fetch = async() => {
      try {
        const response = await axios.get(`http://localhost:3000/api/topic/${subId}/${topicId}`)
        setMockQuestions(response.data.quiz)
      } catch (error) {
        console.error(error)        
      }
    };
    fetch()
  },[])

  
  const handleNext = () => {
    const currentQuestion = mockQuestions[currentQIndex];
    const isCorrect = selectedOption === currentQuestion.correct_answer;

    const newAnswerEntry = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      options: currentQuestion.options,
      selected: selectedOption,
      correct: currentQuestion.correct_answer,
      isCorrect: isCorrect
    };

    const updatedAnswers = [...userAnswers, newAnswerEntry];
    setUserAnswers(updatedAnswers);

    if (isCorrect) setScore((prev) => prev + 1);

    if (currentQIndex + 1 < mockQuestions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption('');
    } else {
      setView('result');
    }
  };

  const handleRetake = () => {
    setScore(0);
    setCurrentQIndex(0);
    setUserAnswers([]);
    setSelectedOption('');
    setView('quiz');
  };

  const gotoDashboard = async() => {
    try {
      await axios.post(`http://localhost:3000/api/topicCompleted/${subId}/${topicId}`,{
        correct_answers:score
      });
      navigate("/dashboard")
    } catch (error) {
      console.error(error)
    }
  }
  // --- RENDERERS ---

  // 1. RESULTS VIEW
  if (view === 'result') {
    const percentage = Math.round((score / mockQuestions.length) * 100);
    let feedbackColor = percentage >= 70 ? 'success.main' : percentage >= 40 ? 'warning.main' : 'error.main';
    let feedbackText = percentage >= 70 ? 'Excellent Work!' : percentage >= 40 ? 'Good Effort!' : 'Keep Practicing!';

    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0000ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Container maxWidth="xs"> {/* Result view kept slightly smaller */}
          <Card sx={{ p: 2, textAlign: 'center', boxShadow: 6, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary" letterSpacing={2}>
                RESULT
              </Typography>
              <Typography variant="h4" sx={{ color: feedbackColor, fontWeight: 'bold', mb: 1 }}>
                {percentage}%
              </Typography>
              <Typography variant="h6" gutterBottom>
                {feedbackText}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You scored {score} out of {mockQuestions.length}
              </Typography>

              <Stack spacing={1.5}>
                <Button 
                  variant="contained" 
                  size="medium"
                  startIcon={<BarChart />}
                  onClick={() => setView('analytics')}
                  sx={{ bgcolor: '#4A148C', '&:hover': { bgcolor: '#6A1B9A' } }}
                >
                  View Analytics
                </Button>
                
                <Stack direction="row" spacing={1.5} justifyContent="center">
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<Refresh />} 
                    onClick={handleRetake}
                  >
                    Retake
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    color="secondary" 
                    startIcon={<Home />} 
                    onClick={gotoDashboard}
                  >
                    Dashboard
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // 2. ANALYTICS VIEW
  if (view === 'analytics') {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f0f0', pt: 3, pb: 3, display: 'flex', justifyContent: 'center' }}>
        <Container maxWidth="md"> {/* Analytics view needs more width */}
          <Button onClick={() => setView('result')} sx={{ mb: 1.5 }}>
            &larr; Back to Score
          </Button>
          
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
            Quiz Analytics
          </Typography>

          <Stack spacing={2}>
            {userAnswers.map((item, index) => (
              <Paper 
                key={item.questionId} 
                elevation={3}
                sx={{ 
                  p: 2, 
                  borderLeft: 4, 
                  borderColor: item.isCorrect ? 'success.main' : 'error.main',
                  borderRadius: 2
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                  <Chip 
                    label={`Q${index + 1}`} 
                    size="small" 
                    color={item.isCorrect ? "success" : "error"} 
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {item.questionText}
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1.5 }}>
                  <Box flex={1} sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">YOUR ANSWER</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {item.isCorrect ? <CheckCircle color="success" fontSize="small"/> : <Cancel color="error" fontSize="small"/>}
                      <Typography 
                        color={item.isCorrect ? 'success.main' : 'error.main'} 
                        fontWeight="bold"
                        variant="body2"
                      >
                        {item.selected}
                      </Typography>
                    </Stack>
                  </Box>
                  
                  {!item.isCorrect && (
                    <Box flex={1} sx={{ p: 1, bgcolor: '#e8f5e9', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">CORRECT ANSWER</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CheckCircle color="success" fontSize="small"/>
                        <Typography color="success.main" fontWeight="bold" variant="body2">
                          {item.correct}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>
    );
  }

  // 3. QUIZ VIEW (Default) - Optimized for increased width
  const currentQ = mockQuestions[currentQIndex];
  const progress = ((currentQIndex + 1) / mockQuestions.length) * 100;

  return (
    // Outer Box maintains height and vertical centering
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#0000ff',
        pt: 3, 
        pb: 3, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' // Maintains vertical centering
      }}
    >
      {/* ✅ WIDTH INCREASED: Changed to maxWidth="sm" (approx 600px) 
        This is wider than the previous very narrow setting.
      */}
      <Container 
        maxWidth="sm" 
        sx={{ 
          p: 0 // Remove default Container padding
        }}
      > 
        {/* Header Area */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Chip 
            label={topicname} 
            variant="outlined" 
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              mb: 0.5, 
              fontWeight: 'bold'
            }} 
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
            {topicname}
          </Typography>
        </Box>

        {/* Quiz Card */}
        <Card sx={{ boxShadow: 8, borderRadius: 3, overflow: 'hidden', width: '100%' }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#4A148C' } }} 
          />
          
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="body1" color="text.secondary">
                Question {currentQIndex + 1} / {mockQuestions.length}
              </Typography>
            </Stack>

            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {currentQ?.question}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                <Stack spacing={1}>
                  {currentQ?.options.map((opt) => (
                    <FormControlLabel
                      key={opt}
                      value={opt}
                      control={<Radio sx={{ color: '#4A148C' }} />}
                      label={opt}
                      sx={{
                        m: 0,
                        p: 1.5,
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: selectedOption === opt ? '#4A148C' : '#f0f0f0',
                        backgroundColor: selectedOption === opt ? '#f3e5f5' : 'white',
                        '&:hover': { backgroundColor: '#f3e5f5' },
                        '& .MuiFormControlLabel-label': {
                           fontWeight: selectedOption === opt ? 'bold' : 'normal'
                        }
                      }}
                    />
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="medium"
                endIcon={<ArrowForward />}
                onClick={handleNext}
                disabled={!selectedOption}
                sx={{ 
                  px: 3, 
                  py: 1, 
                  borderRadius: 2, 
                  fontSize: '1rem',
                  bgcolor: '#4A148C',
                  '&:hover': { bgcolor: '#6A1B9A' }
                }}
              >
                {currentQIndex === mockQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Quiz;