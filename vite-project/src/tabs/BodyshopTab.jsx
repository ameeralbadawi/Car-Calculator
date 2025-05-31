import React from 'react';
import { Box, Typography } from '@mui/material';
import PartsTable from '../shared/PartsTable';

const BodyshopTab = ({ formData, setFormData }) => {
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      bodyshopServices: [...(prev.bodyshopServices || []), { shop: '', service: '', amount: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.bodyshopServices.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      bodyshopServices: prev.bodyshopServices.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.bodyshopServices];
      updatedItems[index][field] = field === 'amount' ? Number(value) : value;
      return { ...prev, bodyshopServices: updatedItems };
    });
  };

  const handleNotesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Bodyshop Details
      </Typography>

      <PartsTable
        items={formData.bodyshopServices || [{ shop: '', service: '', amount: 0 }]}
        onAdd={handleAddItem}
        onRemove={handleRemoveItem}
        onChange={handleItemChange}
        columns={[
          { label: 'Shop', field: 'shop' },
          { label: 'Service', field: 'service' },
          { label: 'Amount', field: 'amount', type: 'number' },
        ]}
        itemName="Bodyshop"
        notesField="bodyshopNotes"
        notesValue={formData.bodyshopNotes}
        onNotesChange={handleNotesChange}
      />
    </Box>
  );
};

export default BodyshopTab;