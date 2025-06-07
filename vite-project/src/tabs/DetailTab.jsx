import React from 'react';
import { Box, Typography } from '@mui/material';
import PartsTable from '../shared/PartsTable';

const DetailTab = ({ data, onChange }) => {
  const handleAddItem = () => {
    onChange({
      ...data,
      miscServices: [
        ...(data.miscServices || []),
        { name: '', service: '', amount: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    if ((data.miscServices || []).length <= 1) return;
    const updatedItems = data.miscServices.filter((_, i) => i !== index);
    onChange({ ...data, miscServices: updatedItems });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...data.miscServices];
    updatedItems[index][field] = field === 'amount' ? Number(value) : value;
    onChange({ ...data, miscServices: updatedItems });
  };

  const handleNotesChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Miscellaneous Details
      </Typography>

      <PartsTable
        items={data.miscServices || [{ name: '', service: '', amount: 0 }]}
        onAdd={handleAddItem}
        onRemove={handleRemoveItem}
        onChange={handleItemChange}
        columns={[
          { label: 'Name', field: 'name' },
          { label: 'Service', field: 'service' },
          { label: 'Amount', field: 'amount', type: 'number' },
        ]}
        itemName="Miscellaneous"
        notesField="miscNotes"
        notesValue={data.miscNotes}
        onNotesChange={handleNotesChange}
      />
    </Box>
  );
};

export default DetailTab;
