import { createSlice } from "@reduxjs/toolkit";

/* Type definition for request status names */
export type requestStatus =
  | "Requested"
  | "Fare Quoted"
  | "Accepted"
  | "Declined"
  | "Payment completed"
  | "Name list submitted"
  | "PNR Cancelled"
  | "Ticket issued";

/**
 * Type definition for the initial state structure.
 * The `requestDetail` object contains various request id with sub-objects
   that store data related to different aspects of a request.
 */
type initialStateType = {
  requestDetail: Record<
    string,
    {
      formValues?: Record<string, any>; // request from value
      requestInfo?: Record<string, any>; // Data for the main request details
      userResponse?: Record<string, any>; // Data for user responses
      payment?: Record<string, any>; // Payment-related information
      nameUpdate?: Record<string, any>; // Name update details
      ticketing?: Record<string, any>; // Ticketing information
      ancillary?: Record<string, any>; // Special Service Requests (SSR) data
      ancillaryPayment?: Record<string, any>; // Special Service Requests (SSR) payment related data
      status?: requestStatus;
    }
  >;
};

/* Request id localstorage key */
export const REQUEST_STORAGE_ID_KEY = "rid";

/**
 * The initial state of the slice.
 * It initializes the `requestDetail` object with empty data for all request ids.
 */
const initialState: initialStateType = {
  requestDetail: {},
};

/**
 * Slice for managing request details in the application.
 * This slice contains reducers to handle setting request data and cleaning up the state.
 */
const RequestDetailReducers = createSlice({
  name: "RequestDetailReducer", // Name of the slice
  initialState, // The initial state for the slice
  reducers: {
    /**
     * Updates the `requestDetail` object with new data.
     *
     * @param {initialStateType} prevState - The previous state of the slice.
     * @param {object} action - The action dispatched.
     * @param {string} action.payload.requestId - Request id.
     * @param {keyof initialStateType["requestDetail"][action.payload.key]} action.payload.key - The specific key in `requestDetail` to update.
     * @param {any} action.payload.data - The data to be set for the specified key.
     * @param {requestStatus} action.payload.status
     */
    setRequestData: (
      prevState: initialStateType,
      action: {
        payload: {
          requestId: string;
          key: keyof initialStateType["requestDetail"][string];
          data?: any;
          status: requestStatus;
        };
      }
    ) => {
      const { requestId, key, data, status } = action.payload;
      // Validation: Ensure all required fields are present
      if (!requestId || !key) {
        console.error("Invalid payload: requestId, key  are required.");
        return;
      }

      // Initialize `requestDetail[requestId]` if not present
      if (!prevState.requestDetail[requestId]) {
        prevState.requestDetail[requestId] = {
          formValues:{},
          requestInfo: {},
          userResponse: {},
          payment: {},
          nameUpdate: {},
          ticketing: {},
          ancillary: {},
          ancillaryPayment: {},
          status: "Payment completed",
        };
      }

      // Update the specific key with the provided data
      if (data) prevState.requestDetail[requestId][key] = data;
      prevState.requestDetail[requestId]["status"] = status;
    },
    /**
     * Resets the slice state to its initial state.
     * Useful for cleaning up the state when needed.
     *
     * @returns {initialStateType} - The reset initial state.
     */
    cleanUpSetting: () => {
      return initialState;
    },
  },
});

/**
 * Exporting the reducer and actions for use in the application.
 * - `RequestDetailReducer`: The reducer function for this slice.
 * - `setRequestData`: Action to update request data.
 * - `cleanUpSetting`: Action to reset the state to its initial state.
 */
export const {
  reducer: RequestDetailReducer,
  actions: { setRequestData, cleanUpSetting },
} = RequestDetailReducers;
