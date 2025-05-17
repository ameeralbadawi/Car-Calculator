import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Tabs,
    Tab,
    Box,
    Typography,
    Grid2,
    InputAdornment,
} from "@mui/material";
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for the date picker
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Import CalendarToday icon from MUI

const InvoiceModal = ({ open, onClose, car, onSave }) => {
    const [formData, setFormData] = useState({
        year: car?.year || "",
        make: car?.make || "",
        model: car?.model || "",
        vin: car?.vin || "",
        carfaxStatus: car?.carfaxStatus || "",
        fees: car?.fees || 0,
        maxBid: car?.maxBid || 0,
        mmr: car?.mmr || 0,
        profit: car?.profit || "0",
        repair: car?.repair || "0",
        status: car?.status || "",
        transport: car?.transport || "0",
        purchaseDate: car?.purchaseDate || null,
        purchaseFrom: car?.purchaseFrom || "",
        purchaseLocation: car?.purchaseLocation || "",
        amountPaid: car?.amountPaid || "",
    });

    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, purchaseDate: date }));
    };

    const handleSave = () => {
        onSave(formData); // Pass updated data back to parent
        onClose(); // Close the modal
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handlePhoneChange = (e) => {
        const input = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
        let formattedInput = '';
        
        if (input.length > 0) {
            formattedInput = `(${input.substring(0, 3)}`;
        }
        if (input.length > 3) {
            formattedInput += `) - ${input.substring(3, 6)}`;
        }
        if (input.length > 6) {
            formattedInput += ` - ${input.substring(6, 10)}`;
        }
        
        setFormData((prev) => ({ ...prev, phone: formattedInput }));
    };

    useEffect(() => {
        if (car) {
            setFormData({
                year: car.year || "",
                make: car.make || "",
                model: car.model || "",
                vin: car.vin || "",
                carfaxStatus: car.carfaxStatus || "",
                fees: car.fees || 0,
                maxBid: car.maxBid || 0,
                mmr: car.mmr || 0,
                profit: car.profit || "0",
                repair: car.repair || "0",
                status: car.status || "",
                transport: car.transport || "0",
                purchaseDate: car.purchaseDate || null,
                purchaseFrom: car?.purchaseFrom || "",
                purchaseLocation: car.purchaseLocation || "",
                amountPaid: car.amountPaid || "",
            });
        }
    }, [car]);

    const renderEstimateContent = () => {
        if (!formData) return <Typography>No data available</Typography>;

        return (
            <Box sx={{ p: 2 }}>
                <Grid2 container spacing={2}>
                    <Grid2 item size={6}>
                        <Typography variant="body1">
                            <strong>MMR:</strong> ${formData.mmr || "0"}
                        </Typography>
                    </Grid2>
                    <Grid2 item size={6}>
                        <Typography variant="body1">
                            <strong>Profit:</strong> ${formData.profit || "0"}
                        </Typography>
                    </Grid2>
                    <Grid2 item size={6}>
                        <Typography variant="body1">
                            <strong>Transport:</strong> ${formData.transport || "0"}
                        </Typography>
                    </Grid2>
                    <Grid2 item size={6}>
                        <Typography variant="body1">
                            <strong>Repair:</strong> ${formData.repair || "0"}
                        </Typography>
                    </Grid2>
                    <Grid2 item size={6}>
                        <Typography variant="body1">
                            <strong>Fees:</strong> ${formData.fees || "0"}
                        </Typography>
                    </Grid2>
                    <Grid2 item size={6}>
                        <Typography variant="body1">
                            <strong>Max Bid:</strong> ${formData.maxBid || "0"}
                        </Typography>
                    </Grid2>
                    <Grid2 item size={6}>
                        <Typography variant="body1">
                            <strong>Carfax Status:</strong> {formData.carfaxStatus || "N/A"}
                        </Typography>
                    </Grid2>
                </Grid2>
            </Box>
        );
    };

    const renderPurchasedContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Purchased Details
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Purchase Date"
                        name="purchaseDate"
                        value={formData.purchaseDate ? formData.purchaseDate.toLocaleDateString() : ''}
                        onChange={() => { }}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            readOnly: true, // Make the text field readonly to only allow date picker input
                            endAdornment: (
                                <DatePicker
                                    selected={formData.purchaseDate}
                                    onChange={(date) => setFormData((prev) => ({ ...prev, purchaseDate: date }))}
                                    dateFormat="MM/dd/yyyy"
                                    customInput={<Button variant="outlined" sx={{ minWidth: 0, padding: 1 }}><CalendarTodayIcon /></Button>} // Use Calendar icon here
                                />
                            )
                        }}
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Purchase From"
                        name="purchaseFrom"
                        value={formData.purchaseFrom}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Purchase Location"
                        name="purchaseLocation"
                        value={formData.purchaseLocation}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Amount Paid"
                        name="amountPaid"
                        value={formData.amountPaid}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    $
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid2>
                <Grid2 container sx={{ width: '100%'}}>
                    <TextField
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
            </Grid2>
        </Box>
    );

    const renderTransportContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Transport Details
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Transporter Name"
                        name="transporterName"
                        value={formData.transporterName}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Pickup Date"
                        name="pickupDate"
                        value={formData.pickupDate ? formData.pickupDate.toLocaleDateString() : ''}
                        onChange={() => { }}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            readOnly: true, // Make the text field readonly to only allow date picker input
                            endAdornment: (
                                <DatePicker
                                    selected={formData.pickupDate}
                                    onChange={(date) => setFormData((prev) => ({ ...prev, pickupDate: date }))}
                                    dateFormat="MM/dd/yyyy"
                                    customInput={<Button variant="outlined" sx={{ minWidth: 0, padding: 1 }}><CalendarTodayIcon /></Button>} // Use Calendar icon here
                                />
                            )
                        }}
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Delivery Date"
                        name="deliveryDate"
                        value={formData.deliveryDate ? formData.deliveryDate.toLocaleDateString() : ''}
                        onChange={() => { }}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            readOnly: true, // Make the text field readonly to only allow date picker input
                            endAdornment: (
                                <DatePicker
                                    selected={formData.deliveryDate}
                                    onChange={(date) => setFormData((prev) => ({ ...prev, deliveryDate: date }))}
                                    dateFormat="MM/dd/yyyy"
                                    customInput={<Button variant="outlined" sx={{ minWidth: 0, padding: 1 }}><CalendarTodayIcon /></Button>} // Use Calendar icon here
                                />
                            )
                        }}
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    $
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
            </Grid2>
        </Box>

    );

    const renderPartsContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Parts Details
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
            </Grid2>
        </Box>

    );

    const renderMechanicContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Parts Details
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
            </Grid2>
        </Box>

    );

    const renderBodyshopContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Bodyshop Details
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
            </Grid2>
        </Box>

    );

    const renderDetailContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Detail Details (Change Detail Tab to Miscellanius Tab ex. for detail towing tires etc.)
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
            </Grid2>
        </Box>

    );

    const renderSoldContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Sold Details
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid2>
            </Grid2>
        </Box>

    );

    const renderInvoiceContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Invoice Details
            </Typography>
            <Grid2 container spacing={3}>

            </Grid2>
        </Box>

    );

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return renderEstimateContent();
            case 1:
                return renderPurchasedContent();
            case 2:
                return renderTransportContent();
            case 3:
                return renderPartsContent();
            case 4:
                return renderMechanicContent();
            case 5:
                return renderBodyshopContent();
            case 6:
                return renderDetailContent();
            case 7:
                return renderSoldContent();
            case 8:
                return renderInvoiceContent();
            default:
                return null;
        }
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
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Estimate" />
                    <Tab label="Purchased" />
                    <Tab label="Transport" />
                    <Tab label="Parts" />
                    <Tab label="Mechanic" />
                    <Tab label="Bodyshop" />
                    <Tab label="Detail" />
                    <Tab label="Sold" />
                    <Tab label="Invoice" />
                </Tabs>
                <Box sx={{ mt: 2 }}>{renderTabContent()}</Box>
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
