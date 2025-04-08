import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import { WbSunny, NightsStay } from '@mui/icons-material';
import { motion } from 'framer-motion';
import styles from '../styles/components/ThemeToggle.module.css';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <IconButton
        onClick={toggleDarkMode}
        className={styles.themeToggle}
        sx={{
          background: theme.palette.gradient.primary,
          '&:hover': {
            background: theme.palette.gradient.primary,
            transform: 'scale(1.1)',
          },
        }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: darkMode ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {darkMode ? (
            <WbSunny sx={{ color: '#fff' }} />
          ) : (
            <NightsStay sx={{ color: '#fff' }} />
          )}
        </motion.div>
      </IconButton>
    </motion.div>
  );
};

export default ThemeToggle;