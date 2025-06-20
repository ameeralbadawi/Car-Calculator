// AddCarButton.jsx
import React from 'react';
import { Button } from '@mui/material';

function AddCarButton({ handleOpen }) {
  return (
    <Button variant="contained" onClick={handleOpen} sx={{ mb: 2, backgroundColor: '#778899' }}>
      Add A Car
    </Button>
  );
}

export default AddCarButton;
