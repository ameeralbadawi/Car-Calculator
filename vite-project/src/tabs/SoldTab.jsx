import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import DatePickerField from '../shared/DatePickerField';
import MoneyField from '../shared/MoneyField';

const SoldTab = ({ data, onChange, invoiceSummary = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleSaleTypeChange = (e) => {
    onChange({ ...data, saleType: e.target.value });
  };

  const handleDateChange = (date) => {
    onChange({ ...data, saleDate: date });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Sold Details
      </Typography>

      <RadioGroup
        value={data.saleType || ''}
        onChange={handleSaleTypeChange}
        row
        sx={{ mb: 2 }}
      >
        <FormControlLabel value="Retail" control={<Radio />} label="Retail" />
        <FormControlLabel value="Wholesale" control={<Radio />} label="Wholesale" />
      </RadioGroup>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <DatePickerField
            label="Sale Date"
            value={data.saleDate}
            onChange={handleDateChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <MoneyField
            label="Sale Amount"
            name="saleAmount"
            value={data.saleAmount}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <MoneyField
            label="Auction Fees"
            name="sellerFees"
            value={data.sellerFees}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" textAlign="right" sx={{ fontWeight: 'bold' }}>
            Profit: ${Number(invoiceSummary.grossProfit || 0).toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Sold To"
            name="soldTo"
            value={data.soldTo}
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
            value={data.salesmanName}
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
            value={data.commission}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" textAlign="right" sx={{ fontWeight: 'bold' }}>
            Net Profit: ${Number(invoiceSummary.netProfit || 0).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', mt: 2 }}>
        <TextField
          label="Notes"
          name="saleNotes"
          value={data.saleNotes || ''}
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
