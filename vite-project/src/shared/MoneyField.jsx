import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const MoneyField = ({ label, name, value, onChange, ...props }) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
      variant="standard"
      type="number"
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
      {...props}
    />
  );
};

export default MoneyField;