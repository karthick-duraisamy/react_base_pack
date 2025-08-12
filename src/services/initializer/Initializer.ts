// Importing necessary types and services
import { ApiResponse } from "../ServiceTypes";
import { CommonService } from "../Services";
import { RouterResponse } from "./InitializerTypes";

// Enhancing CommonService with additional tag types for caching and invalidation
const service = CommonService.enhanceEndpoints({
  addTagTypes: ["initializer"], // Tag used for caching and data invalidation related to system settings
}).injectEndpoints({
  endpoints: (build) => ({
    // Mutation to fetch system settings
    getSystemSettings: build.mutation<ApiResponse<RouterResponse[]>, void>({
      query: () => "systemSettings", // API endpoint to retrieve system settings
    }),
    // Mutation to update system settings
    updateSystemSettings: build.mutation<
      ApiResponse<RouterResponse[]>,
      { service: string; data: any }
    >({
      query: (putData) => ({
        url: "/", // API endpoint for updating system settings
        method: "PUT", // Using PUT method to update data
        body: putData, // Request body containing service name and updated data
      }),
      invalidatesTags: ["initializer"], // Invalidates cached data to ensure fresh data is fetched
    }),
  }),
  overrideExisting: true, // Ensures existing endpoints are overridden if needed
});

// Exporting hooks for each mutation to be used in functional components
export const {
  useGetSystemSettingsMutation, // Hook to fetch system settings
  useUpdateSystemSettingsMutation // Hook to update system settings
} = service;