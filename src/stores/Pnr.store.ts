// Importing necessary dependencies from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Initial state for the PNR (Passenger Name Record) reducer
const initialState: {
  activePNR: any; // Stores the currently active PNR details
  activePNRDetails: {
    flightData: object[]; // Stores flight-related details
    paxInfo: object[]; // Stores passenger information
    rescheduleStatus: string; // Tracks the reschedule status of the PNR
  };
  modifyDates: any; // Stores modified dates for rescheduling
  showPNRDrawer: boolean; // Controls the visibility of the PNR drawer
  selectedPNRsForAction: {
    action?: string; // Stores the selected action for PNRs
    pnr?: []; // Stores selected PNRs for batch operations
  };
  selectedPassengers: object[]; // Stores selected passengers for actions like rescheduling
} = {
  activePNR: [], // Default empty PNR array
  activePNRDetails: {
    flightData: [], // Default empty flight data array
    paxInfo: [], // Default empty passenger info array
    rescheduleStatus: '' // Default empty reschedule status
  },
  modifyDates: undefined, // Default undefined modify dates
  showPNRDrawer: false, // Initially hides the PNR drawer
  selectedPNRsForAction: {}, // Default empty selection for PNR actions
  selectedPassengers: [] // Default empty selected passengers array
};

// Creating a Redux slice for managing PNR-related state
const PNRReducers = createSlice({
  name: 'PNRReducer', // Name of the slice
  initialState,
  reducers: {
    
    // Updates the currently active PNR
    updateActivePNR: (prevState, { payload }: PayloadAction<any>) => {
      prevState.activePNR = payload;
    },

    // Updates the details of the active PNR, including flight and passenger data
    updateActivePNRDetails: (prevState, { payload }: PayloadAction<any>) => {
      prevState.activePNRDetails = payload;
    },

    // Updates the visibility status of the PNR drawer
    updateShowPNRDrawer: (prevState, { payload }: PayloadAction<any>) => {
      prevState.showPNRDrawer = payload;
    },

    // Updates the selected PNRs for an action (e.g., cancel, modify, reschedule)
    updateSelectedPNRForAction: (prevState, { payload }: PayloadAction<any>) => {
      prevState.selectedPNRsForAction = payload;
    },

    // Updates modified dates for rescheduling PNRs
    updateModifyDates: (prevState, { payload }: PayloadAction<any>) => {
      prevState.modifyDates = payload;
    }
  }
});

// Exporting the reducer and actions for use in the application
export const {
  reducer: PNRReducer, // PNR reducer for store integration
  actions: { 
    updateActivePNR, // Action to update active PNR
    updateActivePNRDetails, // Action to update PNR details
    updateShowPNRDrawer, // Action to toggle PNR drawer visibility
    updateSelectedPNRForAction, // Action to update selected PNRs for action
    updateModifyDates // Action to update modified dates for rescheduling
  },
} = PNRReducers;
