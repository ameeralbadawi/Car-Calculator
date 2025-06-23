import React from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';
import DatePickerField from '../shared/DatePickerField';
import MoneyField from '../shared/MoneyField';

const PurchasedTab = ({ data, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleDateChange = (date) => {
    onChange({ ...data, purchaseDate: date });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Purchase Details
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <DatePickerField
            label="Purchase Date"
            value={data.purchaseDate}
            onChange={handleDateChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Purchase From"
            name="purchaseFrom"
            value={data.purchaseFrom}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Purchase Location"
            name="purchaseLocation"
            value={data.purchaseLocation}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Color"
            name="color"
            value={data.color}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Stock #"
            name="stockNumber"
            value={data.stockNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MoneyField
            label="Winning Bid"
            name="winningBid"
            value={data.winningBid}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MoneyField
            label="Amount Paid"
            name="amountPaid"
            value={data.amountPaid}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Buyer Name"
            name="buyerName"
            value={data.buyerName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Mileage"
            name="mileage"
            value={data.mileage}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
          />
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', mt: 2 }}>
        <TextField
          label="Notes"
          name="purchaseNotes"
          value={data.purchaseNotes}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={6}
          sx={{
            '& .MuiOutlinedInput-root': {
              padding: 1,
              alignItems: 'flex-start',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PurchasedTab;
