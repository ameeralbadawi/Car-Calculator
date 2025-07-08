import React, { useState, useEffect, useMemo } from 'react';
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
import { useDispatch } from 'react-redux';
import { updateCarInBackend } from './pipelineThunks'; 

const dispatch = useDispatch();

const InvoiceModal = ({ open, onClose, car }) => {
  const [formData, setFormData] = useState({ Car: {} });

  useEffect(() => {
    if (car) {
      setFormData({
        Car: {
          CarDetails: {
            year: car.year || '',
            make: car.make || '',
            model: car.model || '',
            vin: car.vin || '',
          },
          EstimateDetails: {
            mmr: car.mmr || '',
            profit: car.profit || '',
            transport: car.transport || '',
            repair: car.repair || '',
            fees: car.fees || '',
            maxBid: car.maxBid || '',
            carfaxStatuses: car.carfaxStatuses
              ? [...car.carfaxStatuses]
              : car.carfaxStatus
                ? [car.carfaxStatus]
                : [''],
            autocheckStatuses: car.autocheckStatuses
              ? [...car.autocheckStatuses]
              : car.autocheckStatus
                ? [car.autocheckStatus]
                : [''],
          },
          PurchaseDetails: {
            purchaseDate: car.purchaseDate || '',
            purchaseFrom: car.purchaseFrom || '',
            purchaseLocation: car.purchaseLocation || '',
            mileage: car.mileage || '',
            winningBid: car.winningBid || '',
            amountPaid: parseFloat(car.amountPaid) || 0,
            buyerName: car.buyerName || '',
            stockNumber: car.stockNumber || '',
            color: car.color || '',
            purchaseNotes: car.purchaseNotes || '',
          },
          TransportDetails: {
            transporterName: car.transporterName || '',
            transporterPhone: car.transporterPhone || '',
            pickupDate: car.pickupDate || '',
            deliveryDate: car.deliveryDate || '',
            cost: parseFloat(car.cost) || 0,
            transporterNotes: car.transporterNotes || '',
          },
          PartsDetails: {
            parts: car.parts || [{ part: '', purchasedFrom: '', amount: 0 }],
            partsNotes: car.partsNotes || '',
          },
          MechanicDetails: {
            mechanicServices: car.mechanicServices || [{ shop: '', service: '', amount: 0 }],
            mechanicNotes: car.mechanicNotes || '',
          },
          BodyshopDetails: {
            bodyshopServices: car.bodyshopServices || [{ shop: '', service: '', amount: 0 }],
            bodyshopNotes: car.bodyshopNotes || '',
          },
          MiscellaniousDetails: {
            miscServices: car.detailServices || [{ name: '', service: '', amount: 0 }],
            miscNotes: car.miscNotes || '',
          },
          saleDetails: {
            saleType: car.saleType || '',
            saleDate: car.saleDate || '',
            saleAmount: parseFloat(car.saleAmount) || 0,
            sellerFees: parseFloat(car.sellerFees) || 0,
            soldTo: car.soldTo || '',
            salesmanName: car.salesmanName || '',
            commission: parseFloat(car.commission) || 0,
            saleNotes: car.saleNotes || '',
          },
        },
      });
    }
  }, [car]);

  const enrichedFormData = useMemo(() => {
    const Car = formData.Car || {};

    const partsTotal = (Car.PartsDetails?.parts || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const mechanicTotal = (Car.MechanicDetails?.mechanicServices || []).reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
    const bodyshopTotal = (Car.BodyshopDetails?.bodyshopServices || []).reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
    const miscTotal = (Car.MiscellaniousDetails?.miscServices || []).reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

    const saleAmount = parseFloat(Car.saleDetails?.saleAmount) || 0;
    const amountPaid = parseFloat(Car.PurchaseDetails?.amountPaid) || 0;
    const cost = amountPaid +
      (parseFloat(Car.TransportDetails?.cost) || 0) +
      partsTotal + mechanicTotal + bodyshopTotal + miscTotal +
      (parseFloat(Car.saleDetails?.sellerFees) || 0);
    const grossProfit = saleAmount - cost;
    const commission = parseFloat(Car.saleDetails?.commission) || 0;
    const netProfit = grossProfit - commission;

    return {
      ...formData,
      Car: {
        ...Car,
        PartsDetails: { ...Car.PartsDetails, partsTotal },
        MechanicDetails: { ...Car.MechanicDetails, mechanicTotal },
        BodyshopDetails: { ...Car.BodyshopDetails, bodyshopTotal },
        MiscellaniousDetails: { ...Car.MiscellaniousDetails, miscTotal },
        InvoiceDetails: {
          sale: saleAmount,
          cost,
          grossProfit,
          commission,
          netProfit,
        },
      },
    };
  }, [formData]);

  const handleSave = () => {
    const { vin } = formData.Car.CarDetails || {};
    if (!vin) return;
  
    dispatch(updateCarInBackend({ vin, data: enrichedFormData.Car }));
    onClose();
  };

  const { year, make, model, vin } = formData.Car.CarDetails || {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Invoice Modal</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">{`${year} ${make} ${model}`}</Typography>
          <Typography variant="body2" color="textSecondary">
            VIN: {vin}
          </Typography>
        </Box>
        <InvoiceTabs formData={enrichedFormData} setFormData={setFormData} />
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
