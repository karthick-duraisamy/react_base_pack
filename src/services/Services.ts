// Importing the necessary tools from Redux Toolkit to create API slices
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { sessionStorageAccessor } from "@/utils/browserStorage";

const [ SgetStorageKey ] = sessionStorageAccessor<any>("airlineCode");
const encryptedTheme = SgetStorageKey();

// Set default values
let dynamic_baseUrl = import.meta.env.VITE_MOCK_API_URL;

if (encryptedTheme === "GF") {
  dynamic_baseUrl = import.meta.env.VITE_MOCK_API_GF_URL;
}

// Function to prepare headers by adding an authentication token to the request headers
const prepareHeader = (headers: Headers) => {
  // Retrieving the user object from localStorage
  const user = localStorage.getItem(
    import.meta.env.VITE_STORAGE_PREFIX + "user"
  ) as any;

  // If user exists, extract the token and set it in the headers
  if (user) {
    const token = JSON.parse(atob(user))?.token;
    token && headers.set("X-XSRF-TOKEN", token); // Adding the token to headers if it exists
  }
  return headers;
};

// AuthService API slice for handling authentication requests
const AuthService = createApi({
  reducerPath: "authApi", // Defining the slice name
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_AUTH_API_URL, // Base URL for authentication API
    credentials: "include", // To include cookies with the request
    prepareHeaders: prepareHeader, // Use the `prepareHeader` function to handle headers
  }),
  endpoints: () => ({}), // Placeholder for actual API endpoints (currently empty)
});

// EmailService API slice for handling email-related requests
const EmailService = createApi({
  reducerPath: "emailApi", // Defining the slice name
  baseQuery: async (args, api, extraOptions) => {
    // Custom query logic that includes token handling
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_MAIL_API_URL, // Base URL for the email API
      credentials: "include", // To include cookies with the request
      prepareHeaders: async (headers) => {
        try {
          const endPoint = import.meta.env.VITE_MAIL_API_URL;
          // Fetching a new token from the server for email API requests
          const tokenResponse = await fetch(
            `${endPoint?.substring(0, endPoint.lastIndexOf("/"))}/createtoken/`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                ...args.headers,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email_id: "superadmin@grmapi.com", // Email credentials for token generation
                password: "!NFI@$upeR", // Email password for token generation
              }),
            }
          );

          if (tokenResponse.ok) {
            const data = await tokenResponse.json();
            headers.set("Authorization", `Bearer ${data?.access}`); // Adding the new token to headers
          } else {
            throw new Error("Failed to refresh access token"); // Handling token refresh errors
          }
        } catch (error) {
          console.error(error); // Logging any errors
        }
      },
    })(args, api, extraOptions);

    return result; // Returning the result of the base query
  },
  endpoints: () => ({}), // Placeholder for actual API endpoints (currently empty)
});

// RescheduleService API slice for handling rescheduling-related requests
const RescheduleService = createApi({
  reducerPath: "rescheduleApi", // Defining the slice name
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // Base URL for the reschedule API
    credentials: "include", // To include cookies with the request
    prepareHeaders: prepareHeader, // Use the `prepareHeader` function to handle headers
  }),
  endpoints: () => ({}), // Placeholder for actual API endpoints (currently empty)
});

// CommonService API slice for handling common API requests
const CommonService = createApi({
  reducerPath: "CommonApi", // Defining the slice name
  baseQuery: fetchBaseQuery({
    baseUrl: dynamic_baseUrl,
    // credentials: "include", // To include cookies with the request
    prepareHeaders: prepareHeader
  }),
  endpoints: () => ({}), // Placeholder for actual API endpoints (currently empty)
});

// Define a service using a base URL
const ChatBotSerice = createApi({
  reducerPath: "GRMConfig",
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  endpoints: () => ({}),
});

// NotificationService API slice for handling push notification requests
const NotificationService = createApi({
  reducerPath: "notificationApi", // Defining the slice name
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUSH_API_URL, // Base URL for the notification API
    credentials: "include", // To include cookies with the request
    prepareHeaders: prepareHeader, // Use the `prepareHeader` function to handle headers
  }),
  endpoints: () => ({}), // Placeholder for actual API endpoints (currently empty)
});

// MenuService API slice for handling menu-related requests
const MenuService = createApi({
  reducerPath: "MenuServiceApi", // Defining the slice name
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_MENU_API_URL || "/", // Base URL for the menu API
    credentials: "include", // To include cookies with the request
    prepareHeaders: (headers) => {
      const user = localStorage.getItem("user");
      // If user exists, set the token in the headers
      if (user) {
        const token = JSON.parse(user)?.token;
        token && headers.set("X-XSRF-TOKEN", token);
      }
      return headers; // Returning the updated headers
    },
  }),
  endpoints: () => ({}), // Placeholder for actual API endpoints (currently empty)
});

const AdoService = createApi({
  reducerPath: "adoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: dynamic_baseUrl,
    // credentials: "include",
    prepareHeaders: prepareHeader,
  }),
  endpoints: () => ({}),
});

// ProjectService API slice for handling new project server creation
const ProjectService = createApi({
  reducerPath: "ProjectServiceApi", // Defining the slice name
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PROJECT_CREATION_API_URL, // Base URL
    credentials: "include", // To include cookies with the request
    prepareHeaders: (headers) => {
      const user = localStorage.getItem("user");
      // If user exists, set the token in the headers
      if (user) {
        const token = JSON.parse(user)?.token;
        token && headers.set("X-XSRF-TOKEN", token);
      }
      return headers; // Returning the updated headers
    },
  }),
  endpoints: () => ({}), // Placeholder for actual API endpoints (currently empty)
});

// GeneralProjectService API slice for handling new project server creation
const GeneralProjectService = createApi({
  reducerPath: "GeneralProjectServiceApi", // Defining the slice name
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL+"js", // Base URL
    credentials: "include", // To include cookies with the request
    prepareHeaders: (headers) => {
      const user = localStorage.getItem("user");
      // If user exists, set the token in the headers
      if (user) {
        const token = JSON.parse(user)?.token;
        token && headers.set("X-XSRF-TOKEN", token);
      }
      return headers; // Returning the updated headers
    },
  }),
  endpoints: () => ({}), // Placeholder for actual API endpoints (currently empty)
});

// Exporting all the created API slices for use in the application
export {
  RescheduleService,
  CommonService,
  ChatBotSerice,
  EmailService,
  AuthService,
  NotificationService,
  MenuService,
  AdoService,
  ProjectService,
  GeneralProjectService
};
