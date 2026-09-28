import { createBrowserRouter } from 'react-router'

import NotFoundPage from "./pages/public/NotFoundPage";
import LandingPage from "./pages/public/LandingPage";

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage />},
  { path: '*', element: <NotFoundPage />},
])