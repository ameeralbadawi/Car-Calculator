import React from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';
import DatePickerField from '../shared/DatePickerField';
import MoneyField from '../shared/MoneyField';

const TransportTab = ({ data, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, '');
    let formattedInput = '';

    if (input.length > 0) {
      formattedInput = `(${input.substring(0, 3)}`;
    }
    if (input.length > 3) {
      formattedInput += `) - ${input.substring(3, 6)}`;
    }
    if (input.length > 6) {
      formattedInput += ` - ${input.substring(6, 10)}`;
    }

    onChange({ ...data, transporterPhone: formattedInput });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Transport Details
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Transporter Name"
            name="transporterName"
            value={data.transporterName}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            name="transporterPhone"
            value={data.transporterPhone}
            onChange={handlePhoneChange}
            fullWidth
            variant="standard"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <DatePickerField
            label="Pickup Date"
            value={data.pickupDate}
            onChange={(date) => onChange({ ...data, pickupDate: date })}
            PopperProps={{
              sx: {
                zIndex: 9999, // Ensure it appears above modal
                '& .MuiPaper-root': {
                  boxShadow: 3,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePickerField
            label="Delivery Date"
            value={data.deliveryDate}
            onChange={(date) => onChange({ ...data, deliveryDate: date })}
            PopperProps={{
              sx: {
                zIndex: 9999, // Ensure it appears above modal
                '& .MuiPaper-root': {
                  boxShadow: 3,
                },
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <MoneyField
            label="Cost"
            name="cost"
            value={data.cost}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', mt: 2 }}>
        <TextField
          label="Notes"
          name="transporterNotes"
          value={data.transporterNotes}
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

export default TransportTab;