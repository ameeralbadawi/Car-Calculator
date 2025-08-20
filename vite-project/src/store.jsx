import { createSlice, configureStore } from '@reduxjs/toolkit';
import { fetchCarsFromBackend, updateCarStageInBackend, updateCarInBackend } from './pipelineThunks.jsx'; // thunks now accept token via payload
import { fetchWatchlistsFromBackend, createWatchlistInBackend, renameWatchlistInBackend, deleteSheetThunk, addCarToWatchlistThunk, fetchCarsInWatchlist, deleteCarFromWatchlistThunk } from './watchlistThunks';

// Initial state for pipeline
const initialPipelineState = {
  stages: {
    Purchased: [],
    Transport: [],
    Parts: [],
    Mechanic: [],
    Bodyshop: [],
    Misc: [],
    Available: [],
    Sold: []
  },
  loading: false,
  error: null,
};

// Initial state for sheets
const initialSheetsState = {
  sheets: [],
  activeSheetId: null,
};

const pipelineSlice = createSlice({
  name: 'pipeline',
  initialState: initialPipelineState,
  reducers: {
    moveCarBetweenStages: (state, action) => {
      const { sourceStage, destinationStage, carId } = action.payload;
      const carIndex = state.stages[sourceStage].findIndex((car) => car.id === carId);
      if (carIndex === -1) return;
      const car = state.stages[sourceStage][carIndex];
      car.status = destinationStage;
      state.stages[sourceStage].splice(carIndex, 1);
      state.stages[destinationStage].push(car);
    },
    addCarToStage: (state, action) => {
      const { stage, car } = action.payload;
      car.status = stage;
      if (!car.data) car.data = {};
      car.data.status = stage;
      state.stages[stage].push(car);
    },
    deleteCarFromStage: (state, action) => {
      const { stage, carId } = action.payload;
      state.stages[stage] = state.stages[stage].filter((car) => car.id !== carId);
    },
    updateCarInStage: (state, action) => {
      const { stage, car: updatedCar } = action.payload;
      const stageIndex = state.stages[stage].findIndex(car => car.id === updatedCar.id);
      if (stageIndex !== -1) state.stages[stage][stageIndex] = updatedCar;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH CARS
      .addCase(fetchCarsFromBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarsFromBackend.fulfilled, (state, action) => {
        state.loading = false;
        for (const key in state.stages) state.stages[key] = [];
        action.payload.forEach(car => {
          const stage = car.status || 'Available';
          car.status = stage;
          if (!state.stages[stage]) state.stages[stage] = [];
          state.stages[stage].push(car);
        });
      })
      .addCase(fetchCarsFromBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching cars';
      })
      // UPDATE CAR STAGE
      .addCase(updateCarStageInBackend.fulfilled, (state, action) => {
        const { vin, newStage } = action.payload;
        for (const [stage, cars] of Object.entries(state.stages)) {
          const index = cars.findIndex(car => car.vin === vin);
          if (index !== -1) {
            const car = cars[index];
            car.status = newStage;
            state.stages[stage].splice(index, 1);
            if (!state.stages[newStage]) state.stages[newStage] = [];
            state.stages[newStage].push(car);
            break;
          }
        }
      })
      // UPDATE FULL CAR
      .addCase(updateCarInBackend.fulfilled, (state, action) => {
        const updatedCar = action.payload;
        const stage = updatedCar.status || 'Available';
        const stageIndex = state.stages[stage]?.findIndex(car => car.vin === updatedCar.vin);
        if (stageIndex !== -1) {
          state.stages[stage][stageIndex] = updatedCar;
        } else {
          if (!state.stages[stage]) state.stages[stage] = [];
          state.stages[stage].push(updatedCar);
        }
      });
  }
});

const sheetsSlice = createSlice({
  name: 'sheets',
  initialState: initialSheetsState,
  reducers: {
    addSheet: (state) => {
      const newId = state.sheets.length > 0 ? Math.max(...state.sheets.map(s => s.id)) + 1 : 1;
      state.sheets.push({ id: newId, name: `Sheet ${newId}`, data: [] });
    },
    renameSheet: (state, action) => {
      const sheet = state.sheets.find(s => s.id === action.payload.id);
      if (sheet) sheet.name = action.payload.newName;
    },
    setActiveSheet: (state, action) => { state.activeSheetId = action.payload; },
    setWatchlistCars: (state, action) => {
      const { watchlistId, cars } = action.payload;
      state.watchlistCars[watchlistId] = cars;
      const sheetToUpdate = state.sheets.find(sheet => sheet.id === watchlistId);
      if (sheetToUpdate) sheetToUpdate.data = cars;
    },
    addCarToSheet: (state, action) => {
      const activeSheet = state.sheets.find(sheet => sheet.id === state.activeSheetId);
      if (activeSheet) activeSheet.data.push(action.payload.car);
    },
    deleteSheet: (state, action) => {
      const sheetId = action.payload;
      state.sheets = state.sheets.filter(sheet => sheet.id !== sheetId);
      if (state.activeSheetId === sheetId) state.activeSheetId = state.sheets[0]?.id || null;
    },
    deleteCarFromSheet: (state, action) => {
      state.sheets.forEach(sheet => {
        sheet.data = sheet.data.filter(car => car.id !== action.payload.carId);
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlistsFromBackend.fulfilled, (state, action) => {
        state.sheets = action.payload.map(watchlist => ({ id: watchlist.id, name: watchlist.name, data: [] }));
        state.activeSheetId = state.sheets[0]?.id || null;
      })
      .addCase(createWatchlistInBackend.fulfilled, (state, action) => {
        state.sheets.push({ id: action.payload.id, name: action.payload.name, data: [] });
        state.activeSheetId = action.payload.id;
      })
      .addCase(renameWatchlistInBackend.fulfilled, (state, action) => {
        const index = state.sheets.findIndex(s => s.id === action.payload.id);
        if (index !== -1) state.sheets[index].name = action.payload.name;
      })
      .addCase(deleteSheetThunk.fulfilled, (state, action) => {
        state.sheets = state.sheets.filter(sheet => sheet.id !== action.payload);
        if (state.activeSheetId === action.payload) state.activeSheetId = state.sheets[0]?.id || null;
      })
      .addCase(addCarToWatchlistThunk.fulfilled, (state, action) => {
        const activeSheet = state.sheets.find(sheet => sheet.id === state.activeSheetId);
        if (activeSheet) activeSheet.data.push({ car: action.payload.car });
      })
      .addCase(fetchCarsInWatchlist.fulfilled, (state, action) => {
        const sheet = state.sheets.find(s => s.id === action.payload.watchlistId);
        if (sheet) sheet.data = action.payload.cars;
      })
      .addCase(deleteCarFromWatchlistThunk.fulfilled, (state, action) => {
        const sheet = state.sheets.find(s => s.id === action.payload.watchlistId);
        if (sheet) sheet.data = sheet.data.filter(car => car.car.id !== action.payload.carId);
      });
  }
});

export const { moveCarBetweenStages, addCarToStage, deleteCarFromStage, updateCarInStage } = pipelineSlice.actions;
export const { addSheet, renameSheet, setActiveSheet, addCarToSheet, deleteSheet, deleteCarFromSheet, setWatchlistCars } = sheetsSlice.actions;

const store = configureStore({
  reducer: {
    pipeline: pipelineSlice.reducer,
    sheets: sheetsSlice.reducer,
  },
});

export default store;
