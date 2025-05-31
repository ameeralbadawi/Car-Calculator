import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const InvoiceTab = ({ formData }) => {
  // Calculate totals
  const partsTotal = formData.parts?.reduce((sum, part) => sum + (Number(part.amount) || 0, 0) || 0);
  const mechanicTotal = formData.mechanicServices?.reduce((sum, service) => sum + (Number(service.amount) || 0, 0) || 0);
  const bodyshopTotal = formData.bodyshopServices?.reduce((sum, service) => sum + (Number(service.amount) || 0), 0) || 0;
  const detailTotal = formData.detailServices?.reduce((sum, service) => sum + (Number(service.amount) || 0), 0) || 0;
  
  const totalExpenses = partsTotal + mechanicTotal + bodyshopTotal + detailTotal;
  const netProfit = (parseFloat(formData.saleAmount || 0) - parseFloat(formData.amountPaid || 0) - totalExpenses);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Invoice Summary
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Purchase Price:</strong> ${formData.amountPaid || '0.00'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Sale Price:</strong> ${formData.saleAmount || '0.00'}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        Expenses:
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Parts:</strong> ${partsTotal.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Mechanic:</strong> ${mechanicTotal.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Bodyshop:</strong> ${bodyshopTotal.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Detail/Misc:</strong> ${detailTotal.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
        <strong>Total Expenses:</strong> ${totalExpenses.toFixed(2)}
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
        Net Profit: ${netProfit.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default InvoiceTab;