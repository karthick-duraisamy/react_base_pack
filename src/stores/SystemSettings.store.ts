// Import necessary dependencies from Redux Toolkit and application types
import { SystemSettingsType } from "@/services/initializer/InitializerTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state for system settings
const initialState: {
  CFG: SystemSettingsType; // Configuration object for system settings
  isTicketingSystem?: boolean; // Boolean flag to check if the system is a ticketing system
} = { 
  CFG: {} // Default empty configuration
};

// Create a Redux slice for system settings management
const reducer = createSlice({
  name: "SystemSettings", // Slice name
  initialState, // Initial state defined above
  reducers: {
    /**
     * Updates the system settings configuration.
     * @param {Object} state - Current state of the system settings.
     * @param {PayloadAction<any>} payload - New configuration data.
     */
    setSystemSettings: (state, { payload }: PayloadAction<any>) => {
      if (payload) state.CFG = payload;
    },

    /**
     * Updates the ticketing system configuration flag.
     * @param {Object} state - Current state of the system settings.
     * @param {PayloadAction<boolean>} payload - Boolean value to enable/disable ticketing system.
     */
    setTicketingSystemConfig: (state, { payload }: PayloadAction<boolean>) => {
      state.isTicketingSystem = payload;
    }
  },
  extraReducers: () => {}, // Placeholder for extra reducers if needed
});

// Exporting the reducer and actions for use in the Redux store
export const {
  reducer: SystemSettingsReducer, // Reducer for system settings
  actions: { setSystemSettings, setTicketingSystemConfig }, // Actions to update state
} = reducer;
