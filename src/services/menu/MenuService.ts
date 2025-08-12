// Importing necessary types and services
import { ApiResponse } from "../ServiceTypes";
import { ChatBotSerice, MenuService } from "@/services/Services";
import {
  MenuRoutesInterface,
  MenuItem,
  MenuRequest,
} from "@/services/menu/MenuService.d";

const LocalMenuService1 = ChatBotSerice.enhanceEndpoints({}).injectEndpoints({
  endpoints: (build) => ({
    // Mutation to fetch unauthenticated menu routes
    getLocalUnAuthMenuRoutes1: build.mutation<
      ApiResponse<MenuRoutesInterface>,
      void
    >({
      query: () => "staticResponse/unauthMenuRoutes.json", // API endpoint for unauthorized user menu routes
    }),
    // Mutation to fetch authenticated menu routes
    getLocalAuthMenuRoutes1: build.mutation<
      ApiResponse<MenuRoutesInterface>,
      void
    >({
      query: () => "staticResponse/authMenuRoutes.json",
      // query: () => "authMenuRoutes/", // API endpoint for authenticated user menu routes
    }),
    getSystemSettings: build.mutation<ApiResponse<any>, void>({
      query: () => "staticResponse/systemSettings.json", // API endpoint to retrieve system settings
    }),
  }),
  overrideExisting: true, // Ensures existing endpoints are overridden if needed
});

// Exporting hooks for each mutation to be used in functional components
export const {
  useGetLocalAuthMenuRoutes1Mutation,
  useGetLocalUnAuthMenuRoutes1Mutation, 
  useGetSystemSettingsMutation // Hook to fetch authenticated menu routes
  // Hook to fetch unauthenticated menu routes
} = LocalMenuService1;

// Menu in commonService
const ApiMenuService = MenuService.enhanceEndpoints({}).injectEndpoints({
  endpoints: (build) => ({
    // getApiMenu: build.mutation<ApiResponse<MenuInterface[]>, void>({
    //     query: () => "menu"
    // }),
    getApiMenu: build.mutation<MenuItem[], MenuRequest>({
      query: (param) => {
        return {
          url: param.url,
        };
      },
    }),
  }),
  overrideExisting: true, // Ensures existing endpoints are overridden if needed
});

// Exporting hooks for each mutation to be used in functional components
export const { useGetApiMenuMutation } = ApiMenuService;
