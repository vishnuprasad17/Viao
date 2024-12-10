
import ReactDOM from 'react-dom/client';
import ErrorBoundary from './pages/ErrorBoundary';
import App from './App';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import VendorApp from './pages/vendor/VendorApp';
import AdminApp from './pages/admin/AdminApp';
import Dashboard from './pages/admin/profile/Dashboard';
import AdminLogin from './pages/admin/auth/Login';
import AdminPrivateRoute from './pages/admin/AdminPrivateRoute';
import { ADMIN } from './config/routes/admin.routes';
import React from 'react';




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/*" element={<App/>} errorElement={<ErrorBoundary />}>
      <Route path="/*" element={<App />} />
    </Route>


      <Route path="/admin" element={<AdminApp />}>
        <Route index={true} path="/admin" element={<AdminLogin />}/>
        {/* Admin Private Routes */}
        <Route path="" element={<AdminPrivateRoute />}>
          <Route path={ADMIN.DASHBOARD} element={<Dashboard />} />
        </Route>
      </Route>

      <Route path="/vendor/*" element={<VendorApp />} />
      
    </>,
  ),
);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </PersistGate>
  </Provider>,
);
