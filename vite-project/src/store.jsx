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
      if (carIndex === -1) return; // Car not found

      // Update car status
      const car = state.stages[sourceStage][carIndex];
      car.status = destinationStage; // Update the car's status property

      // Move car between stages
      state.stages[sourceStage].splice(carIndex, 1); // Remove from source
      state.stages[destinationStage].push(car); // Add to destination
    },
    addCarToStage: (state, action) => {
      const { stage, car } = action.payload;
      car.status = stage; // Set the initial status when adding a car
      state.stages[stage].push(car); // Add car to the specified stage
    },
  },
});

export const { moveCarBetweenStages, addCarToStage } = pipelineSlice.actions;

const store = configureStore({
  reducer: {
    pipeline: pipelineSlice.reducer,
  },
});

export default store; // Ensure default export
