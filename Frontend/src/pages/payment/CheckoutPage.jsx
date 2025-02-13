/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { initiatePayment } from '../../services/paymentService';
import { useSelector } from 'react-redux';

const Checkout = () => {
  const location = useLocation();
  const Navigate = useNavigate();
  const { booking, totalAmount } = location.state || {};
  console.log(booking)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const paymentData = {
        bookingType: booking.bookingType.toLowerCase(),
        tourId: booking.tourId,
        lodgeId: booking.lodgeId,
        carId: booking.car,
        roomId: booking.roomId,
        totalAmount: totalAmount,
        email: userInfo.email,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        bookingId: booking._id,
        tx_ref: `tx-${Date.now()}`,
        callback_url: `${window.location.origin}/payment/success`,
        return_url: `${window.location.origin}/payment/success`,
      };

      const response = await initiatePayment(paymentData);

      if (response.data && response.data.approvalUrl) {
        window.location.href = response.data.approvalUrl;
      } else {
        console.error('PayPal response:', response.data);
        throw new Error('PayPal approval URL not found in response');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const renderBookingDetails = () => {
    switch (booking.bookingType) {
      case 'tour':
        return (
          <>
            <div className="flex justify-between">
              <span>Tour:</span>
              <span>{booking.tourTitle}</span>
            </div>
            <div className="flex justify-between">
              <span>Destination:</span>
              <span>{booking.tour?.destination}</span>
            </div>
            <div className="flex justify-between">
              <span>Booking Date:</span>
              <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
            </div>
          </>
        );

      case 'lodge':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Lodge Name:</span>
              <span>{booking.tourTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Room Type:</span>
              <span>{booking.roomType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Check-in:</span>
              <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Check-out:</span>
              <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Number of Guests:</span>
              <span>{booking.numberOfPeople}</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Amount:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
      case 'Car':
        return (
          <>
            <div className="flex justify-between">
              <span>Car:</span>
              <span>{booking.carDetails?.brand} {booking.carDetails?.model}</span>
            </div>
            <div className="flex justify-between">
              <span>Pickup Location:</span>
              <span>{booking.pickupLocation}</span>
            </div>
            <div className="flex justify-between">
              <span>Dropoff Location:</span>
              <span>{booking.dropoffLocation}</span>
            </div>
            <div className="flex justify-between">
              <span>Pickup Date:</span>
              <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Return Date:</span>
              <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{booking.totalDays} days</span>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Checkout Details</h2>

          <div className="space-y-4">
            {renderBookingDetails()}

            <div className="flex justify-between">
              <span>Number of People:</span>
              <span>{booking.numberOfPeople}</span>
            </div>

            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="capitalize">{booking.paymentMethod}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total Amount:</span>
              <span>${totalAmount}</span>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-6 w-full bg-[#FFDA32] text-white py-3 px-4 rounded-md hover:bg-[#F29404] transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
