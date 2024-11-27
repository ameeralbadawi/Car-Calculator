import React, { useState } from 'react';
import { Modal, Box, TextField, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';

function VehicleFormModal({
    open,
    handleClose,
    vin,
    setVin,
    mmr = 0, // Default MMR to 0
    setMmr,
    transport,
    setTransport,
    repair,
    setRepair,
    carfaxStatus,
    setCarfaxStatus,
    profit,
    setProfit,
    handleSubmit,
}) {
    const [localMmr, setLocalMmr] = useState(mmr); // Temporary local state for MMR
    const [profitAmount, setProfitAmount] = useState('2000'); // Default profit amount to 2000
    const [profitPercentage, setProfitPercentage] = useState('10'); // Default profit percentage to 10%

    // Function to update profit calculations
    const updateProfitCalculations = (mmrValue, isAmountChange) => {
        if (isAmountChange) {
            // If profit amount was changed, calculate percentage
            const calculatedPercentage = ((profitAmount / mmrValue) * 100).toFixed(2);
            setProfitPercentage(calculatedPercentage);
        } else {
            // If profit percentage was changed, calculate amount
            const calculatedProfitAmount = ((mmrValue * profitPercentage) / 100).toFixed(2);
            setProfitAmount(calculatedProfitAmount);
        }

        // Sync with parent component
        setProfit(profitAmount);
    };

    // Handle MMR onBlur or Enter key
    const handleMmrBlurOrEnter = () => {
        const parsedMmr = parseFloat(localMmr) || 0; // Ensure MMR is a valid number
        setMmr(parsedMmr); // Update parent MMR
        updateProfitCalculations(parsedMmr, false); // Update profit calculations based on MMR and percentage
    };

    // Handle Enter key press for MMR
    const handleMmrKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleMmrBlurOrEnter();
        }
    };

    // Handle Enter key press for Profit Amount
    const handleProfitAmountKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleProfitAmountBlur(); // Trigger the blur logic on Enter press
        }
    };

    // Handle Enter key press for Profit Percentage
    const handleProfitPercentageKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleProfitPercentageBlur(); // Trigger the blur logic on Enter press
        }
    };

    // Formatting profit amount onBlur
    const handleProfitAmountBlur = () => {
        const formattedProfit = parseFloat(profitAmount).toFixed(2);
        setProfitAmount(formattedProfit);
        setProfit(formattedProfit);
        updateProfitCalculations(localMmr, true); // Update calculations when profit amount changes
    };

    // Formatting profit percentage onBlur
    const handleProfitPercentageBlur = () => {
        const formattedPercentage = parseFloat(profitPercentage).toFixed(2);
        setProfitPercentage(formattedPercentage);
        updateProfitCalculations(localMmr, false); // Update calculations when profit percentage changes
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h2 style={{ textAlign: 'center' }}>Vehicle Details</h2>
                <TextField
                    label="VIN"
                    fullWidth
                    margin="normal"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                />
                <TextField
                    label="MMR"
                    fullWidth
                    margin="normal"
                    value={localMmr}
                    onChange={(e) => setLocalMmr(e.target.value)} // Update local state
                    onBlur={handleMmrBlurOrEnter} // Update MMR and profit on blur
                    onKeyPress={handleMmrKeyPress} // Update MMR and profit on Enter
                    type="number"
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Profit (Amount)"
                        fullWidth
                        value={profitAmount}
                        onChange={(e) => setProfitAmount(e.target.value)}
                        onBlur={handleProfitAmountBlur}
                        onKeyPress={handleProfitAmountKeyPress} // Add Enter key press handling
                        type="number"
                    />
                    <TextField
                        label="Profit (%)"
                        fullWidth
                        value={profitPercentage}
                        onChange={(e) => setProfitPercentage(e.target.value)}
                        onBlur={handleProfitPercentageBlur}
                        onKeyPress={handleProfitPercentageKeyPress} // Add Enter key press handling
                        type="number"
                    />
                </Box>
                <TextField
                    label="Transport"
                    fullWidth
                    margin="normal"
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                />
                <TextField
                    label="Repair"
                    fullWidth
                    margin="normal"
                    value={repair}
                    onChange={(e) => setRepair(e.target.value)}
                />

                <h3 style={{ textAlign: 'center' }}>Carfax</h3>
                <RadioGroup
                    row
                    value={carfaxStatus}
                    onChange={(e) => setCarfaxStatus(e.target.value)}
                >
                    <FormControlLabel value="Clean" control={<Radio />} label="Clean" />
                    <FormControlLabel value="Minor" control={<Radio />} label="Minor" />
                    <FormControlLabel value="Salvage/Insurance" control={<Radio />} label="Salvage/Insurance" />
                </RadioGroup>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ mt: 2 }}
                >
                    Submit
                </Button>
            </Box>
        </Modal>
    );
}

export default VehicleFormModal;
