import React from 'react';
import { TextField, Button, Popper } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DatePickerField = ({ label, value, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TextField
        label={label}
        value={value ? value.toLocaleDateString() : ''}
        fullWidth
        margin="normal"
        variant="standard"
        InputProps={{
          readOnly: true,
          endAdornment: (
            <Button 
              variant="standard" 
              sx={{ minWidth: 0, padding: 0 }}
              onClick={handleClick}
            >
              <CalendarTodayIcon />
            </Button>
          ),
        }}
      />
      
      <Popper 
        open={open} 
        anchorEl={anchorEl} 
        placement="bottom-start"
        style={{ zIndex: 9999 }}  // Ensure it appears above modal
      >
        <DatePicker
          selected={value}
          onChange={(date) => {
            onChange(date);
            handleClose();
          }}
          onCalendarClose={handleClose}
          inline
          dateFormat="MM/dd/yyyy"
        />
      </Popper>
    </>
  );
};

export default DatePickerField;