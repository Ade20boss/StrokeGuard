import { createBrowserRouter } from 'react-router';
import { Welcome } from './pages/Welcome';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { HealthProfile } from './pages/HealthProfile';
import { EmergencyContacts } from './pages/EmergencyContacts';
import { Permissions } from './pages/Permissions';
import { SmartwatchPairing } from './pages/SmartwatchPairing';
import { SetupComplete } from './pages/SetupComplete';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Welcome,
  },
  {
    path: '/signup',
    Component: SignUp,
  },
  {
    path: '/signin',
    Component: SignIn,
  },
  {
    path: '/health-profile',
    Component: HealthProfile,
  },
  {
    path: '/emergency-contacts',
    Component: EmergencyContacts,
  },
  {
    path: '/permissions',
    Component: Permissions,
  },
  {
    path: '/smartwatch-pairing',
    Component: SmartwatchPairing,
  },
  {
    path: '/setup-complete',
    Component: SetupComplete,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);