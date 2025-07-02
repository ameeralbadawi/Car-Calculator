// VinField.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  TextField, 
  Button, 
  Box, 
  Grid, 
  CircularProgress,
  Alert 
} from '@mui/material';
import { saveCarToBackend } from './pipelineThunks'; // update the path as needed


// Add formatMake function directly in the component file
const formatMake = (make) => {
  if (!make || typeof make !== 'string') return 'N/A';
  return make.charAt(0).toUpperCase() + make.slice(1).toLowerCase();
};

const VinField = () => {
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchVehicleDetails = async (vin) => {
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVIN/${vin}?format=json`);
      const data = await response.json();
      return {
        make: formatMake(data.Results.find(result => result.Variable === 'Make')?.Value),
        model: data.Results.find(result => result.Variable === 'Model')?.Value || 'N/A',
        year: data.Results.find(result => result.Variable === 'Model Year')?.Value || 'N/A',
      };
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vin) {
      setError('Please enter a VIN');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const vehicleDetails = await fetchVehicleDetails(vin);
      
      const newCar = {
        id: Date.now(),
        vin,
        year: vehicleDetails.year,
        make: vehicleDetails.make,
        model: vehicleDetails.model,
        status: 'Purchased',
        cost: 0,
        notes: '',
        createdAt: new Date().toISOString()
      };

      dispatch(saveCarToBackend({ stage: 'Purchased', car: newCar }));
      setVin('');
    } catch (err) {
      setError('Failed to fetch vehicle details. Please check the VIN and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
        mb: 3, 
        width: '60%', // Reduced width
        minWidth: '400px', // Minimum width to prevent becoming too narrow
        maxWidth: '600px', // Maximum width
        mr: 'auto', // This will push it to the left
        ml: 0 // Explicitly set left margin to 0
      }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8} md={9}>
            <TextField
              fullWidth
              label="Enter VIN"
              variant="outlined"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              disabled={loading}
              inputProps={{
                maxLength: 17,
                style: { textTransform: 'uppercase' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || vin.length !== 17}
              sx={{ height: '56px', backgroundColor: "#778899", fontSize: "13px", fontFamily: "'Helvetica'", fontWeight: "bold" }}
            >
              {loading ? <CircularProgress size={24} /> : 'Add Vehicle'}
            </Button>
          </Grid>
        </Grid>
      </form>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default VinField;