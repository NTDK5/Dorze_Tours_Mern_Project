/* eslint-disable no-unused-vars */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'leaflet/dist/leaflet.css';

import { Provider } from 'react-redux';
import store from './states/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import Admin from './pages/dashboard/Admin';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AllUsersPage from './pages/users/AllUsersPage';
import AdminToursPage from './pages/tours/AdminTours';
import CreateTourForm from './pages/tours/CreateTour';
import TourDetails from './pages/tours/TourDetailsPage';
import AdminBookingPage from './pages/booking/AdminBooking';
import AboutPage from './pages/about/AboutPage';
import TourPackagesPage from './pages/tours/TourPackagesPage';
import UserProfilePage from './pages/users/UserProfilePage';
import Profile from './pages/users/Profile';
import UserBookings from './pages/booking/UserBooking';
import RegisterPage from './pages/auth/RegisterPage';
import GoogleAuthHandler from './pages/googleAuthHandler';
import Checkout from './pages/payment/CheckoutPage';
import PaymentSuccess from './pages/payment/SucessPage';
import GalleryPage from './pages/gallery/GalleryPage';
import LodgePage from './pages/lodge/LodgePage';
import AdminPaymentPage from './pages/payment/AdminPaymentPage';
import VerifyEmailPage from './pages/EmailVerify';
import ErrorBoundary from './ErrorBoundary';
import CarRentalPage from './pages/cars/CarRentalPage';
const queryClient = new QueryClient();
import AdminCarsPage from './pages/admin/AdminCarsPage';
import AdminReviewsPage from './pages/reviews/AdminReviewsPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cars" element={<CarRentalPage />} />
      {/* <Route path="/cars/:id" element={<CarDetailsPage />} /> */}
      <Route path="/tour/:id" element={<TourDetails />} />
      <Route path="/about_us" element={<AboutPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/dorze_lodge" element={<LodgePage />} />
      <Route path="/our_packages" element={<TourPackagesPage />} />
      <Route path="/verify_email" element={<VerifyEmailPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/auth-success" element={<GoogleAuthHandler />} />
      <Route path="profile" element={<UserProfilePage />}>
        <Route index={true} element={<Profile />} />
        <Route path="booking_history" element={<UserBookings />} />
      </Route>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      {/* Admin routes */}
      <Route path="admin" element={<Admin />}>
        <Route index={true} element={<AdminDashboard />} />
        <Route path="users" element={<AllUsersPage />} />
        <Route path="tours" element={<AdminToursPage />} />
        <Route path="create_tour" element={<CreateTourForm />} />
        <Route path="bookings" element={<AdminBookingPage />} />
        <Route path="payments" element={<AdminPaymentPage />} />
        <Route path="cars" element={<AdminCarsPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
