import React from 'react';
import { Box, Typography } from '@mui/material';
import PartsTable from '../shared/PartsTable';

const MechanicTab = ({ data, onChange }) => {
  const handleAddItem = () => {
    onChange({
      ...data,
      mechanicServices: [
        ...(data.mechanicServices || []),
        { shop: '', service: '', amount: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    if ((data.mechanicServices || []).length <= 1) return;
    const updatedItems = data.mechanicServices.filter((_, i) => i !== index);
    onChange({ ...data, mechanicServices: updatedItems });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...data.mechanicServices];
    updatedItems[index][field] = field === 'amount' ? Number(value) : value;
    onChange({ ...data, mechanicServices: updatedItems });
  };

  const handleNotesChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Mechanic Details
      </Typography>

      <PartsTable
        items={data.mechanicServices || [{ shop: '', service: '', amount: 0 }]}
        onAdd={handleAddItem}
        onRemove={handleRemoveItem}
        onChange={handleItemChange}
        columns={[
          { label: 'Shop', field: 'shop' },
          { label: 'Service', field: 'service' },
          { label: 'Amount', field: 'amount', type: 'number' },
        ]}
        itemName="Mechanic"
        notesField="mechanicNotes"
        notesValue={data.mechanicNotes}
        onNotesChange={handleNotesChange}
      />
    </Box>
  );
};

export default MechanicTab;
