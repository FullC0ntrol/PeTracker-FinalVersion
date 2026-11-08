import { createBrowserRouter } from 'react-router'

import UiGalleryPage from "./pages/dev/UiGalleryPage";
import PetProfilePage from './pages/owner/PetProfilePage'

import NotFoundPage from "./pages/public/NotFoundPage";
import LandingPage from "./pages/public/LandingPage";
import Placeholder from './pages/Placeholder';
import DashboardPage from './pages/owner/DashboardPage';
import LoginPage from './pages/public/LoginPage';
import CheckEmailPage from './pages/public/CheckEmailPage'

import PublicLayout from './components/layout/PublicLayout';
import RootLayout from './components/layout/RootLayout';
import FinderLayout from './components/layout/FinderLayout';
import OwnerLayout from './components/layout/OwnerLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <LandingPage />},
          { path: 'login', element: <LoginPage />},
          { path: 'login/sprawdz-poczte', element: <CheckEmailPage /> },
          { path: 'auth/verify', element: <Placeholder title="Weryfikacja logowania" />},
          { path: 'dev/ui', element: <UiGalleryPage />},
          { path: '*', element: <NotFoundPage />}
        ]
      },
      {
        path: 't/:tagId',
        element: <FinderLayout />,
        children: [
          { index: true , element: <Placeholder title="Strona tagu" />},
          { path: 'lokalizacja', element: <Placeholder title="Udostępnij lokalizację" />}
        ]
      },
      {
        // RequireAuth
        children: [
          {
            element: <OwnerLayout />,
            children: [
              { path: 'panel', element: <DashboardPage />},
              { path: 'zwierzeta/nowe', element: <Placeholder title="Nowe zwierzę" />},
              { path: 'zwierzeta/:id', element: <PetProfilePage />},
              { path: 'zwierzeta/:id/edytuj', element: <Placeholder title="Edycja zwierzęcia" />},
              { path: 'zwierzeta/:id/tag', element: <Placeholder title="Tag zwierzęcia" />},
              { path: 'ustawienia', element: <Placeholder title="Ustawienia" />}
            ]
          }
        ]
      }
    ]
  }
])