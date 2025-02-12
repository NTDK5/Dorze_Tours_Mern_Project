import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaCar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/bookings/user`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          }
        );
        setBookings(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`,
          { status: 'cancelled' },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          }
        );
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
      } catch (err) {
        console.error('Error canceling booking:', err.response?.data?.message || err.message);
      }
    }
  };

  const renderBookingDetails = (booking) => {
    switch (booking.bookingType) {
      case 'Tour':
        return (
          <>
            <Link
              to={`/tour/${booking.tour?._id}`}
              className="text-lg font-semibold text-[#1C2B38] mb-2 md:mb-0"
            >
              {booking.tour?.title}
            </Link>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="mr-2" />
              {booking.tour?.destination}
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              {new Date(booking.bookingDate).toLocaleDateString()}
            </div>
          </>
        );

      case 'Lodge':
        return (
          <>
            <Link
              to={`/lodge/${booking.lodge?._id}`}
              className="text-lg font-semibold text-[#1C2B38] mb-2 md:mb-0"
            >
              {booking.lodge?.name}
            </Link>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="mr-2" />
              {booking.lodge?.location}
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
            </div>
            <div>Room Type: {booking.roomType}</div>
          </>
        );

      case 'Car':
        return (
          <>
            <div className="text-lg font-semibold text-[#1C2B38] mb-2 md:mb-0">
              <FaCar className="inline mr-2" />
              {booking.car?.brand} {booking.car?.model}
            </div>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="mr-2" />
              Pickup: {booking.pickupLocation}
            </div>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="mr-2" />
              Dropoff: {booking.dropoffLocation}
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              From: {new Date(booking.checkInDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              To: {new Date(booking.checkOutDate).toLocaleDateString()}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg mt-8 mx-auto max-w-4xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Booking History</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between md:w-full">
                <div className="space-y-2">
                  {renderBookingDetails(booking)}
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`px-3 py-1 rounded-full w-max text-sm ${booking.status === 'confirmed'
                      ? 'bg-green-200 text-green-800 font-bold'
                      : booking.status === 'cancelled'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-yellow-200 text-yellow-800'
                      }`}
                  >
                    {booking.status}
                  </span>
                  <div className="font-semibold text-[#1C2B38]">
                    ${booking.totalPrice.toFixed(2)}
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-2" /> {booking.numberOfPeople} People
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-4">
                {booking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBookings;
