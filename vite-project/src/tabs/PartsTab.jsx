import React from 'react';
import { Box, Typography } from '@mui/material';
import PartsTable from '../shared/PartsTable';

const PartsTab = ({ data, onChange }) => {
  const handleAddPart = () => {
    onChange({
      ...data,
      parts: [...data.parts, { part: '', purchasedFrom: '', amount: 0 }],
    });
  };

  const handleRemovePart = (index) => {
    if (data.parts.length <= 1) return;
    const updatedParts = data.parts.filter((_, i) => i !== index);
    onChange({ ...data, parts: updatedParts });
  };

  const handlePartChange = (index, field, value) => {
    const updatedParts = [...data.parts];
    const updatedItem = {
      ...updatedParts[index],
      [field]: field === 'amount' ? Number(value) : value,
    };
    updatedParts[index] = updatedItem;
  
    onChange({ ...data, parts: updatedParts });
  };
  

  const handleNotesChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Parts Details
      </Typography>

      <PartsTable
        items={data.parts}
        onAdd={handleAddPart}
        onRemove={handleRemovePart}
        onChange={handlePartChange}
        columns={[
          { label: 'Part', field: 'part' },
          { label: 'Purchased From', field: 'purchasedFrom' },
          { label: 'Amount', field: 'amount', type: 'number' },
        ]}
        itemName="Parts"
        notesField="partsNotes"
        notesValue={data.partsNotes}
        onNotesChange={handleNotesChange}
      />
    </Box>
  );
};

export default PartsTab;
