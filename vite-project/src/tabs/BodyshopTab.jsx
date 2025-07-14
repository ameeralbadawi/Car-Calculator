import React from 'react';
import { Box, Typography } from '@mui/material';
import PartsTable from '../shared/PartsTable';

const BodyshopTab = ({ data, onChange }) => {
  const handleAddItem = () => {
    onChange({
      ...data,
      bodyshopServices: [
        ...(data.bodyshopServices || []),
        { shop: '', service: '', amount: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    if ((data.bodyshopServices || []).length <= 1) return;
    const updatedItems = data.bodyshopServices.filter((_, i) => i !== index);
    onChange({ ...data, bodyshopServices: updatedItems });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...data.bodyshopServices];
    const updatedItem = {
      ...updatedItems[index],
      [field]: field === 'amount' ? Number(value) : value,
    };
    updatedItems[index] = updatedItem;
  
    onChange({ ...data, bodyshopServices: updatedItems });
  };
  

  const handleNotesChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Bodyshop Details
      </Typography>

      <PartsTable
        items={data.bodyshopServices || [{ shop: '', service: '', amount: 0 }]}
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
        notesValue={data.bodyshopNotes}
        onNotesChange={handleNotesChange}
      />
    </Box>
  );
};

export default BodyshopTab;
