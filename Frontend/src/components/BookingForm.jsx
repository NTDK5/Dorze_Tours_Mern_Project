/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookingForm = ({ tour }) => {
  const { id } = useParams(); // Tour ID from the URL
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit card');
  const [notes, setNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        tour: id,
        numberOfPeople,
        totalPrice: tour.price * numberOfPeople, // Calculate total price
        paymentMethod,
        notes,
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/bookings',
        bookingData,
        {
          withCredentials: true,
        }
      );

      setBookingStatus('Booking confirmed!');
    } catch (error) {
      setError(
        error.response ? error.response.data.message : 'Booking failed.'
      );
    }
  };

  return (
    <form
      className="w-[25%] bg-white shadow-lg rounded-md px-4 py-2"
      onSubmit={handleBookingSubmit}
    >
      <h1 className="w-full text-xl text-black py-2 border-b-2 border-gray-50 font-semibold">
        Book this Tour
      </h1>

      <div className="mt-4">
        <label htmlFor="numberOfPeople" className="block font-medium">
          Number of People
        </label>
        <input
          type="number"
          id="numberOfPeople"
          className="border border-gray-300 p-2 rounded w-full"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value)}
          min="1"
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="paymentMethod" className="block font-medium">
          Payment Method
        </label>
        <select
          id="paymentMethod"
          className="border border-gray-300 p-2 rounded w-full"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="credit card">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bank transfer">Bank Transfer</option>
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="notes" className="block font-medium">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          className="border border-gray-300 p-2 rounded w-full"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength="500"
        ></textarea>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Confirm Booking
        </button>
      </div>

      {bookingStatus && <p className="mt-4 text-green-500">{bookingStatus}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </form>
  );
};

export default BookingForm;
