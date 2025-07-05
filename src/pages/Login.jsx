import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useLoginMutation } from "../redux/services/auth/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/authSlice";

import bg from '../assets/9551821.jpg'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials(userData));
      navigate("/");
    } catch (err) {
      setError(err?.data?.message || "Login failed. Please try again.");
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  useEffect(() => {
    document.title = "Login - Threads";
  }, []);

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
        onSubmit={handleLogin}
        noValidate
        sx={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
          align="center"
          gutterBottom
          sx={{ mb: 1 }}
        >
          Log in to Threads
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Username or Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          autoFocus
          margin="normal"
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
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
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Log in"}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: theme.palette.primary.main }}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
