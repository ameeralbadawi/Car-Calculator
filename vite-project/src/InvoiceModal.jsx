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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from "@mui/material";
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for the date picker
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Import CalendarToday icon from MUI
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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
        parts: car?.parts || [{ part: '', purchasedFrom: '', amount: 0 }], // Initialize parts array
        transportNotes: car?.transportNotes || "",
        purchaseNotes: car?.purchaseNotes || "",
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

    // Parts table handlers
    const handleAddPart = () => {
        setFormData(prev => ({
            ...prev,
            parts: [...prev.parts, { part: '', purchasedFrom: '', amount: 0 }]
        }));
    };

    const handleRemovePart = (index) => {
        if (formData.parts.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            parts: prev.parts.filter((_, i) => i !== index)
        }));
    };

    const handlePartChange = (index, field, value) => {
        setFormData(prev => {
            const updatedParts = [...prev.parts];
            updatedParts[index][field] = field === 'amount' ? Number(value) : value;
            return { ...prev, parts: updatedParts };
        });
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
                parts: car.parts || [{ part: '', purchasedFrom: '', amount: 0 }],
                transportNotes: car.transportNotes || "",
                purchaseNotes: car.purchaseNotes || "",
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

            {/* First Row - 3 fields */}
            <Grid2 container spacing={3} sx={{ mb: 3 }}>
                <Grid2 item xs={12} sm={4}>
                    <TextField
                        label="Purchase Date"
                        name="purchaseDate"
                        value={formData.purchaseDate ? formData.purchaseDate.toLocaleDateString() : ''}
                        fullWidth
                        margin="normal"
                        variant="standard"
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <DatePicker
                                    selected={formData.purchaseDate}
                                    onChange={(date) => setFormData((prev) => ({ ...prev, purchaseDate: date }))}
                                    dateFormat="MM/dd/yyyy"
                                    customInput={
                                        <Button variant="standard" sx={{ minWidth: 0, padding: 0 }}>
                                            <CalendarTodayIcon />
                                        </Button>
                                    }
                                />
                            )
                        }}
                    />
                </Grid2>
                <Grid2 item xs={12} sm={4}>
                    <TextField
                        label="Purchase From"
                        name="purchaseFrom"
                        value={formData.purchaseFrom}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                </Grid2>
                <Grid2 item xs={12} sm={4}>
                    <TextField
                        label="Purchase Location"
                        name="purchaseLocation"
                        value={formData.purchaseLocation}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                </Grid2>
            </Grid2>

            {/* Second Row - 2 fields */}
            <Grid2 container spacing={3} sx={{ mb: 3 }}>
                <Grid2 item xs={12} sm={6}>
                    <TextField
                        label="Winning Bid"
                        name="winningBid"
                        value={formData.winningBid}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="standard"
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
                <Grid2 item xs={12} sm={6}>
                    <TextField
                        label="Amount Paid"
                        name="amountPaid"
                        value={formData.amountPaid}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="standard"
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
                <Grid2 item xs={12} sm={6}>
                    <TextField
                        label="Buyer Name"
                        name="buyer"
                        value={formData.buyer}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="standard"
                    />
                </Grid2>
            </Grid2>

            {/* Third Row - Full width notes */}
            <Box sx={{
                width: '100%',
                mt: 2,
                '& .MuiTextField-root': {
                    width: '100%'
                }
            }}>
                <TextField
                    label="Notes"
                    name="purchaseNotes"
                    value={formData.purchaseNotes}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={6}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            padding: 1,
                            alignItems: 'flex-start'
                        }
                    }}
                />
            </Box>
        </Box>
    );




    const renderTransportContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Transport Details
            </Typography>
            <Grid2 container spacing={3} sx={{ mb: 3 }}>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Transporter Name"
                        name="transporterName"
                        value={formData.transporterName}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        fullWidth
                        variant="standard"
                    />
                </Grid2>
            </Grid2>
            <Grid2 container spacing={3} sx={{ mb: 3 }}>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Pickup Date"
                        name="pickupDate"
                        value={formData.pickupDate ? formData.pickupDate.toLocaleDateString() : ''}
                        onChange={() => { }}
                        fullWidth
                        margin="normal"
                        variant="standard"
                        InputProps={{
                            readOnly: true, // Make the text field readonly to only allow date picker input
                            endAdornment: (
                                <DatePicker
                                    selected={formData.pickupDate}
                                    onChange={(date) => setFormData((prev) => ({ ...prev, pickupDate: date }))}
                                    dateFormat="MM/dd/yyyy"
                                    customInput={<Button variant="standard" sx={{ minWidth: 0, padding: 0 }}><CalendarTodayIcon /></Button>} // Use Calendar icon here
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
                        variant="standard"
                        InputProps={{
                            readOnly: true, // Make the text field readonly to only allow date picker input
                            endAdornment: (
                                <DatePicker
                                    selected={formData.deliveryDate}
                                    onChange={(date) => setFormData((prev) => ({ ...prev, deliveryDate: date }))}
                                    dateFormat="MM/dd/yyyy"
                                    customInput={<Button variant="standard" sx={{ minWidth: 0, padding: 0 }}><CalendarTodayIcon /></Button>} // Use Calendar icon here
                                />
                            )
                        }}
                    />
                </Grid2>
            </Grid2>
            <Grid2 container spacing={3} sx={{ mb: 3 }}>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
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
            </Grid2>
            <Box sx={{
                width: '100%',
                mt: 2,
                '& .MuiTextField-root': {
                    width: '100%'
                }
            }}>
                <TextField
                    label="Notes"
                    name="transportNotes"
                    value={formData.transportNotes}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={6}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            padding: 1,
                            alignItems: 'flex-start'
                        }
                    }}
                />
            </Box>

        </Box>

    );

    const renderPartsContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Parts Details
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Part</TableCell>
                            <TableCell>Purchased From</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={handleAddPart} color="primary">
                                    <AddIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formData.parts.map((part, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <TextField
                                        value={part.part || ''}
                                        onChange={(e) => handlePartChange(index, 'part', e.target.value)}
                                        variant="standard"
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={part.purchasedFrom || ''}
                                        onChange={(e) => handlePartChange(index, 'purchasedFrom', e.target.value)}
                                        variant="standard"
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={part.amount || ''}
                                        onChange={(e) => handlePartChange(index, 'amount', e.target.value)}
                                        type="number"
                                        variant="standard"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">$</InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => handleRemovePart(index)}
                                        color="error"
                                        disabled={formData.parts.length <= 1}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="subtitle1" textAlign={"right"} sx={{ fontWeight: 'bold' }}>
                Parts Total: ${formData.parts.reduce((sum, part) => sum + (Number(part.amount) || 0), 0).toFixed(2)}
            </Typography>
            <TextField
                label="Notes"
                name="partsNotes"
                value={formData.partsNotes || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        padding: 1,
                        alignItems: 'flex-start'
                    }
                }}
            />
        </Box>
    );

    const renderMechanicContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Mechanic Details
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Shop</TableCell>
                            <TableCell>Service</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={handleAddPart} color="primary">
                                    <AddIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formData.parts.map((part, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <TextField
                                        value={part.shop || ''}
                                        onChange={(e) => handlePartChange(index, 'shop', e.target.value)}
                                        variant="standard"
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={part.service || ''}
                                        onChange={(e) => handlePartChange(index, 'service', e.target.value)}
                                        variant="standard"
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={part.amount || ''}
                                        onChange={(e) => handlePartChange(index, 'amount', e.target.value)}
                                        type="number"
                                        variant="standard"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">$</InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => handleRemovePart(index)}
                                        color="error"
                                        disabled={formData.parts.length <= 1}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="subtitle1" textAlign={"right"} sx={{ fontWeight: 'bold' }}>
                Mechanic Total: ${formData.parts.reduce((sum, part) => sum + (Number(part.amount) || 0), 0).toFixed(2)}
            </Typography>
            <TextField
                label="Notes"
                name="mechanicNotes"
                value={formData.mechanicNotes || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        padding: 1,
                        alignItems: 'flex-start'
                    }
                }}
            />
        </Box>
    );

    const renderBodyshopContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Bodyshop Details
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Shop</TableCell>
                            <TableCell>Service</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={handleAddPart} color="primary">
                                    <AddIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formData.parts.map((part, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <TextField
                                        value={part.shop || ''}
                                        onChange={(e) => handlePartChange(index, 'shop', e.target.value)}
                                        variant="standard"
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={part.service || ''}
                                        onChange={(e) => handlePartChange(index, 'service', e.target.value)}
                                        variant="standard"
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={part.amount || ''}
                                        onChange={(e) => handlePartChange(index, 'amount', e.target.value)}
                                        type="number"
                                        variant="standard"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">$</InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => handleRemovePart(index)}
                                        color="error"
                                        disabled={formData.parts.length <= 1}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="subtitle1" textAlign={"right"} sx={{ fontWeight: 'bold' }}>
                Bodyshop Total: ${formData.parts.reduce((sum, part) => sum + (Number(part.amount) || 0), 0).toFixed(2)}
            </Typography>
            <TextField
                label="Notes"
                name="bodyshopNotes"
                value={formData.bodyshopNotes || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        padding: 1,
                        alignItems: 'flex-start'
                    }
                }}
            />
        </Box>
    );

    const renderDetailContent = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Miscellanious Details
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Service</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={handleAddPart} color="primary">
                                    <AddIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formData.parts.map((part, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <TextField
                                        value={part.name || ''}
                                        onChange={(e) => handlePartChange(index, 'name', e.target.value)}
                                        variant="standard"
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={part.service || ''}
                                        onChange={(e) => handlePartChange(index, 'service', e.target.value)}
                                        variant="standard"
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={part.amount || ''}
                                        onChange={(e) => handlePartChange(index, 'amount', e.target.value)}
                                        type="number"
                                        variant="standard"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">$</InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => handleRemovePart(index)}
                                        color="error"
                                        disabled={formData.parts.length <= 1}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="subtitle1" textAlign={"right"} sx={{ fontWeight: 'bold' }}>
                Miscellanious Total: ${formData.parts.reduce((sum, part) => sum + (Number(part.amount) || 0), 0).toFixed(2)}
            </Typography>
            <TextField
                label="Notes"
                name="miscNotes"
                value={formData.miscNotes || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        padding: 1,
                        alignItems: 'flex-start'
                    }
                }}
            />
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
                    <Tab label="Misc." />
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
