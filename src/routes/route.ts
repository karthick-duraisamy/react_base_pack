import { lazy } from "react";

//LAYOUTS
const LandingLayout = lazy(() => import("@/layouts/Landing/Landing"));
const PlanBLayout = lazy(() => import("@/layouts/planB/PlanB"));
const HomeLayout = lazy(() => import("@/layouts/Home/Home"));
const HomeHorizontalLayout = lazy(
  () => import("@/layouts/HomeHorizontal/HomeHorizontal")
);
const SearchLayout = lazy(() => import("@/layouts/SearchLayout/SearchLayout"));

//Unauth
const PlanB = lazy(() => import("@/pages/Unauth/PlanB/PlanB"));
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

//Auth
const Dashboard = lazy(() => import("@/pages/Auth/Dashboard/Dashboard"));
const PrePlannedDisruptionList = lazy(
  () => import("@/pages/Auth/PrePlannedDisruption/PrePlannedDisruptionList")
);

const AdhocDisruptionList = lazy(
  () => import("@/pages/Auth/AdhocDisruptionList/AdhocDisruptionList")
);
const ComingSoon = lazy(() => import("@/components/ComingSoon/ComingSoon"));

//LAYOUTS
const Layouts = new Map();
Layouts.set("LandingLayout", LandingLayout);
Layouts.set("PlanBLayout", PlanBLayout);
Layouts.set("HomeLayout", HomeLayout);
Layouts.set("HomeHorizontalLayout", HomeHorizontalLayout);
Layouts.set("SearchLayout", SearchLayout);

const Pages = new Map();
//Unauth
Pages.set("PlanB", PlanB);
Pages.set("Login", Login);
Pages.set("LoginWithOTP", LoginWithOTP);
Pages.set("ForgotPassword", ForgotPassword);
Pages.set("ResetPassword", ResetPassword);

//Auth
Pages.set("Dashboard", Dashboard);
Pages.set("PrePlannedDisruptionList", PrePlannedDisruptionList);
Pages.set("AdhocDisruptionList", AdhocDisruptionList);
Pages.set("ComingSoon", ComingSoon);

export { Pages, Layouts };
