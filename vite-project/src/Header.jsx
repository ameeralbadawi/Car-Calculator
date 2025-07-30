// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        color: '#333',
        borderBottom: '1px solid #e0e0e0',
        mb: 2,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          minHeight: '64px',
        }}
      >
        <Box>
            <Typography>Logo</Typography>
        </Box>
        <Box>
            <Typography> Login | Signup </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
