import React from 'react'
import { CircularProgress, Stack } from '@mui/material'
const Loader = () => {
  return (
    <Stack sx={{
      minHeight: '50vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }} >
      <CircularProgress
        size={40}
        sx={{
          color: '#1976d2',
          margin: 'auto',
          display: 'block',
        }}
      />
    </Stack>
  )
}

export default Loader