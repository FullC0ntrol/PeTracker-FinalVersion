import { createBrowserRouter } from 'react-router'

import UiGalleryPage from "./pages/dev/UiGalleryPage";
import PetProfilePage from './pages/owner/PetProfilePage'

import NotFoundPage from "./pages/public/NotFoundPage";
import LandingPage from "./pages/public/LandingPage";
import Placeholder from './pages/Placeholder';
import DashboardPage from './pages/owner/DashboardPage';

import PublicLayout from './components/layout/PublicLayout';
import RootLayout from './components/layout/RootLayout';
import FinderLayout from './components/layout/FinderLayout';
import VetLayout from './components/layout/VetLayout';
import OwnerLayout from './components/layout/OwnerLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <LandingPage />},
          { path: 'login', element: <Placeholder title="Logowanie" />},
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
          { path: 'lokalizacja', element: <Placeholder title="Udostępnij lokalizację" />},
          { path: 'wyslano', element: <Placeholder title="Lokalizacja wysłana" />}
        ]
      },
      {
        path: 'vet/:shareToken',
        element: <VetLayout />,
        children: [{ index: true, element: <Placeholder title="Paszport medyczny" />}]
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
              { path: 'zwierzeta/:id/zaginiecie', element: <Placeholder title="Tryb zaginięcia" />},
              { path: 'zwierzeta/:id/vet-share', element: <Placeholder title="Udostępnienie weterynarzowi" />},
              { path: 'zwierzeta/:id/tag', element: <Placeholder title="Tag zwierzęcia" />},
              { path: 'spacery', element: <Placeholder title="Spacery" />},
              { path: 'spacery/nowy', element: <Placeholder title="Nowy spacer" />},
              { path: 'spacery/:id' , element: <Placeholder title="Szczegóły spaceru" />},
              { path: 'harmonogram', element: <Placeholder title="Harmonogram" />},
              { path: 'ustawienia', element: <Placeholder title="Ustawienia" />}
            ]
          }
        ]
      }
    ]
  }
])