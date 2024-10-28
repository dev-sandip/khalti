import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import Products from './pages/ProductPage.tsx';
import ProductDetails from './pages/ProductDetails.tsx';
import ErrorPage from './pages/Error.tsx';
import PaymentSuccess from './pages/Success.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Products />,
  }, {
    path: "/products/:id",
    element: <ProductDetails />,
  },
  {
    path: "/success",
    element: <PaymentSuccess />,
  },
  {
    path: "/error",

    element: <ErrorPage />

  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
