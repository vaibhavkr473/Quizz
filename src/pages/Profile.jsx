import React, { useContext, useState } from "react";
import { Container, Typography, TextField, Button, Paper } from "@mui/material";
import AuthContext from "../context/AuthContext";
import styles from "../styles/pages/Profile.module.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [username, setUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Add API call to update profile
      console.log("Profile updated:", { email, phone, username });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <form>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
          <TextField
            label="Phone Number"
            type="tel"
            fullWidth
            margin="normal"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            label="Username"
            type="text"
            fullWidth
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;