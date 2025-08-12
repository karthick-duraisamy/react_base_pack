// Importing necessary dependencies
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import {
//     MenuRoutesInterface,
//     RouterResponse,
//     MenuInterface,
// } from "@/services/MenuService/MenuService.d";

export interface RouterResponse {
    default?: boolean;
    component: string;
    path: string;
    route_id: number | string;
    layout: string;
    permission: string[];
}

export interface MenuInterface {
    name: string;
    menu_code: string;
    path: string;
    icon_name: string;
    subMenu?: SubMenuInterface[];
}

export interface SubMenuInterface {
    name: string;
    menu_code: string;
    parent_menu: string;
    path: string;
    icon_name?: string;
}

export interface MenuRoutesInterface {
    menu: MenuInterface[];
    route: RouterResponse[];
}

// Initial state for the menu reducer
const initialState: {
    routeData?: {}; // Stores both menu and route data
    menuServiceData?: any; // Stores menu data
    route?: []; // Stores route data
    local_menu?: any; // Stores locally available menu
    currentMenuData?: any; // Stores currently selected menu item
    currentSubMenuData?: any; // Stores currently selected sub-menu item
    
    defaultRoute: any;
    routePath: string;
    routeStore: RouterResponse[] | null;
    menuStore: MenuInterface[] | null;
    activeRoute: RouterResponse | null;
} = {
    defaultRoute: undefined,
    routePath: "",
    routeStore: null,
    menuStore: null,
    activeRoute: null,
};

// Creating a slice for managing menu-related state
const reducer = createSlice({
    name: "templateProject", // Name of the slice
    initialState,
    reducers: {
        
        setMenuAndRoute: (
            state,
            { payload }: PayloadAction<MenuRoutesInterface>
        ) => {
            if (payload) {
                state.routeStore = payload.route;
                state.menuStore = payload.menu;
            }
        },

        setDefaultRoute: (state,{ payload }: PayloadAction<any>) => {
            if (payload) {
                state.defaultRoute = payload;
            }
        },

        setActiveRoute: (state, { payload }: PayloadAction<RouterResponse>) => {
            if (payload) {
                state.activeRoute = payload;
            }
        },

        setRoutePath: (state, { payload }: PayloadAction<string>) => {
            state.routePath = payload;
        },

    },
    extraReducers: () => { }, // Placeholder for additional reducers if needed
});

// Exporting actions and reducer for use in the application
export const {
    reducer: MenuReducer, // Menu reducer for store integration
    actions: {
        setMenuAndRoute, 
        setActiveRoute, 
        setRoutePath,
        setDefaultRoute
    },
} = reducer;


// // Importing necessary dependencies
// import { SubMenuItem } from '@/services/menu/MenuService.d';
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// // Initial state for the menu reducer
// const initialState: {
//   routeData?: {}; // Stores both menu and route data
//   menuServiceData?: any; // Stores menu data
//   route?: []; // Stores route data
//   local_menu?: any; // Stores locally available menu
//   currentMenuData?: any; // Stores currently selected menu item
//   currentSubMenuData?: any; // Stores currently selected sub-menu item
//   manageBookingSubMenu: SubMenuItem[]; // Stores manage booking submenu items for workflow
//   workFlowLinkedList?: {
//     prev: null | SubMenuItem;
//     current: SubMenuItem;
//     next: SubMenuItem | null;
//   }[]; // Stores workflow linked list for navigation
//   buttonTextByOrder?: string; // Stores button text for the next route order
// } = {
//   manageBookingSubMenu: [],
// };

// // Creating a slice for managing menu-related state
// const reducer = createSlice({
//   name: "templateProject", // Name of the slice
//   initialState,
//   reducers: {
    
//     // Sets menu service data and updates menu and route states
//     setMenuServiceData: (state, { payload }: PayloadAction<any>) => {
//       if (payload) {
//         state.routeData = payload;
//         state.menuServiceData = payload.menu;
//         state.route = payload.route;
//       }
//     },

//     /* Stores manage booking sub-menu data for workflow functionality */
//     setManageBookingSubMenu: (state, { payload }: PayloadAction<any>) => {
//       if (payload) state.manageBookingSubMenu = payload;
//     },

//     /* Stores workflow linked list for workflow functionality */
//     setWorkflowLinkedList: (state, { payload }: PayloadAction<any>) => {
//       if (payload) state.workFlowLinkedList = payload;
//     },

//     // Sets route service data
//     setRouteServiceData: (state, { payload }: PayloadAction<any>) => {
//       if (payload) state.route = payload;
//     },

//     // Stores locally available menu data
//     setlocalMenuData: (
//       state,
//       { payload }: PayloadAction<{ local_menuData: any }>
//     ) => {
//       if (payload) {
//         state.local_menu = payload.local_menuData;
//       }
//     },

//     // Sets the currently selected menu and sub-menu data
//     setMenuSelectionData: (
//       state,
//       {
//         payload,
//       }: PayloadAction<{ currentMenuData: string; currentSubMenuData: string }>
//     ) => {
//       if (payload) {
//         state.currentMenuData = payload.currentMenuData;
//         state.currentSubMenuData = payload.currentSubMenuData;
//       }
//     },

//     /* Sets next route order button text based on current order */
//     setButtonTextByOrder: (state, { payload }: PayloadAction<string>) => {
//       if (payload) state.buttonTextByOrder = payload;
//     },
//   },
//   extraReducers: () => {}, // Placeholder for additional reducers if needed
// });

// // Exporting actions and reducer for use in the application
// export const {
//   reducer: MenuReducer, // Menu reducer for store integration
//   actions: {
//     setMenuServiceData, // Action to update menu service data
//     setManageBookingSubMenu, // Action to update manage booking submenu
//     setWorkflowLinkedList, // Action to update workflow linked list
//     setRouteServiceData, // Action to update route service data
//     setlocalMenuData, // Action to update local menu data
//     setMenuSelectionData, // Action to update menu selection
//     setButtonTextByOrder, // Action to update button text based on order
//   },
// } = reducer;