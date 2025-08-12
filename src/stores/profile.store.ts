// Importing necessary dependencies from Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// Initial state for the Profile reducer
const initialState: any = {
  currentListData: {} // Stores the current profile list data
};

// Creating a Redux slice for managing profile-related state
const ProfileReducers = createSlice({
  name: 'ProfileReducer', // Name of the slice
  initialState,
  reducers: {
    
    // Updates the current list data in the profile state
    setCurrentListData: (prevState, payload: any) => {
        console.log(payload); // Logs the payload for debugging purposes
        prevState.currentListData = payload; // Stores the provided payload in currentListData
    },

    // Resets the profile state by returning an empty object
    cleanUpSetting: () => {
      return {}; // Clears the state when called
    }
  },
  extraReducers: () => {} // Placeholder for extra reducers (if needed in the future)
});

// Exporting the reducer and actions for use in the application
export const {
  reducer: ProfileReducer, // Profile reducer for store integration
  actions: { 
    setCurrentListData, // Action to update current list data
    cleanUpSetting // Action to reset the profile state
  }
} = ProfileReducers;
