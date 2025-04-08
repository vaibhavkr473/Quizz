import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import api from "../services/api";
import styles from "../styles/pages/Leaderboard.module.css";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch leaderboard data from the backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("/leaderboard");
        setLeaderboardData(response.data);
        setFilteredData(response.data);
        setTopPerformers(response.data.slice(0, 3)); // Top 3 performers
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setError("Failed to load leaderboard data.");
      }
    };
    fetchLeaderboard();
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = leaderboardData.filter((entry) =>
      entry.name.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  // Bar chart data for top performers
  const chartData = topPerformers.map((performer) => ({
    name: performer.name,
    score: performer.score,
  }));

  return (
    <div>
      {error ? (
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      ) : (
        <Container maxWidth="lg" className={styles.container}>
          <Paper elevation={3} className={styles.paper}>
            <Typography variant="h4" gutterBottom align="center">
              Leaderboard
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              Explore the top performers and search for your rank!
            </Typography>

            {/* Search Bar */}
            <TextField
              label="Search by Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for a participant..."
            />

            {/* Top Performers Chart */}
            <Typography variant="h6" gutterBottom>
              Top Performers
            </Typography>
            <BarChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#1976d2" />
            </BarChart>

            {/* Leaderboard Table */}
            <Typography variant="h6" gutterBottom>
              Full Leaderboard
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
                  {filteredData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">{row.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Download Leaderboard Button */}
            <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => console.log("Download leaderboard as PDF")}
              >
                Download Leaderboard (PDF)
              </Button>
            </Grid>
          </Paper>
        </Container>
      )}
    </div>
  );
};

export default Leaderboard;