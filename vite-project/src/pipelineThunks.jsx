// pipelineThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addCarToStage, deleteCarFromStage } from './store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const errPayload = (err, fallback = 'Request failed') =>
  err?.response?.data || err?.message || fallback;

// POST /car
export const saveCarToBackend = createAsyncThunk(
  'pipeline/saveCarToBackend',
  async ({ car, stage, token }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/cars/`,
        { vin: car.vin, data: car },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const normalizedCar = res.data;
      thunkAPI.dispatch(addCarToStage({ stage: normalizedCar.status, car: normalizedCar }));
      return normalizedCar;
    } catch (err) {
      return thunkAPI.rejectWithValue(errPayload(err, 'Failed to save car'));
    }
  }
);

// GET /cars
export const fetchCarsFromBackend = createAsyncThunk(
  'pipeline/fetchCars',
  async ({ token }, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/cars/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(errPayload(err, 'Failed to fetch cars'));
    }
  }
);

// DELETE /cars/:vin
export const deleteCarFromBackend = createAsyncThunk(
  'pipeline/deleteCarFromBackend',
  async ({ vin, stage, carId, token }, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/cars/${encodeURIComponent(vin)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      thunkAPI.dispatch(deleteCarFromStage({ stage, carId }));
      return vin;
    } catch (err) {
      return thunkAPI.rejectWithValue(errPayload(err, 'Failed to delete car'));
    }
  }
);

// PATCH /cars/:vin
export const updateCarStageInBackend = createAsyncThunk(
  'pipeline/updateCarStage',
  async ({ vin, newStage, token }, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/cars/${encodeURIComponent(vin)}`,
        { status: newStage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { vin: res.data.vin, newStage: res.data.status };
    } catch (err) {
      return thunkAPI.rejectWithValue(errPayload(err, 'Failed to update car stage'));
    }
  }
);

// PUT /cars/:vin
export const updateCarInBackend = createAsyncThunk(
  'pipeline/updateCar',
  async ({ vin, data, token }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/cars/${encodeURIComponent(vin)}`,
        { vin, data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(errPayload(err, 'Failed to update car'));
    }
  }
);
