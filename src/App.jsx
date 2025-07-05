import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import useAuth from './hooks/useAuth';
import AppRoutes from './routes/routes';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const loading = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress role="status" aria-label="Checking session" />
        <Typography ml={2}>Checking session...</Typography>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;