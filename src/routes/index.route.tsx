/**
 * Title       : AppRoute component
 * Description : It manages the routing and navigation logic for the application.
 *               It dynamically loads components, handles authentication, checks for network connectivity and manages routing and layout components based on the authenticated state.
 */
import { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useGetApiMenuMutation,
  useGetLocalAuthMenuRoutes1Mutation,
  useGetLocalUnAuthMenuRoutes1Mutation,
  useGetSystemSettingsMutation,
} from "@/services/menu/MenuService";
import { useEventListener } from "@/hooks/EventListener.hook";
import { SystemSettingsType } from "@/services/initializer/InitializerTypes";
import { setSystemSettings } from "@/stores/SystemSettings.store";
import { RouterResponse } from "@/services/initializer/InitializerTypes";
import { useAppSelector } from "@/hooks/App.hook";
import { Layouts, Pages } from "@/routes/route";
import { Loader } from "@/components/Loader/Loader";
import NetworkConnection from "@/hooks/NetworkConnection.hook";
import PageNotFound from "@/pages/Unauth/PageNotFound/PageNotFound";
import {
  setActiveRoute,
  setDefaultRoute,
  setMenuAndRoute,
  setRoutePath,
} from "@/stores/Menu.store";
import { sessionStorageAccessor } from "@/utils/browserStorage";
import NoInternet from "@/pages/Unauth/NoInternet/NoInternet";
import { useAuth } from "@/hooks/Auth.hook";
import { useRedirect } from "@/hooks/Redirect.hook";
import CFG from "@/config/config.json";
import { AnimatePresence, motion } from "framer-motion";
import DisableDevtool from "disable-devtool";

/**
 * Type definitions for the config and current page state.
 */
interface CurrentPageState {
  layout: React.ComponentType<unknown>;
  page: React.ComponentType<unknown>;
}

/* Constants for route and redirect keys */
export const PREV_ROUTE_STORAGE_KEY = "pr"; // Previous route storage key to handle navigate(-1) functinality using 'previousPage' method
export const REDIRECT_ORDER_STORAGE_KEY = "ro"; // Key for storing route's order value

/**
 * AppRoute component manages application routing and dynamically renders
 * layouts and pages based on the active menu item. It connects to Redux for
 * menu state and uses lazy loading for components.
 *
 * @returns {JSX.Element} The application route JSX element.
 */
const AppRoute = () => {
  /* --- Hook variables --- */
  const dispatch = useDispatch();
  const isOnline = NetworkConnection(); // Hook for checking online status
  const { isAuthenticated } = useAuth(); // Hook to check if the user is authenticated
  // const isAuthenticated = true;
  const { currentPath, redirect } = useRedirect(); // Redirection hook

  /* --- Store variables --- */
  const { activeRoute, routePath } = useAppSelector(
    (state: any) => state.MenuReducer
  );

  /* --- State variables --- */
  const [routes, setRoutes] = useState<RouterResponse[] | null>(null); // Route path
  const [routesTemp, setRoutesTemp] = useState<RouterResponse[] | null>(null); // Route path temp
  const [isRouteValid, setIsRouteValid] = useState<boolean>(true); // Route status information
  const [pageLoading, setPageLoading] = useState(false); // variable to define page loading
  const [currentPage, setCurrentPage] = useState<CurrentPageState | any>(null); // Local state to manage the current page and layout

  // Storage hooks for local and session storage
  const [LgetPrevRoute, LsetPrevRoute] = sessionStorageAccessor(
    PREV_ROUTE_STORAGE_KEY
  ); // Set previous route in localStorage
  const [LgetLayout, LsetLayout] = sessionStorageAccessor("layout"); // Get layout from localStorage
  const [SgetAirlineCode, SsetAirlineCode] =
    sessionStorageAccessor("airlineCode");
  // const [ SgetFinalViewPnrData ] = sessionStorageAccessor<any>("finalViewPNRData");
  const SairlineCode =
    CFG.airline_code !== SgetAirlineCode()
      ? CFG.airline_code
      : SgetAirlineCode();
  SsetAirlineCode(SairlineCode);

  // Mutation hooks for fetching menu routes
  const [apiAuthMenuService, apiAuthMenuServiceResponse] =
    useGetApiMenuMutation(); // API auth menu
  const [localAuthMenuService, localAuthMenuServiceResponse] =
    useGetLocalAuthMenuRoutes1Mutation(); // Local auth menu
  const [unauthMenuService, unauthMenuServiceResponse] =
    useGetLocalUnAuthMenuRoutes1Mutation(); // Local unauth menu
  const [systemSettingsService] = useGetSystemSettingsMutation(); // Store system settings to Redux

  // Then choose which one to use based on your condition
  const authMenuService: any = CFG?.menu_mock_api
    ? localAuthMenuService
    : apiAuthMenuService;
  const authMenuServiceResponse = CFG?.menu_mock_api
    ? localAuthMenuServiceResponse
    : apiAuthMenuServiceResponse;

  // Other constants
  const SCROLL_DISPLAY_DELAY = 1000; // Scroll display delay

  // Fetch system settings on component mount
  useEffect(() => {
    systemSettingsService().then((response: any) => {
      const responseData: SystemSettingsType = (response?.data as any)?.response
        .data;
      dispatch(setSystemSettings(responseData)); // Store settings in Redux
    });
  }, []);

  /**
   * useEffect hook to fetch landing and authenticated routes based on authentication status.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated) {
          if (CFG?.menu_mock_api) {
            await authMenuService();
          } else {
            let menuUrl = `${import.meta.env.VITE_API_URL}`;
            await authMenuService({
              url: `${menuUrl?.slice(0, menuUrl.lastIndexOf("/"))}/menu/reschedule/`,
            });
          }
        } else {
          await unauthMenuService();
        }
      } catch (error) {
        console.error("Error fetching menu and routes:", error);
      }
    };

    if (isAuthenticated !== null) {
      setRoutes([]);
      // setRoutesTemp(null); // Clear old temp routes on auth change
      fetchData();
    }
  }, [isAuthenticated]);

  /**
   * useEffect hook to handle route data, menu service data & invalid redirects.
   * Sets the route data and dispatches menu service data to the Redux store.
   */
  useEffect(() => {
    let routeServiceData: any;

    if (
      isAuthenticated &&
      authMenuServiceResponse?.data &&
      (authMenuServiceResponse?.data as any)?.responseCode === 0 &&
      (authMenuServiceResponse?.data as any)?.response?.data
    ) {
      routeServiceData = (authMenuServiceResponse.data as any).response.data;
    } else if (
      !isAuthenticated &&
      unauthMenuServiceResponse?.data &&
      unauthMenuServiceResponse?.data.responseCode === 0 &&
      unauthMenuServiceResponse?.data.response?.data
    ) {
      routeServiceData = unauthMenuServiceResponse.data.response.data;
    } else {
      return; // no valid data
    }

    setRoutes(routeServiceData.route);
    dispatch(setMenuAndRoute(routeServiceData));
  }, [authMenuServiceResponse, unauthMenuServiceResponse, isAuthenticated]);

  /**
   * useEffect hook to show loader when route changes
   */
  useEffect(() => {
    setPageLoading(true);
  }, [routes]);

  /**
   * Effect to determine and set the current page and layout based on menu state.
   * Handles cases where the active or default menu is missing or invalid.
   */
  useEffect(() => {
    const handleNavigation = () => {
      // Exit if no route data available
      if (!routes?.length) return;
      try {
        let currentRoute: any;

        // Check if the path is in redirects, then find the default route
        if (!routePath) {
          currentRoute = routes.find((route: any) => route.default);
          // dispatch(setDefaultRoute(currentRoute));
          // throwing error if no path
          if (currentRoute?.path === undefined)
            throw new Error("Default route not configured");
        } else {
          // Find the current route based on path  
          if (
            (routePath === "/" || currentPath === "/") &&
            JSON.stringify(routes) !== JSON.stringify(routesTemp)
          ) {

            let defaultRoute:any;
            let LprevRoute: any = LgetPrevRoute();
            if (LgetPrevRoute() === "/viewPnrInfo") {
              currentRoute = routes.find(
                (route: any) =>
                  route.path.toLowerCase() === LprevRoute.toLowerCase()
              );
            } else {
              defaultRoute = routes.find((route: any) => route.default);
              if (!defaultRoute) throw new Error("Default route not configured");

              currentRoute = defaultRoute;
            }
            dispatch(setDefaultRoute(currentRoute));
            setRoutesTemp(routes);
            redirect(currentRoute.path);

            
            dispatch(setDefaultRoute(defaultRoute));
            setRoutesTemp(routes); // Update cache
            redirect(defaultRoute?.path); // Always use default for fresh start
            return;
          } else {
            if (isAuthenticated && !routesTemp?.length) setRoutesTemp(routes);
            currentRoute = routes.find(
              (route: any) =>
                route.path.toLowerCase() === currentPath.toLowerCase()
            );
          }

          if (!currentRoute) throw new Error("Route key not found");
        }

        // Set route validity flag
        setIsRouteValid(!!currentRoute);

        // setting layout and page information and appropriate component
        const routeLayout = currentRoute ? currentRoute.layout : LgetLayout();

        // Cache the current layout & path to local storage
        LsetLayout(routeLayout);
        if (activeRoute) LsetPrevRoute(activeRoute?.path);

        const layout = Layouts.get(routeLayout);
        const component = Pages.get(currentRoute?.component);

        if (!(layout || component)) {
          console.error(
            `Component(${currentRoute?.component}) or layout(${Layouts.get(
              currentRoute?.layout
            )}) is missing.`
          );
        }

        setCurrentPage({
          layout: layout,
          page: component,
        });

        // Adding routes to store for further usage in menu and other components
        dispatch(setActiveRoute(currentRoute));
        dispatch(setRoutePath(currentRoute.path));
      } catch (error) {
        // Informing the exceptions for dev environment
        if (import.meta.env.NODE_ENV === "development")
          console.warn(`Routes ${error}`);
        // Catch any errors and navigate safely to 404
        // redirect("404");
        // Set route validity flag
        setIsRouteValid(false);
      }
      setTimeout(() => {
        setPageLoading(false);
      }, 1000);
    };

    if (
      isAuthenticated !== null &&
      ((isAuthenticated && authMenuServiceResponse?.isSuccess) ||
        (!isAuthenticated && unauthMenuServiceResponse?.isSuccess)) &&
      routes?.length
    ) {
      handleNavigation();
    }
  }, [isAuthenticated, routes, currentPath, routePath]);

  /*
   * Toggles the scrollbar visibility on scroll events
   */
  const scrollbarToggle = () => {
    const body = document.body;
    let isScrolling: any;
    window.addEventListener("scroll", function () {
      body.classList.remove("hide-scrollbar");
      body.classList.add("show-scrollbar");
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(function () {
        body.classList.remove("show-scrollbar");
        body.classList.add("hide-scrollbar");
      }, SCROLL_DISPLAY_DELAY);
    });
  };

  // Adding scroll event listener
  useEventListener("scroll", scrollbarToggle, document);

  /* Initialize security monitoring for production environment */
  if (false && import.meta.env.NODE_ENV === "production")
    DisableDevtool({
      interval: 200,
      clearLog: false,
      url: "/security-error",
      timeOutUrl: "/security-error",
      detectors: [
        DisableDevtool.DetectorType.Debugger,
        DisableDevtool.DetectorType.Performance,
        DisableDevtool.DetectorType.DebugLib,
      ],
      ondevtoolopen() {
        redirect("/security-error"); // Redirect if devtool is opened
      },
      ignore: () => {
        return currentPath === "/security-error"; // Ignore when on security-error page
      },
    });

  // If page loading is enabled, then redirects to loader only
  if (pageLoading) return <Loader fallback={true} />;

  /**
   * Render logic:
   * Shows the loader if the current page is not determined or invalid.
   * Renders the NoInternet component if the user is offline.
   * Renders the PageNotFound component if the route is invalid.
   */
  return isOnline ? (
    <>
      {!isRouteValid ? (
        <PageNotFound /> // Render the 404 page if the route is invalid
      ) : currentPage ? (
        currentPage.layout ? (
          <currentPage.layout>
            <Suspense fallback={<Loader fallback={true} />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPath} // <- key forces unmount/mount
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <currentPage.page />{" "}
                  {/* Render the current page component with layout */}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </currentPage.layout>
        ) : (
          /* Load Page without layout if layout is not set */
          <Suspense fallback={<Loader fallback={true} />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPath} // <- key forces unmount/mount
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <currentPage.page />{" "}
                {/* Render the current page component without layout */}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        )
      ) : (
        <Loader /> // Show loader while the component is being loaded
      )}
    </>
  ) : (
    // </SessionTimeoutProvider>
    <NoInternet /> // Show NoInternet page if the user is offline
  );
};

export default AppRoute;
