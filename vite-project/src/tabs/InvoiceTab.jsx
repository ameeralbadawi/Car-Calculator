import React from 'react';
import { Box, Typography } from '@mui/material';
import { PDFViewer } from '@react-pdf/renderer';
import InvoicePDF from '../InvoicePDF';

const InvoiceTab = ({ formData }) => {
  if (!formData?.Car) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Error: Invoice data is not available.
      </Typography>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
      <PDFViewer width="100%" height="100%">
        <InvoicePDF formData={formData} />
      </PDFViewer>

    </Box>
  );
};

export default InvoiceTab;
