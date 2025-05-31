import React from 'react';
import { Box, Typography } from '@mui/material';
import PartsTable from '../shared/PartsTable';

const DetailTab = ({ formData, setFormData }) => {
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      detailServices: [...(prev.detailServices || []), { name: '', service: '', amount: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.detailServices.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      detailServices: prev.detailServices.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.detailServices];
      updatedItems[index][field] = field === 'amount' ? Number(value) : value;
      return { ...prev, detailServices: updatedItems };
    });
  };

  const handleNotesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Miscellanious Details
      </Typography>

      <PartsTable
        items={formData.detailServices || [{ name: '', service: '', amount: 0 }]}
        onAdd={handleAddItem}
        onRemove={handleRemoveItem}
        onChange={handleItemChange}
        columns={[
          { label: 'Name', field: 'name' },
          { label: 'Service', field: 'service' },
          { label: 'Amount', field: 'amount', type: 'number' },
        ]}
        itemName="Miscellanious"
        notesField="miscNotes"
        notesValue={formData.miscNotes}
        onNotesChange={handleNotesChange}
      />
    </Box>
  );
};

export default DetailTab;