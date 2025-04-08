import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, ListItemIcon, ListItemText, Divider, Switch } from "@mui/material";
import { Person, Dashboard, Assessment, Leaderboard, Payment, Logout, DarkMode, LightMode, Quiz, ContactSupport, Info, Description as ResumeIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";
import styles from "../styles/components/Navbar.module.css";
import ThemeToggle from './ThemeToggle';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [reachOutAnchorEl, setReachOutAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate("/auth");
  };

  const handleOpenUserMenu = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null);
  };

  const handleOpenReachOut = (event) => {
    setReachOutAnchorEl(event.currentTarget);
  };

  const handleCloseReachOut = () => {
    setReachOutAnchorEl(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar position="static" className={styles.navbar}>
        <Toolbar>
          {/* Logo/Brand */}
          <Typography variant="h6" className={styles.brand}>
            <Link to="/" className={styles.link}>
              QuizMaster
            </Link>
          </Typography>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right Side Items */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Quizzes Button */}
            <Button
              color="inherit"
              component={Link}
              to="/quizzes"
              startIcon={<Quiz />}
              className={styles.navButton}
            >
              Quizzes
            </Button>

            {/* Reach Out Dropdown */}
            <Button
              color="inherit"
              onClick={handleOpenReachOut}
              startIcon={<ContactSupport />}
              className={styles.navButton}
            >
              Reach Out to Us
            </Button>
            <Menu
              anchorEl={reachOutAnchorEl}
              open={Boolean(reachOutAnchorEl)}
              onClose={handleCloseReachOut}
            >
              <MenuItem 
                component={Link} 
                to="/about-us"
                onClick={handleCloseReachOut}
              >
                <ListItemIcon>
                  <Info fontSize="small" />
                </ListItemIcon>
                <ListItemText>About Us</ListItemText>
              </MenuItem>
              <MenuItem 
                component={Link} 
                to="/contact-us"
                onClick={handleCloseReachOut}
              >
                <ListItemIcon>
                  <ContactSupport fontSize="small" />
                </ListItemIcon>
                <ListItemText>Contact Us</ListItemText>
              </MenuItem>
            </Menu>

            {user && (
              <>
                {/* User Menu */}
                <Button
                  color="inherit"
                  onClick={handleOpenUserMenu}
                  startIcon={<Person />}
                  className={styles.userButton}
                >
                  {user.username}
                </Button>
                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleCloseUserMenu}
                  className={styles.userMenu}
                >
                  <MenuItem 
                    component={Link} 
                    to="/profile"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/dashboard"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Dashboard fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/results"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Assessment fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Results</ListItemText>
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/leaderboard"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Leaderboard fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Leaderboard</ListItemText>
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/payment"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <Payment fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Payment</ListItemText>
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/resume-builder"
                    onClick={handleCloseUserMenu}
                  >
                    <ListItemIcon>
                      <ResumeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Resume Builder</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}

            {/* Theme Toggle */}
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            {/* Login Button (for non-authenticated users) */}
            {!user && (
              <Button
                color="inherit"
                component={Link}
                to="/auth"
                className={styles.loginButton}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;
