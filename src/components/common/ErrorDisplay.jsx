import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { MdErrorOutline } from "react-icons/md";

const ErrorDisplay = ({
  title = "Oops! Something went wrong.",
  message = "We're having trouble loading this content. Please try again.",
  onRetry,
  showRetry = false,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      p={4}
      borderRadius={2}
      bgcolor="#fff3f3"
      border="1px solid #f5c6cb"
      boxShadow={1}
      width="100%"
      maxWidth="500px"
      mx="auto"
      my={4}
    >
      <MdErrorOutline size={50} />
      <Typography variant="h6" color="error" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        {message}
      </Typography>
      {showRetry && onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default ErrorDisplay;
