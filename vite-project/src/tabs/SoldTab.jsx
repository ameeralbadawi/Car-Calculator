import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from '@mui/material';
import DatePickerField from '../shared/DatePickerField';
import MoneyField from '../shared/MoneyField';

const SoldTab = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaleTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, saleType: e.target.value }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Sold Details
      </Typography>
      <RadioGroup
        value={formData.saleType || ''}
        onChange={handleSaleTypeChange}
        row
        sx={{ mb: 2 }}
      >
        <FormControlLabel value="retail" control={<Radio />} label="Retail" />
        <FormControlLabel value="wholesale" control={<Radio />} label="Wholesale" />
      </RadioGroup>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <DatePickerField
            label="Sale Date"
            value={formData.saleDate}
            onChange={(date) => setFormData((prev) => ({ ...prev, saleDate: date }))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MoneyField
            label="Sale Amount"
            name="saleAmount"
            value={formData.saleAmount}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MoneyField
            label="Fees"
            name="sellerFees"
            value={formData.sellerFees}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" textAlign="right" sx={{ fontWeight: 'bold' }}>
            Profit: ${(
              (parseFloat(formData.saleAmount || 0) - 
              parseFloat(formData.sellerFees || 0) - 
              parseFloat(formData.amountPaid || 0))
              .toFixed(2)
            )}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Sold To"
            name="soldTo"
            value={formData.soldTo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Salesman Name"
            name="salesmanName"
            value={formData.salesmanName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MoneyField
            label="Commission"
            name="commission"
            value={formData.commission}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" textAlign="right" sx={{ fontWeight: 'bold' }}>
            Net Profit: ${(
              (parseFloat(formData.saleAmount || 0) - 
              parseFloat(formData.sellerFees || 0) - 
              parseFloat(formData.amountPaid || 0) - 
              parseFloat(formData.commission || 0)
              .toFixed(2)
            ))}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ width: '100%', mt: 2 }}>
        <TextField
          label="Notes"
          name="saleNotes"
          value={formData.saleNotes || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
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

export default SoldTab;