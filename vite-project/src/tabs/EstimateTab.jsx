import React from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';

const EstimateTab = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="MMR"
            fullWidth
            value={data.mmr || ''}
            onChange={(e) => handleChange('mmr', e.target.value)}
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Estimated Profit"
            fullWidth
            value={data.profit || ''}
            onChange={(e) => handleChange('profit', e.target.value)}
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Transport"
            fullWidth
            value={data.transport || ''}
            onChange={(e) => handleChange('transport', e.target.value)}
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Repair"
            fullWidth
            value={data.repair || ''}
            onChange={(e) => handleChange('repair', e.target.value)}
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Fees"
            fullWidth
            value={data.fees || ''}
            onChange={(e) => handleChange('fees', e.target.value)}
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Max Bid"
            fullWidth
            value={data.maxBid || ''}
            onChange={(e) => handleChange('maxBid', e.target.value)}
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Carfax Status"
            fullWidth
            value={data.carfaxStatus || ''}
            onChange={(e) => handleChange('carfaxStatus', e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Autocheck Status"
            fullWidth
            value={data.autocheckStatus || ''}
            onChange={(e) => handleChange('autocheckStatus', e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EstimateTab;
