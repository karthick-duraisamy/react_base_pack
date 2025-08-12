import { lazy } from "react";

// Layouts inported lazily
// This is to ensure that the layout components are loaded only when needed, improving performance
// and reducing the initial bundle size.
// This is particularly useful for large applications with multiple routes and layouts.
// Each layout is imported using React's lazy function, which allows for code-splitting.
// The layouts are then stored in a Map for easy access by their names.
// This approach allows for dynamic loading of layouts based on the route configuration.
// The layouts are expected to be React components that define the structure of the pages.
// The keys in the Map are the names of the layouts, and the values are the laz
const LandingLayout = lazy(() => import("@/layouts/Landing/Landing"));
const HomeLayout = lazy(() => import("@/layouts/Home/Home"));
const HomeHorizontalLayout = lazy(
  () => import("@/layouts/HomeHorizontal/HomeHorizontal")
);
const SearchLayout = lazy(() => import("@/layouts/SearchLayout/SearchLayout"));

const Layouts = new Map();
Layouts.set("LandingLayout", LandingLayout);
Layouts.set("HomeLayout", HomeLayout);
Layouts.set("HomeHorizontalLayout", HomeHorizontalLayout);
Layouts.set("SearchLayout", SearchLayout);



// Pages imported lazily
// This is to ensure that the page components are loaded only when needed, improving performance and reducing the initial bundle size.
// Each page is imported using React's lazy function, which allows for code-splitting.
// The pages are then stored in a Map for easy access by their names.
// This approach allows for dynamic loading of pages based on the route configuration.
// The pages are expected to be React components that define the content of the pages.
// The keys in the Map are the names of the pages, and the values are the lazily loaded components.
// This structure allows for a modular and scalable approach to managing routes and components in the application.
// The use of lazy loading helps in optimizing the application's performance by reducing the initial load time.


// The pages are categorized into unauthenticated and authenticated routes for better organization.
// UnAuthenticated routes
// These routes are for pages that do not require user authentication.
// They are typically used for landing pages, login, registration, and other public-facing features.
// The pages are imported lazily to optimize performance and reduce the initial bundle size.
// Each page is expected to be a React component that defines the content of the unauthenticated pages.
const Login = lazy(() => import("@/pages/Unauth/Login/Login"));

const LoginWithOTP = lazy(
  () => import("@/pages/Unauth/LoginWithOTP/LoginWithOTP")
);
const ForgotPassword = lazy(
  () => import("@/pages/Unauth/ForgotPassword/ForgotPassword.lazy")
);
const ResetPassword = lazy(
  () => import("@/pages/Unauth/ResetPassword/ResetPassword.lazy")
);

const Pages = new Map();
Pages.set("Login", Login);
Pages.set("LoginWithOTP", LoginWithOTP);
Pages.set("ForgotPassword", ForgotPassword);
Pages.set("ResetPassword", ResetPassword);

// Authenticated routes
// These routes are for pages that require user authentication.
// They are typically used for user dashboards, account management, and other authenticated features.
// The pages are imported lazily to optimize performance and reduce the initial bundle size.
// Each page is expected to be a React component that defines the content of the authenticated pages.
// The keys in the Map are the names of the pages, and the values are the lazily loaded components.
// This structure allows for a modular and scalable approach to managing authenticated routes in the application

const Dashboard = lazy(() => import("@/pages/Auth/Dashboard/Dashboard"));
const ComingSoon = lazy(() => import("@/components/ComingSoon/ComingSoon"));

Pages.set("Dashboard", Dashboard);
Pages.set("ComingSoon", ComingSoon);

export { Pages, Layouts };
