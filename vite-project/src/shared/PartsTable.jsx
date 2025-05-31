import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const PartsTable = ({ 
  items, 
  onAdd, 
  onRemove, 
  onChange, 
  columns,
  itemName = 'parts',
  notesField,
  notesValue,
  onNotesChange
}) => {
  return (
    <>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field}>{col.label}</TableCell>
              ))}
              <TableCell align="right">
                <IconButton onClick={onAdd} color="primary">
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={`${index}-${col.field}`}>
                    <TextField
                      value={item[col.field] || ''}
                      onChange={(e) => onChange(index, col.field, e.target.value)}
                      variant="standard"
                      fullWidth
                      type={col.type || 'text'}
                      InputProps={col.type === 'number' ? {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      } : undefined}
                    />
                  </TableCell>
                ))}
                <TableCell align="right">
                  <IconButton
                    onClick={() => onRemove(index)}
                    color="error"
                    disabled={items.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="subtitle1" textAlign="right" sx={{ fontWeight: 'bold' }}>
        {`${itemName} Total: $${items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toFixed(2)}`}
      </Typography>
      {notesField && (
        <TextField
          label="Notes"
          name={notesField}
          value={notesValue || ''}
          onChange={onNotesChange}
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
      )}
    </>
  );
};

export default PartsTable;