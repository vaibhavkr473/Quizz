import React, { useEffect, useState } from "react";
import { 
  Container, Typography, Paper, List, ListItem, ListItemText, 
  Button, Box, Tooltip, useTheme 
} from "@mui/material";
import { PlayArrow, Assessment } from '@mui/icons-material';
import { Link } from "react-router-dom";
import api from "../services/api";
import styles from "../styles/pages/QuizList.module.css";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [userResults, setUserResults] = useState({});
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesResponse, resultsResponse] = await Promise.all([
          api.get("/quizzes"),
          api.get("/results")
        ]);
        
        setQuizzes(quizzesResponse.data);
        
        // Create a map of quizId to result
        const resultsMap = resultsResponse.data.reduce((acc, result) => {
          acc[result.quizId] = result;
          return acc;
        }, {});
        setUserResults(resultsMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" gutterBottom align="center">
          Available Quizzes
        </Typography>
        <List>
          {quizzes.map((quiz) => (
            <ListItem key={quiz.id} className={styles.listItem}>
              <ListItemText 
                primary={quiz.title} 
                secondary={quiz.description}
              />
              <Box className={styles.buttonGroup}>
                <Tooltip title="Start Quiz">
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/quiz/${quiz.id}`}
                    startIcon={<PlayArrow />}
                    className={styles.actionButton}
                  >
                    Start Quiz
                  </Button>
                </Tooltip>
                {userResults[quiz.id] && (
                  <Tooltip title="View Results">
                    <Button
                      variant="outlined"
                      color="secondary"
                      component={Link}
                      to={`/results/${quiz.id}`}
                      startIcon={<Assessment />}
                      className={styles.actionButton}
                    >
                      See Results
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default QuizList;