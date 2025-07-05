import { CircularProgress, Stack } from '@mui/material';

const TransparentLoader = () => {
  return (
    <Stack
      sx={{
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0, 0, 0, 0.7)', 
        zIndex: 9999, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress
        size={40}
        sx={{
          color: 'white',
        }}
      />
    </Stack>
  );
};

export default TransparentLoader;
