// Settings.jsx
import React from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';

function Settings() {

    return (
        <Box >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 3 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Watchlist Settings
                </Typography>
            </Box>
            <Box>
                <Typography variant="h7" sx={{ marginBottom: 2 }}>
                    Profit Settings:
                </Typography>
                <RadioGroup>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FormControlLabel value="ProfitAmount" control={<Radio />} label="Profit (Amount)" />
                        <TextField label="Amount" variant="outlined" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FormControlLabel value="ProfitPercent" control={<Radio />} label="Profit (%)" />
                        <TextField label="Percentage" variant="outlined" size="small" />
                    </Box>
                </RadioGroup>
            </Box>
        </Box>
    );
}

export default Settings;

