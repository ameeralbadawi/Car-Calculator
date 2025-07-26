import React, { useState, useEffect, useMemo } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Typography,
    IconButton,
    Divider
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

function VehicleFormModal({
    open,
    handleClose,
    vin,
    setVin,
    mmr = 0,
    setMmr,
    transport,
    setTransport,
    repair,
    setRepair,
    profit,
    setProfit,
    handleSubmit,
}) {
    const [localMmr, setLocalMmr] = useState(mmr);
    const [profitAmount, setProfitAmount] = useState('2000');
    const [profitPercentage, setProfitPercentage] = useState('10');
    const [feeAmount, setFeeAmount] = useState('0');
    const [feePercentage, setFeePercentage] = useState('5');
    const [carfaxStatuses, setCarfaxStatuses] = useState([]);
    const [autocheckStatuses, setAutocheckStatuses] = useState([]);
    const [feeAmountTouched, setFeeAmountTouched] = useState(false);
    const [feePercentageTouched, setFeePercentageTouched] = useState(false);
    const [runNumber, setRunNumber] = useState('');

    const carfaxOptions = [
        "Minor", "Moderate", "Severe", "Total Loss", "Structural Dmg", "Airbags Deployed",
        "Accident Reported", "Clean", "Salvage", "Rebuilt", "Flood", "Lemon", "Odometer Rollback",
        "Not Actual Mileage", "Junk", "Hail Dmg", "Fire Dmg", "Gray Market",
        "Manufacturer Buyback", "Taxi/Police/Rental Usage"
    ];

    const autocheckOptions = [
        "Minor", "Moderate", "Severe", "Total Loss", "Structural Dmg", "Airbags Deployed",
        "Accident Reported", "Clean", "Salvage", "Rebuilt", "Junk", "Flood", "Lemon",
        "Odometer Rollback", "Not Actual Mileage", "Hail Dmg", "Fire Dmg", "Gray Market",
        "Insurance loss", "Theft Recovery", "Vandalism", "Rental/Fleet Use", "Taxi/Police Use", "Lease Use"
    ];

    const resetForm = () => {
        setVin('');
        setRunNumber('');
        setMmr(0);
        setLocalMmr(0);
        setProfitAmount('2000');
        setProfitPercentage('10');
        setFeeAmount('0');
        setFeePercentage('5');
        setProfit(0);
        setTransport('');
        setRepair('');
        setCarfaxStatuses([]);
        setAutocheckStatuses([]);
        setFeeAmountTouched(false);
        setFeePercentageTouched(false);
    };

    const handleCheckboxToggle = (value, selected, setSelected) => {
        if (selected.includes(value)) {
            setSelected(selected.filter((item) => item !== value));
        } else {
            setSelected([...selected, value]);
        }
    };

    // Profit sync
    const updateProfitCalculations = (mmrValue, isAmountChange, newValue) => {
        if (!mmrValue || mmrValue <= 0) return;

        if (isAmountChange) {
            const amount = parseFloat(newValue);
            if (isNaN(amount) || amount < 0) return;
            const percentage = ((amount / mmrValue) * 100).toFixed(2);
            setProfitAmount(amount.toString());
            setProfitPercentage(percentage);
            setProfit(amount);
        } else {
            const percentage = parseFloat(newValue);
            if (isNaN(percentage) || percentage < 0) return;
            const amount = ((mmrValue * percentage) / 100).toFixed(2);
            setProfitPercentage(percentage.toString());
            setProfitAmount(amount);
            setProfit(parseFloat(amount));
        }
    };

    // Fee sync
    useEffect(() => {
        if (localMmr > 0) {
            const mmrVal = parseFloat(localMmr) || 0;
            const p = parseFloat(profitAmount) || 0;
            const t = parseFloat(transport) || 0;
            const r = parseFloat(repair) || 0;

            if (!feeAmountTouched && !feePercentageTouched) {
                const feeBase = mmrVal - p - t - r;
                const calculatedAmount = (feeBase * (parseFloat(feePercentage) || 0)) / 100;
                setFeeAmount(calculatedAmount.toFixed(2));
            }
        }
    }, [localMmr, profitAmount, transport, repair, feePercentage]);

    const handleFeeAmountChange = (e) => {
        const val = e.target.value;
        setFeeAmount(val);
        setFeeAmountTouched(true);

        const mmrVal = parseFloat(localMmr) || 0;
        const p = parseFloat(profitAmount) || 0;
        const t = parseFloat(transport) || 0;
        const r = parseFloat(repair) || 0;
        const feeBase = mmrVal - p - t - r;

        if (feeBase > 0) {
            const percentage = ((parseFloat(val) || 0) / feeBase) * 100;
            setFeePercentage(percentage.toFixed(2));
        }
    };

    const handleFeePercentageChange = (e) => {
        const val = e.target.value;
        setFeePercentage(val);
        setFeePercentageTouched(true);

        const mmrVal = parseFloat(localMmr) || 0;
        const p = parseFloat(profitAmount) || 0;
        const t = parseFloat(transport) || 0;
        const r = parseFloat(repair) || 0;
        const feeBase = mmrVal - p - t - r;

        const amount = (feeBase * (parseFloat(val) || 0)) / 100;
        setFeeAmount(amount.toFixed(2));
    };

    const resetFeeCalculation = () => {
        setFeePercentage('5'); // Reset to default 5%
        setFeeAmountTouched(false);
        setFeePercentageTouched(false);

        // Trigger the fee amount recalculation
        const mmrVal = parseFloat(localMmr) || 0;
        const p = parseFloat(profitAmount) || 0;
        const t = parseFloat(transport) || 0;
        const r = parseFloat(repair) || 0;
        const feeBase = mmrVal - p - t - r;
        const calculatedAmount = (feeBase * 5) / 100; // 5% of feeBase
        setFeeAmount(calculatedAmount.toFixed(2));
    };

    const maxBid = useMemo(() => {
        const mmrVal = parseFloat(localMmr) || 0;
        const p = parseFloat(profitAmount) || 0;
        const t = parseFloat(transport) || 0;
        const r = parseFloat(repair) || 0;
        const f = parseFloat(feeAmount) || 0;

        const bid = mmrVal - p - t - r - f;
        return bid >= 0 ? bid.toFixed(2) : '0.00';
    }, [localMmr, profitAmount, transport, repair, feeAmount]);

    const handleMmrBlur = () => {
        const parsed = parseFloat(localMmr) || 0;
        setMmr(parsed);
        updateProfitCalculations(parsed, false, profitPercentage);
    };

    const handleProfitAmountChange = (e) => {
        const val = e.target.value;
        setProfitAmount(val);
        const mmrVal = parseFloat(localMmr) || 0;
        updateProfitCalculations(mmrVal, true, val);
    };

    const handleProfitPercentageChange = (e) => {
        const val = e.target.value;
        setProfitPercentage(val);
        const mmrVal = parseFloat(localMmr) || 0;
        updateProfitCalculations(mmrVal, false, val);
    };

    const handleTransportChange = (e) => setTransport(e.target.value);
    const handleRepairChange = (e) => setRepair(e.target.value);

    const handleSubmitForm = () => {
        handleSubmit({
            vin,
            runNumber,
            mmr: parseFloat(localMmr),
            transport,
            repair,
            profit: parseFloat(profitAmount),
            fees: parseFloat(feeAmount),
            carfaxStatuses,
            autocheckStatuses,
        });
        resetForm();
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                maxHeight: '95vh',
                overflowY: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4
            }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Add Vehicle
                </Typography>

                {/* VIN & Run# */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        color='#778899'
                        label="VIN"
                        value={vin}
                        onChange={(e) => setVin(e.target.value)}
                        fullWidth
                        sx={{ flex: 3 }}
                    />
                    <TextField
                        color='#778899'
                        label="Run#"
                        value={runNumber}
                        onChange={(e) => setRunNumber(e.target.value)}
                        fullWidth
                        sx={{ flex: 1 }}
                    />
                </Box>

                {/* MMR */}
                <TextField
                    color='#778899'
                    label="MMR"
                    value={localMmr}
                    onChange={(e) => setLocalMmr(e.target.value)}
                    onBlur={handleMmrBlur}
                    fullWidth
                    type="number"
                    inputProps={{ min: 0 }}
                    sx={{ mb: 2 }}
                />

                {/* Profit */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        color='#778899'
                        label="Profit (Amount)"
                        value={profitAmount}
                        onChange={handleProfitAmountChange}
                        fullWidth
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        color='#778899'
                        label="Profit (%)"
                        value={profitPercentage}
                        onChange={handleProfitPercentageChange}
                        fullWidth
                        type="number"
                        inputProps={{ min: 0, max: 100 }}
                    />
                </Box>

                {/* Transport & Repair */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        color='#778899'
                        label="Transport"
                        value={transport}
                        onChange={handleTransportChange}
                        fullWidth
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        color='#778899'
                        label="Repair"
                        value={repair}
                        onChange={handleRepairChange}
                        fullWidth
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                </Box>

                {/* Fees */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        label="Fees (Amount)"
                        value={feeAmount}
                        onChange={handleFeeAmountChange}
                        onFocus={() => setFeeAmountTouched(true)}
                        fullWidth
                        type="number"
                        inputProps={{ min: 0 }}
                        color={feeAmountTouched ? 'warning' : '#778899'}
                        helperText={feeAmountTouched ? 'Manually entered' : 'Auto-calculated'}
                    />
                    <TextField
                        label="Fees (%)"
                        value={feePercentage}
                        onChange={handleFeePercentageChange}
                        onFocus={() => setFeePercentageTouched(true)}
                        fullWidth
                        type="number"
                        inputProps={{ min: 0, max: 100 }}
                        color={feePercentageTouched ? 'warning' : '#778899'}
                        helperText={feePercentageTouched ? 'Manually entered' : 'Auto-calculated'}
                    />
                    <IconButton
                        onClick={resetFeeCalculation}
                        title="Reset fees"
                        sx={{
                            alignSelf: 'center',
                            mt: '-8px'
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>

                {/* Max Bid */}
                <TextField
                    color='#778899'
                    label="Max Bid (Calculated)"
                    value={maxBid}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 3 }}
                />

                <Divider sx={{ my: 3 }} />

                {/* Carfax & Autocheck Checkboxes */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {[['Carfax', carfaxOptions, carfaxStatuses, setCarfaxStatuses],
                    ['Autocheck', autocheckOptions, autocheckStatuses, setAutocheckStatuses]].map(
                        ([label, options, statuses, setStatuses]) => (
                            <Box
                                key={label}
                                sx={{
                                    flex: 1,
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    p: 2,
                                }}
                            >
                                <Typography variant="subtitle1" align="center" gutterBottom>
                                    {label}
                                </Typography>
                                <FormGroup>
                                    {options.map((option) => (
                                        <FormControlLabel
                                            key={option}
                                            control={
                                                <Checkbox
                                                    checked={statuses.includes(option)}
                                                    onChange={() =>
                                                        handleCheckboxToggle(option, statuses, setStatuses)
                                                    }
                                                    sx={{
                                                        '&.Mui-checked': {
                                                          color: '#778899',
                                                        },
                                                      }}
                                                />
                                            }
                                            label={option}
                                        />
                                    ))}
                                </FormGroup>
                            </Box>
                        )
                    )}
                </Box>

                {/* Submit */}
                <Button
                    variant="contained"
                    onClick={handleSubmitForm}
                    fullWidth
                    sx={{ mt: 1, backgroundColor: '#778899'}}
                >
                    Submit
                </Button>
            </Box>
        </Modal>
    );
}

export default VehicleFormModal;