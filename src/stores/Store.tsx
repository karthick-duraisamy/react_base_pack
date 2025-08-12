// Import necessary dependencies from Redux Toolkit and React
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { Provider } from "react-redux";
import { FC } from "react";

// Importing services for authentication, rescheduling, travel agency, and menus
import {
    CommonService,
    AuthService,
    RescheduleService,
    MenuService,
    EmailService,
    NotificationService,
    AdoService,
    ProjectService,
    GeneralProjectService,
    ChatBotSerice
} from "../services/Services";

// Importing middleware for handling service errors
import { serviceErrorLoggerMiddleware } from "./Service.middleware";

// Importing reducers for managing different slices of state
import { userReducer } from "./User.store";
// import { MenuReducer } from "./menu.store";
import { MenuReducer } from "./Menu.store";
import { SystemSettingsReducer } from "./SystemSettings.store";
import { initializerReducer } from "./Initializer.store";
import { ThemeReducer } from "./Theme.store";
import { GeneralReducer } from "./General.store";

// Configuring the Redux store
const store = configureStore({
    reducer: {
        user: userReducer, // Reducer for user-related state
        MenuReducer, // Reducer for handling menu state
        SystemSettingsReducer, // Reducer for system settings
        initializerReducer,
        GeneralReducer,
        ThemeReducer,

        // Injecting API services into the Redux store
        [AuthService.reducerPath]: AuthService.reducer,
        [CommonService.reducerPath]: CommonService.reducer,
        [RescheduleService.reducerPath]: RescheduleService.reducer,
        [MenuService.reducerPath]: MenuService.reducer,
        [EmailService.reducerPath]: EmailService.reducer,
        [NotificationService.reducerPath]: NotificationService.reducer,
        [AdoService.reducerPath]: AdoService.reducer,
        [ProjectService.reducerPath]: ProjectService.reducer,
        [GeneralProjectService.reducerPath]: GeneralProjectService.reducer,
        [ChatBotSerice.reducerPath]: ChatBotSerice.reducer, 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(serviceErrorLoggerMiddleware) // Custom middleware for logging service errors
            .concat(AuthService.middleware) // Middleware for authentication service
            .concat(CommonService.middleware) // Middleware for common services
            .concat(MenuService.middleware) // Middleware for menu services
            .concat(EmailService.middleware)
            .concat(RescheduleService.middleware)
            .concat(NotificationService.middleware)
            .concat(AdoService.middleware)
            .concat(ProjectService.middleware)
            .concat(GeneralProjectService.middleware)
            .concat(ChatBotSerice.middleware),
    devTools: true, // Enables Redux DevTools for debugging
});

// Type definitions for the Redux store
export type AppState = ReturnType<typeof store.getState>; // Infers the entire state shape
export type AppDispatch = typeof store.dispatch; // Type for dispatching actions

// Creating a provider component to wrap the application with Redux store
const AppStoreProvider: FC<ChildInterface> = (props) => {
    return <Provider store={store}>{props.children}</Provider>;
};

setupListeners(store.dispatch);

// Exporting the store and provider for usage in the application
export { AppStoreProvider, store };
