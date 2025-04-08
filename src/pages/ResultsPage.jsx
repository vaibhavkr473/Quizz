import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Container, Typography, Paper, Box, Button, Grid, Table, TableBody, Chip, TableCell, TableContainer, TableHead, TableRow, CircularProgress, useTheme, Tooltip
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { 
  Download, Share, VolumeUp, Print, CheckCircle, Cancel, Info 
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import api from "../services/api";
import styles from "../styles/pages/ResultsPage.module.css";

const ResultsPage = () => {
  const location = useLocation();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [results, setResults] = useState(location.state?.results || null);
  const [loading, setLoading] = useState(!location.state?.results);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/results/${quizId}`);
        setResults(response.data);
      } catch (error) {
        setError("Failed to load results");
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!results && quizId) {
      fetchResults();
    }
  }, [quizId, results]);

  if (loading) {
    return (
      <Box className={styles.loader}>
        <CircularProgress />
        <Typography>Loading results...</Typography>
      </Box>
    );
  }

  if (error || !results) {
    return (
      <Container maxWidth="md" className={styles.errorContainer}>
        <Paper elevation={3} className={styles.errorPaper}>
          <Typography variant="h6" align="center" color="error">
            {error || "No results available"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/quizzes")}
          >
            Back to Quizzes
          </Button>
        </Paper>
      </Container>
    );
  }

  // Chart data preparation
  const performanceData = [
    { name: "Correct", value: results.correctAnswers },
    { name: "Incorrect", value: results.totalQuestions - results.correctAnswers }
  ];

  const CHART_COLORS = {
    correct: theme.palette.success.main,
    incorrect: theme.palette.error.main
  };

  // PDF generation
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text("Quiz Results Summary", 20, 20);
    
    // Add score
    doc.setFontSize(14);
    doc.text(`Score: ${results.score}/${results.totalQuestions}`, 20, 40);
    
    // Add questions and answers
    doc.setFontSize(12);
    results.feedback.forEach((item, index) => {
      const yPos = 60 + (index * 30);
      doc.text(`Q${index + 1}: ${item.questionText}`, 20, yPos);
      doc.text(`Your Answer: ${item.selectedAnswer}`, 30, yPos + 10);
      doc.text(`Correct: ${item.isCorrect ? "Yes" : "No"}`, 30, yPos + 20);
    });
    
    doc.save(`quiz-results-${quizId}.pdf`);
  };

  return (
    <AnimatePresence>
      <Container maxWidth="lg" className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} className={styles.paper}>
            <Typography variant="h4" gutterBottom align="center">
              Quiz Results
            </Typography>

            {/* Score Summary */}
            <Box className={styles.scoreSection}>
              <Typography variant="h5" gutterBottom>
                Score: {results.score}/{results.totalQuestions}
              </Typography>
              <Typography variant="subtitle1">
                Percentage: {((results.score / results.totalQuestions) * 100).toFixed(2)}%
              </Typography>
            </Box>

            {/* Performance Charts */}
            <Grid container spacing={4} className={styles.chartsContainer}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} className={styles.chartPaper}>
                  <Typography variant="h6" gutterBottom align="center">
                    Performance Breakdown
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Bar dataKey="value" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={2} className={styles.chartPaper}>
                  <Typography variant="h6" gutterBottom align="center">
                    Score Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={performanceData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {performanceData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={index === 0 ? CHART_COLORS.correct : CHART_COLORS.incorrect}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Detailed Results Table */}
            <TableContainer component={Paper} className={styles.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Your Answer</TableCell>
                    <TableCell>Correct Answer</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.feedback.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.questionText}</TableCell>
                      <TableCell>{item.selectedAnswer}</TableCell>
                      <TableCell>{item.correctAnswer}</TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={item.isCorrect ? <CheckCircle /> : <Cancel />}
                          label={item.isCorrect ? "Correct" : "Incorrect"}
                          color={item.isCorrect ? "success" : "error"}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Action Buttons */}
            <Box className={styles.actionButtons}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Download />}
                onClick={generatePDF}
              >
                Download PDF
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Print />}
                onClick={() => window.print()}
              >
                Print
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={() => navigator.share({
                  title: 'Quiz Results',
                  text: `I scored ${results.score}/${results.totalQuestions} in the quiz!`
                })}
              >
                Share
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </AnimatePresence>
  );
};

export default ResultsPage;
