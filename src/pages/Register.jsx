import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useSignupMutation } from "../redux/services/auth/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/authSlice";

const Register = () => {
  const [error, setError] = useState(null);
  const [signup, { isLoading }] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    document.title = "Sign Up - Threads";
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await signup(formData).unwrap();
      const { accessToken, user } = response;
      dispatch(setCredentials({ user, accessToken }));
      navigate("/");
    } catch (err) {
      const msg = err?.data?.message || "Failed to register. Please try again.";
      setError(msg);
    } finally {
      setFormData({
        username: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundColor: theme.palette.background.default,
        backgroundImage: `url(https://static.cdninstagram.com/rsrc.php/ym/r/gf40BP6SRYU.avif)`,
        backgroundSize: "auto",
        backgroundPosition: "center -150px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="subtitle2" align="center" fontWeight={700} gutterBottom>
          Create your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          autoFocus
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 1,
            mb: 1,
            borderRadius: 1,
            py: 1.7,
            backgroundColor: "black",
            ":hover": {
              backgroundColor: "#222",
            },
            color: "white",
            fontWeight: 600,
            textTransform: "none",
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: theme.palette.primary.main }}>
            Log in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
