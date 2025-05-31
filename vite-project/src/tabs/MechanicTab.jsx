import React from 'react';
import { Box, Typography } from '@mui/material';
import PartsTable from '../shared/PartsTable';

const MechanicTab = ({ formData, setFormData }) => {
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      mechanicServices: [...(prev.mechanicServices || []), { shop: '', service: '', amount: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.mechanicServices.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      mechanicServices: prev.mechanicServices.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.mechanicServices];
      updatedItems[index][field] = field === 'amount' ? Number(value) : value;
      return { ...prev, mechanicServices: updatedItems };
    });
  };

  const handleNotesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Mechanic Details
      </Typography>

      <PartsTable
        items={formData.mechanicServices || [{ shop: '', service: '', amount: 0 }]}
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
        notesValue={formData.mechanicNotes}
        onNotesChange={handleNotesChange}
      />
    </Box>
  );
};

export default MechanicTab;