import axios from 'axios';

export const initiatePayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/payments/create-paypal-payment`,
      paymentData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Payment initialization failed'
    );
  }
};

export const verifyPayment = async (txRef) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/bookings/payment/verify/${txRef}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Payment verification failed'
    );
  }
};
