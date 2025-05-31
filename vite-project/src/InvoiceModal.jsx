import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import InvoiceTabs from './InvoiceTabs';

const InvoiceModal = ({ open, onClose, car, onSave }) => {
  const [formData, setFormData] = useState({
    year: car?.year || '',
    make: car?.make || '',
    model: car?.model || '',
    vin: car?.vin || '',
    carfaxStatus: car?.carfaxStatus || '',
    fees: car?.fees || 0,
    maxBid: car?.maxBid || 0,
    mmr: car?.mmr || 0,
    profit: car?.profit || '0',
    repair: car?.repair || '0',
    status: car?.status || '',
    transport: car?.transport || '0',
    purchaseDate: car?.purchaseDate || null,
    purchaseFrom: car?.purchaseFrom || '',
    purchaseLocation: car?.purchaseLocation || '',
    amountPaid: car?.amountPaid || '',
    parts: car?.parts || [{ part: '', purchasedFrom: '', amount: 0 }],
    mechanicServices: car?.mechanicServices || [{ shop: '', service: '', amount: 0 }],
    bodyshopServices: car?.bodyshopServices || [{ shop: '', service: '', amount: 0 }],
    detailServices: car?.detailServices || [{ name: '', service: '', amount: 0 }],
    transportNotes: car?.transportNotes || '',
    purchaseNotes: car?.purchaseNotes || '',
    partsNotes: car?.partsNotes || '',
    mechanicNotes: car?.mechanicNotes || '',
    bodyshopNotes: car?.bodyshopNotes || '',
    saleType: car?.saleType || '',
    saleDate: car?.saleDate || null,
    saleAmount: car?.saleAmount || 0,
    sellerFees: car?.sellerFees || 0,
    soldTo: car?.soldTo || '',
    salesmanName: car?.salesmanName || '',
    commission: car?.commission || 0,
    saleNotes: car?.saleNotes || '',
  });

  useEffect(() => {
    if (car) {
      setFormData({
        year: car.year || '',
        make: car.make || '',
        model: car.model || '',
        vin: car.vin || '',
        carfaxStatus: car.carfaxStatus || '',
        fees: car.fees || 0,
        maxBid: car.maxBid || 0,
        mmr: car.mmr || 0,
        profit: car.profit || '0',
        repair: car.repair || '0',
        status: car.status || '',
        transport: car.transport || '0',
        purchaseDate: car.purchaseDate || null,
        purchaseFrom: car.purchaseFrom || '',
        purchaseLocation: car.purchaseLocation || '',
        amountPaid: car.amountPaid || '',
        parts: car.parts || [{ part: '', purchasedFrom: '', amount: 0 }],
        mechanicServices: car.mechanicServices || [{ shop: '', service: '', amount: 0 }],
        bodyshopServices: car.bodyshopServices || [{ shop: '', service: '', amount: 0 }],
        detailServices: car.detailServices || [{ name: '', service: '', amount: 0 }],
        transportNotes: car.transportNotes || '',
        purchaseNotes: car.purchaseNotes || '',
        partsNotes: car.partsNotes || '',
        mechanicNotes: car.mechanicNotes || '',
        bodyshopNotes: car.bodyshopNotes || '',
        saleType: car.saleType || '',
        saleDate: car.saleDate || null,
        saleAmount: car.saleAmount || 0,
        sellerFees: car.sellerFees || 0,
        soldTo: car.soldTo || '',
        salesmanName: car.salesmanName || '',
        commission: car.commission || 0,
        saleNotes: car.saleNotes || '',
      });
    }
  }, [car]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Invoice Modal</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">{`${formData.year} ${formData.make} ${formData.model}`}</Typography>
          <Typography variant="body2" color="textSecondary">
            VIN: {formData.vin}
          </Typography>
        </Box>
        
        <InvoiceTabs 
          formData={formData} 
          setFormData={setFormData}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceModal;