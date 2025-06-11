import { createSlice, configureStore } from '@reduxjs/toolkit';

// Initial state with the simplified stages
const initialState = {
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
};

const pipelineSlice = createSlice({
  name: 'pipeline',
  initialState,
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
      state.stages[stage].push(car);
    },
    deleteCarFromStage: (state, action) => {
      const { stage, carId } = action.payload;
      state.stages[stage] = state.stages[stage].filter((car) => car.id !== carId);
    }
  },
});


export const { moveCarBetweenStages, addCarToStage, deleteCarFromStage } = pipelineSlice.actions;

const store = configureStore({
  reducer: {
    pipeline: pipelineSlice.reducer,
  },
});

export default store; // Ensure default export
