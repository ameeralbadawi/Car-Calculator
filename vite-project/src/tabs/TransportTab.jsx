import React from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';
import DatePickerField from '../shared/DatePickerField';
import MoneyField from '../shared/MoneyField';

const TransportTab = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    setFormData((prev) => ({ ...prev, phone: formattedInput }));
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
            value={formData.transporterName}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
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
            value={formData.pickupDate}
            onChange={(date) => setFormData((prev) => ({ ...prev, pickupDate: date }))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePickerField
            label="Delivery Date"
            value={formData.deliveryDate}
            onChange={(date) => setFormData((prev) => ({ ...prev, deliveryDate: date }))}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <MoneyField
            label="Cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Box sx={{ width: '100%', mt: 2 }}>
        <TextField
          label="Notes"
          name="transportNotes"
          value={formData.transportNotes}
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