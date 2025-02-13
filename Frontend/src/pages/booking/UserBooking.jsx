import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaCar, FaHotel, FaCarSide, FaMapSigns } from 'react-icons/fa';
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
    const getTypeIcon = () => {
      switch (booking.bookingType) {
        case 'Tour': return <FaMapSigns className="text-[#F29404] text-2xl mr-2" />;
        case 'Lodge': return <FaHotel className="text-[#F29404] text-2xl mr-2" />;
        case 'Car': return <FaCarSide className="text-[#F29404] text-2xl mr-2" />;
        default: return <FaMapSigns className="text-[#F29404] text-2xl mr-2" />;
      }
    };

    return (
      <div className="flex items-start gap-4">
        <div className="bg-[#F29404]/10 p-3 rounded-xl">
          {getTypeIcon()}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent">
              {booking.bookingType} Booking
            </span>
          </div>

          {booking.bookingType === 'Tour' && booking.tour && (
            <>
              <Link
                to={`/tour/${booking.tour?._id}`}
                className="hover:text-[#F29404] transition-colors"
              >
                {booking.tour?.title}
              </Link>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                {booking.tour?.destination}
              </div>
            </>
          )}

          {booking.bookingType === 'Lodge' && booking.lodge && (
            <>
              <Link
                to={`/lodge/${booking.lodge?._id}`}
                className="hover:text-[#F29404] transition-colors"
              >
                {booking.lodge?.name}
              </Link>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                {booking.lodge?.location}
              </div>
            </>
          )}

          {booking.bookingType === 'Car' && booking.car && (
            <>
              <div className="text-gray-600">
                <FaCar className="mr-2 inline" />
                {booking.car?.brand} {booking.car?.model}
              </div>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                {booking.pickupLocation} → {booking.dropoffLocation}
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              {booking.bookingType === "Tour"
                ? new Date(booking.bookingDate).toLocaleDateString()
                : new Date(booking.checkInDate).toLocaleDateString()}
            </div>

            {booking.checkOutDate && (
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
                    className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
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
                    className="px-4 py-2 bg-red-100 text-red-800 text-sm rounded-lg hover:bg-red-200 transition duration-300"
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
