import React from 'react';
import { TextField, Button } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DatePickerField = ({ label, value, onChange }) => {
  return (
    <TextField
      label={label}
      value={value ? value.toLocaleDateString() : ''}
      fullWidth
      margin="normal"
      variant="standard"
      InputProps={{
        readOnly: true,
        endAdornment: (
          <DatePicker
            selected={value}
            onChange={onChange}
            dateFormat="MM/dd/yyyy"
            customInput={
              <Button variant="standard" sx={{ minWidth: 0, padding: 0 }}>
                <CalendarTodayIcon />
              </Button>
            }
          />
        ),
      }}
    />
  );
};

export default DatePickerField;