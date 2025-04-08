import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import { ErrorProvider } from "./context/ErrorContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Add this import
import AppRoutes from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Chatbot from "./components/Chatbot";
import Box from "@mui/material/Box"; // Add this import
import "./styles/global.css"; // Import global styles
import { getTheme } from './theme/theme';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = getTheme(darkMode ? 'dark' : 'light');

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    localStorage.setItem('darkMode', !darkMode);
  };

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorProvider>
        <AuthProvider>
          <Router>
            <Box sx={{ 
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <Box sx={{ flex: 1 }}>
                <AnimatePresence mode="wait">
                  <AppRoutes />
                </AnimatePresence>
              </Box>
              <Chatbot />
              <Footer />
            </Box>
          </Router>
        </AuthProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
};

export default App;
