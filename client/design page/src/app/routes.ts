import { createBrowserRouter } from "react-router";
import Welcome from "./pages/onboarding/welcome";
import CreateAccount from "./pages/onboarding/create-account";
import HealthProfile from "./pages/onboarding/health-profile";
import EmergencyContacts from "./pages/onboarding/emergency-contacts";
import Permissions from "./pages/onboarding/permissions";
import ConnectWatch from "./pages/onboarding/connect-watch";
import SetupComplete from "./pages/onboarding/setup-complete";
import Dashboard from "./pages/dashboard";
import DashboardUpgraded from "./pages/dashboard-upgraded";
import FASTCheck from "./pages/fast-check";
import Education from "./pages/education";
import DeviceHub from "./pages/device";
import SOSScreen from "./pages/sos";
import RiskScore from "./pages/risk-score";
import History from "./pages/history";
import ContactsPage from "./pages/contacts";

export const router = createBrowserRouter([
  // Onboarding flow
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/welcome",
    Component: Welcome,
  },
  {
    path: "/auth/signup",
    Component: CreateAccount,
  },
  {
    path: "/auth/profile",
    Component: HealthProfile,
  },
  {
    path: "/auth/contacts",
    Component: EmergencyContacts,
  },
  {
    path: "/auth/permissions",
    Component: Permissions,
  },
  {
    path: "/auth/device",
    Component: ConnectWatch,
  },
  {
    path: "/auth/complete",
    Component: SetupComplete,
  },
  
  // Main app screens
  {
    path: "/dashboard",
    Component: DashboardUpgraded,
  },
  {
    path: "/fast-check",
    Component: FASTCheck,
  },
  {
    path: "/education",
    Component: Education,
  },
  {
    path: "/device",
    Component: DeviceHub,
  },
  {
    path: "/sos",
    Component: SOSScreen,
  },
  {
    path: "/risk-score",
    Component: RiskScore,
  },
  {
    path: "/history",
    Component: History,
  },
  {
    path: "/contacts",
    Component: ContactsPage,
  },
  
  // Legacy routes (redirect to new paths)
  {
    path: "/create-account",
    Component: CreateAccount,
  },
  {
    path: "/health-profile",
    Component: HealthProfile,
  },
  {
    path: "/emergency-contacts",
    Component: EmergencyContacts,
  },
  {
    path: "/permissions",
    Component: Permissions,
  },
  {
    path: "/connect-watch",
    Component: ConnectWatch,
  },
  {
    path: "/setup-complete",
    Component: SetupComplete,
  },
  {
    path: "/dashboard-mobile",
    Component: Dashboard,
  },
]);