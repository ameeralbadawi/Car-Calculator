import React from 'react';
import { Box, Typography } from '@mui/material';
import PartsTable from '../shared/PartsTable';

const PartsTab = ({ formData, setFormData }) => {
  const handleAddPart = () => {
    setFormData((prev) => ({
      ...prev,
      parts: [...prev.parts, { part: '', purchasedFrom: '', amount: 0 }],
    }));
  };

  const handleRemovePart = (index) => {
    if (formData.parts.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index),
    }));
  };

  const handlePartChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedParts = [...prev.parts];
      updatedParts[index][field] = field === 'amount' ? Number(value) : value;
      return { ...prev, parts: updatedParts };
    });
  };

  const handleNotesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Parts Details
      </Typography>

      <PartsTable
        items={formData.parts}
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
        notesValue={formData.partsNotes}
        onNotesChange={handleNotesChange}
      />
    </Box>
  );
};

export default PartsTab;