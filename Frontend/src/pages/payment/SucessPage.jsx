import React from 'react';
import { useNavigate } from 'react-router-dom';

import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleViewBooking = () => {
    navigate('/profile/booking_history');
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <FaCheckCircle className="text-green-500 text-6xl mb-4" />{' '}
      {/* Green check icon */}
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg mb-6">
        Your booking has been successfully completed.
      </p>
      <button
        onClick={handleViewBooking}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-600 transition duration-300"
      >
        View My Bookings
      </button>
    </div>
  );
};

export default PaymentSuccess;
