/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tourId, roomId, numberOfPeople, totalAmount, bookingId } =
    location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle successful payment
  const handlePaymentSuccess = (details) => {
    console.log('Payment successful:', details);

    navigate('/payment/success');
  };

  // Handle payment error
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setErrorMessage(
      'There was an issue processing your payment. Please try again.'
    );
  };

  const handlePaymentCancel = () => {
    setErrorMessage('Payment was cancelled.');
  };
  const createOrder = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const payload = tourId
        ? { bookingType: 'tour', tourId, totalAmount, bookingId }
        : { bookingType: 'lodge', roomId, totalAmount, bookingId };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/create`,
        payload,
        {
          withCredentials: true,
        }
      );
      setIsLoading(false);
      const { id } = response.data;
      console.log(response.data);
      return id;
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating PayPal order:', error);
      setErrorMessage('Failed to create PayPal order. Please try again.');
      return null;
    }
  };

  return (
    <div className="w-full h-[90vh] flex items-center justify-center">
      <div className="lg:w-[40%] w-[80%] bg-white shadow-lg rounded-md p-4 flex flex-col items-center">
        <h1 className="text-2xl font-bold my-5">Checkout</h1>
        {totalAmount ? (
          <>
            <p className="text-lg mb-4">Total Amount: ${totalAmount}</p>{' '}
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}
            <PayPalScriptProvider
              options={{
                'client-id':
                  'AQMqiHoeCykCYWXMZD73debxm35IPMYZhJPvT0xfOjP5yzv5x0RM9FfJH6eLvNlIDNW9mrIC2qkFCQ5J',
              }}
            >
              <PayPalButtons
                style={{ layout: 'vertical' }}
                createOrder={(data, actions) => {
                  return createOrder();
                }}
                onApprove={(data, actions) => {
                  return actions.order
                    .capture()
                    .then(handlePaymentSuccess)
                    .catch(handlePaymentError);
                }}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            </PayPalScriptProvider>
            {isLoading && (
              <p className="mt-4 text-blue-500">Processing your payment...</p>
            )}
          </>
        ) : (
          <p className="text-lg text-red-500">
            Missing booking information. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
