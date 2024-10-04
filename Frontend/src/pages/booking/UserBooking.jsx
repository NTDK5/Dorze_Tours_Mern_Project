import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/bookings/user`,
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
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/bookings/${bookingId}`,
          {
            withCredentials: true,
          }
        );
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
      } catch (err) {
        console.error(
          'Error canceling booking:',
          err.response?.data?.message || err.message
        );
      }
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg mt-8 mx-auto max-w-4xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Booking History
      </h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:justify-between"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between md:w-full">
                {/* Display based on booking type */}
                {booking.bookingType === 'Tour' ? (
                  <Link
                    to={`/tour/${booking.tour?._id}`}
                    className="text-lg font-semibold text-[#1C2B38] mb-2 md:mb-0"
                  >
                    {booking.tour?.title}
                  </Link>
                ) : (
                  <Link
                    to={`/lodge/${booking.lodge?._id}`}
                    className="text-lg font-semibold text-[#1C2B38] mb-2 md:mb-0"
                  >
                    {booking.lodge?.name}
                  </Link>
                )}

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed'
                      ? 'bg-green-200 text-green-800 font-bold'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              {/* Display destination or location */}
              <div className="flex justify-between items-center text-gray-600 text-sm mb-2 md:mb-0 md:w-full">
                <div>
                  <FaMapMarkerAlt className="mr-2" />
                  {booking.bookingType === 'Tour'
                    ? booking.tour?.destination
                    : booking.lodge?.location}
                </div>
                <div>
                  {booking.bookingType === 'Tour' ? '' : booking.roomType}
                </div>
              </div>
              <div className="flex items-center justify-between text-gray-700 text-sm">
                <div className="flex items-center">
                  <FaUsers className="mr-2" /> {booking.numberOfPeople} People
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  {new Date(booking.createdAt).toLocaleDateString()}
                </div>
                <div className="font-semibold text-[#1C2B38]">
                  ${booking.totalPrice.toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => handleCancelBooking(booking._id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition duration-300"
              >
                Cancel Booking
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBookings;
