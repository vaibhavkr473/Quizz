import React, { useState, useEffect } from "react";
import {  Container,  Typography,  Paper,  Button,  Radio,  RadioGroup,  FormControlLabel,  FormControl} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "../styles/pages/QuizPage.module.css";

// Dummy quiz data (replace with API call later)
const quizData = {
  id: "1",
  title: "Math Quiz - Grade 8",
  description: "Basic arithmetic and algebra questions.",
  questions: [
    {
      id: "1",
      questionText: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
    },
    {
      id: "2",
      questionText: "What is the square root of 16?",
      options: ["2", "4", "6", "8"],
      correctAnswer: "4",
    },
  ],
};

const QuizPage = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        setQuizData(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setQuizCompleted(true);
    }
  }, [timeLeft, quizCompleted]);

  if (!quizData) {
    return <Typography>Loading...</Typography>;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleAnswerChange = (e) => {
    const selected = e.target.value;
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selected;
    setAnswers(updatedAnswers);

    if (selected === currentQuestion.answer) {
      setFeedback("Correct! 🎉");
    } else {
      setFeedback(`Incorrect! 😢 The correct answer is: ${currentQuestion.answer}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post(`/quizzes/${quizData.id}/submit`, {
        quizId: quizData.id,
        answers: answers.map((answer, index) => ({
          questionId: quizData.questions[index].id,
          selectedAnswer: answer || null,
        })),
      });
      console.log("Quiz Results:", response.data);
      navigate(`/quiz/${quizData.id}/results`, { state: { results: response.data } });
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" gutterBottom>
          {quizData.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {quizData.description}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
        </Typography>

        {!quizCompleted ? (
          <>
            <Typography variant="h6" gutterBottom>
              Question {currentQuestionIndex + 1}: {currentQuestion.question}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup value={answers[currentQuestionIndex] || ""} onChange={handleAnswerChange}>
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            </FormControl>
            {feedback && (
              <Typography variant="body1" color={feedback.includes("Correct") ? "green" : "red"} gutterBottom>
                {feedback}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={currentQuestionIndex < quizData.questions.length - 1 ? handleNextQuestion : handleSubmit}
              disabled={!answers[currentQuestionIndex]}
            >
              {currentQuestionIndex < quizData.questions.length - 1 ? "Next" : "Submit"}
            </Button>
          </>
        ) : (
          <Typography variant="h5" align="center">
            Quiz Completed! Thank you for participating.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default QuizPage;
