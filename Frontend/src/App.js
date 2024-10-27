import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  AOS.init();
  const location = useLocation();

  const noHeaderRoutes = ['/login', '/admin', '/register'];

  const noFooterRoutes = [
    '/login',
    '/register',
    '/verify-email',
    '/checkout',
    '/payment/success',
    '/profile',
    '/profile/booking_history',
  ];

  return (
    <>
      <ToastContainer />
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <Outlet />
      {!noFooterRoutes.includes(location.pathname) &&
        !location.pathname.startsWith('/admin') && <Footer />}
    </>
  );
}

export default App;
