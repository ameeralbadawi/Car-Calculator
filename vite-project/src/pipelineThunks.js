import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addCarToStage, deleteCarFromStage } from './store'; // adjust path if needed

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("Backend API:", BASE_URL);


// POST /cars
export const saveCarToBackend = createAsyncThunk(
    'pipeline/saveCarToBackend',
    async ({ car, stage }, thunkAPI) => {
        try {
            // Send POST request with nested data
            const response = await axios.post(`${BASE_URL}/cars/`, {
                vin: car.vin,
                data: car
            });

            // Use the normalized response from the backend
            const normalizedCar = response.data;

            // Update local Redux store with flat car data
            thunkAPI.dispatch(addCarToStage({ stage: normalizedCar.status, car: normalizedCar }));

            return normalizedCar;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);


// DELETE /cars/:vin
export const deleteCarFromBackend = createAsyncThunk(
    'pipeline/deleteCarFromBackend',
    async ({ vin, stage, carId }, thunkAPI) => {
        try {
            await axios.delete(`${BASE_URL}/cars/${vin}`);

            // Dispatch local Redux action to update UI
            thunkAPI.dispatch(deleteCarFromStage({ stage, carId }));

            return vin;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

// GET /cars
export const fetchCarsFromBackend = createAsyncThunk(
    'pipeline/fetchCars',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_URL}/cars/`);
            return response.data; // array of cars from backend
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch cars');
        }
    }
);

// PATCH /cars/:vin - update only the stage/status
export const updateCarStageInBackend = createAsyncThunk(
    'pipeline/updateCarStage',
    async ({ vin, newStage }, thunkAPI) => {
      try {
        const response = await axios.patch(`${BASE_URL}/cars/${vin}`, {
          status: newStage,
        });
  
        // The backend returns: { vin, status } or more if you change it
        return {
          vin: response.data.vin,
          newStage: response.data.status,
        };
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  export const updateCarInBackend = createAsyncThunk(
    'pipeline/updateCar',
    async ({ vin, data }, thunkAPI) => {
      try {
        const response = await axios.put(`${BASE_URL}/cars/${vin}`, {
          vin,
          data,
        });
  
        return response.data; // Flat updated car object
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  
  
  

