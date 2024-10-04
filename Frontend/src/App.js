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

  // Routes where the header should not be displayed
  const noHeaderRoutes = ['/login', '/admin', '/register', '/float'];

  // Routes where the footer should not be displayed
  const noFooterRoutes = [
    '/login',
    '/register',
    '/verify-email',
    '/checkout',
    '/payment/success',
    '/profile',
    '/profile/booking_history',
    '/float',
    // '/dorze_lodge',
  ];

  return (
    <>
      <ToastContainer />
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <Outlet />
      {!noFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
