import React from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/pages/LeaderboardPage.module.css";

// Dummy leaderboard data
const leaderboardData = [
  { rank: 1, name: "Alice", score: 95 },
  { rank: 2, name: "Bob", score: 90 },
  { rank: 3, name: "Charlie", score: 85 },
];

const LeaderboardPage = () => {
  return (
    <div>
      <Navbar />
      <Container maxWidth="md" className={styles.container}>
        <Paper elevation={3} className={styles.paper}>
          <Typography variant="h4" gutterBottom>
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
      </Container>
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
