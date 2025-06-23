import React from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';

const EstimateTab = ({ data }) => {
  // Helper function to display array values or fallback
  const displayArray = (arr, fallback = 'N/A') => {
    if (!arr || !Array.isArray(arr)) return fallback;
    return arr.filter(Boolean).join(', ') || fallback;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Estimate Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="MMR"
            fullWidth
            value={data.mmr || 'N/A'}
            InputProps={{ readOnly: true }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Estimated Profit"
            fullWidth
            value={data.profit || 'N/A'}
            InputProps={{ readOnly: true }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Transport"
            fullWidth
            value={data.transport || 'N/A'}
            InputProps={{ readOnly: true }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Repair"
            fullWidth
            value={data.repair || 'N/A'}
            InputProps={{ readOnly: true }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Fees"
            fullWidth
            value={data.fees || 'N/A'}
            InputProps={{ readOnly: true }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Max Bid"
            fullWidth
            value={data.maxBid || 'N/A'}
            InputProps={{ readOnly: true }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Carfax Status"
            fullWidth
            value={displayArray(data.carfaxStatuses, data.carfaxStatus || 'N/A')}
            InputProps={{ readOnly: true }}
            variant="outlined"
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Autocheck Status"
            fullWidth
            value={displayArray(data.autocheckStatuses, data.autocheckStatus || 'N/A')}
            InputProps={{ readOnly: true }}
            variant="outlined"
            multiline
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EstimateTab;