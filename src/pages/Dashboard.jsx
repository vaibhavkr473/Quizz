import React, {useContext} from "react";
import { Container, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import AuthContext from "../context/AuthContext";
import Chatbot from "../components/Chatbot"; // Import Chatbot
import styles from "../styles/pages/Dashboard.module.css";

// Dummy data for charts and tables
const quizData = [
  { subject: "Math", score: 85 },
  { subject: "Science", score: 72 },
  { subject: "History", score: 90 },
];

const leaderboardData = [
  { rank: 1, name: "Alice", score: 95 },
  { rank: 2, name: "Bob", score: 90 },
  { rank: 3, name: "Charlie", score: 85 },
];

const recentQuizzes = [
  { id: 1, title: "Math Quiz - Grade 8", score: 85, date: "2023-10-01" },
  { id: 2, title: "Science Quiz - Grade 10", score: 72, date: "2023-10-05" },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || "User"}!
      </Typography>

      {/* Badges and Coins Section */}
      <Paper elevation={3} className={styles.section}>
        <Typography variant="h6" gutterBottom>
          Your Achievements
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Coins:</strong> {user?.coins}
            </Typography>
            <Typography variant="body1">
              <strong>Quiz Streak:</strong> {user?.quizStreaks} days
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" gutterBottom>
              <strong>Badges:</strong>
            </Typography>
            <div>
              {user?.badges?.map((badge, index) => (
                <Chip
                  key={index}
                  avatar={<Avatar>{badge[0]}</Avatar>}
                  label={badge}
                  variant="outlined"
                  style={{ margin: "4px" }}
                />
              ))}
            </div>
          </Grid>
        </Grid>
      </Paper>

      {/* Quiz Performance Chart */}
      <Paper elevation={3} className={styles.chartContainer}>
        <Typography variant="h6" gutterBottom>
          Quiz Performance
        </Typography>
        <BarChart width={500} height={300} data={quizData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#1976d2" />
        </BarChart>
      </Paper>

      {/* Recent Quiz Results */}
      <Grid container spacing={3} className={styles.gridContainer}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className={styles.paper}>
            <Typography variant="h6" gutterBottom>
              Recent Quiz Results
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Quiz Title</TableCell>
                    <TableCell align="right">Score</TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentQuizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>{quiz.title}</TableCell>
                      <TableCell align="right">{quiz.score}</TableCell>
                      <TableCell align="right">{quiz.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Leaderboard */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className={styles.paper}>
            <Typography variant="h6" gutterBottom>
              Leaderboard
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboardData.map((row) => (
                    <TableRow key={row.rank}>
                      <TableCell>{row.rank}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">{row.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

      </Grid>
      {/* Chatbot */}
      <Paper elevation={3} className={styles.section}>
        <Chatbot />
      </Paper>
    </Container>
  );
};

export default Dashboard;
