import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const EstimateTab = ({ formData }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>MMR:</strong> ${formData.mmr || '0'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Profit:</strong> ${formData.profit || '0'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Transport:</strong> ${formData.transport || '0'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Repair:</strong> ${formData.repair || '0'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Fees:</strong> ${formData.fees || '0'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Max Bid:</strong> ${formData.maxBid || '0'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Carfax Status:</strong> {formData.carfaxStatus || 'N/A'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EstimateTab;