// src/watchlistThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// GET /watchlists
export const fetchWatchlistsFromBackend = createAsyncThunk(
    'sheets/fetchWatchlists',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_URL}/watchlists/`);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch watchlists');
        }
    }
);

// POST /watchlists
export const createWatchlistInBackend = createAsyncThunk(
    'sheets/createWatchlist',
    async (sheetName, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_URL}/watchlists/`, {
                name: sheetName,
            });
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || 'Failed to create watchlist');
        }
    }
);

// PATCH /watchlists/:id
export const renameWatchlistInBackend = createAsyncThunk(
    'sheets/renameWatchlist',
    async ({ id, newName }, thunkAPI) => {
        try {
            const response = await axios.patch(`${BASE_URL}/watchlists/${id}`, {
                name: newName,
            });
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || 'Failed to rename watchlist');
        }
    }
);

// DELETE /watchlists/:id
export const deleteSheetThunk = createAsyncThunk(
    'watchlist/deleteSheet',
    async (watchlistId, thunkAPI) => {
        try {
            const response = await axios.delete(`${BASE_URL}/watchlists/${watchlistId}`);
            return watchlistId;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || 'Failed to delete watchlist');
        }
    }
);

