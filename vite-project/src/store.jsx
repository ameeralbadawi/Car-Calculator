import { createSlice, configureStore } from '@reduxjs/toolkit';
import { fetchCarsFromBackend, updateCarStageInBackend, updateCarInBackend} from './pipelineThunks'; // import the thunk

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
  sheets: [
    { id: 1, name: 'Sheet 1', data: [] },
    { id: 2, name: 'Sheet 2', data: [] }
  ],
  activeSheetId: 1
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
      
      // Set status on top-level for quick access
      car.status = stage;
    
      // Also set status inside nested car.data object
      if (!car.data) {
        car.data = {};
      }
      car.data.status = stage;
    
      // Add the car to the appropriate stage
      state.stages[stage].push(car);
    },    
    deleteCarFromStage: (state, action) => {
      const { stage, carId } = action.payload;
      state.stages[stage] = state.stages[stage].filter((car) => car.id !== carId);
    },
    updateCarInStage: (state, action) => {
      const { stage, car: updatedCar } = action.payload;
      const stageIndex = state.stages[stage].findIndex(car => car.id === updatedCar.id);
      if (stageIndex !== -1) {
        state.stages[stage][stageIndex] = updatedCar;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarsFromBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarsFromBackend.fulfilled, (state, action) => {
        state.loading = false;
        // Reset stages to empty before loading new data
        for (const key in state.stages) {
          state.stages[key] = [];
        }
        // Distribute cars into stages based on nested status
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
      .addCase(updateCarStageInBackend.fulfilled, (state, action) => {
        const { vin, newStage } = action.payload;
        
      
        // Find the car in all stages and update its stage
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
      .addCase(updateCarInBackend.fulfilled, (state, action) => {
        const updatedCar = action.payload;
        const index = state.pipelineCars.findIndex(car => car.vin === updatedCar.vin);
        if (index !== -1) {
          state.pipelineCars[index] = updatedCar;
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
      const { id, newName } = action.payload;
      const sheet = state.sheets.find(s => s.id === id);
      if (sheet) {
        sheet.name = newName;
      }
    },
    setActiveSheet: (state, action) => {
      state.activeSheetId = action.payload;
    },
    addCarToSheet: (state, action) => {
      const { car } = action.payload;
      const activeSheet = state.sheets.find(sheet => sheet.id === state.activeSheetId);
      if (activeSheet) {
        activeSheet.data.push(car);
      }
    },
    deleteSheet: (state, action) => {
      const sheetId = action.payload;
      // Don't allow deleting the last sheet
      if (state.sheets.length > 1) {
        state.sheets = state.sheets.filter(sheet => sheet.id !== sheetId);
        // If we deleted the active sheet, set first sheet as active
        if (state.activeSheetId === sheetId) {
          state.activeSheetId = state.sheets[0].id;
        }
      }
    },
    deleteCarFromSheet: (state, action) => {
      const { carId } = action.payload;
      state.sheets.forEach(sheet => {
        sheet.data = sheet.data.filter(car => car.id !== carId);
      });
    }
  }
});

export const { moveCarBetweenStages, addCarToStage, deleteCarFromStage, updateCarInStage } = pipelineSlice.actions;
export const { addSheet, renameSheet, setActiveSheet, addCarToSheet, deleteSheet, deleteCarFromSheet } = sheetsSlice.actions;

const store = configureStore({
  reducer: {
    pipeline: pipelineSlice.reducer,
    sheets: sheetsSlice.reducer,
  },
});

export default store;