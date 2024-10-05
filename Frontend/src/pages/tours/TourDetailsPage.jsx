/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { fetchTourById } from '../../services/tourApi';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { fetchTotalTours } from '../../services/tourApi';
import { Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
  FaRegHeart,
  FaUndoAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
  FaStar,
  FaUserFriends,
  FaCalendar,
  FaCar,
} from 'react-icons/fa';
import TourCard from '../../components/TourCard';
import Reviews from '../../components/Reviews';
import { useSelector } from 'react-redux';

const TourDetails = () => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // This id represents the tour ID from the URL
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    const getTour = async () => {
      try {
        setLoading(true);
        const fetchedTour = await fetchTourById(id);
        setTour(fetchedTour);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTour();
  }, [id]);

  // Fetch tours
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalTours'],
    queryFn: fetchTotalTours,
  });
  const TourData = data ? data.slice(0, 3) : [];
  console.log(tour);
  const handleContinue = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      const bookingData = {
        bookingType: 'Tour', // Set booking type
        tourId: id,
        numberOfPeople,
        paymentMethod,
        notes,
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/bookings`,
        bookingData,
        {
          withCredentials: true, // Include cookies for authentication
        }
      );
      console.log(data);

      navigate('/checkout', {
        state: {
          totalAmount: tour.price * numberOfPeople,
          tourId: tour._id,
          numberOfPeople: numberOfPeople,
          bookingId: data._id,
        },
      });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handlePaymentSuccess = (details) => {
    // Handle successful payment capture here, e.g., save booking in the database
    console.log('Payment successful:', details);
  };
  const handleSaveToWishlist = () => {
    // Logic to handle saving to the wishlist
    console.log('Saved to wishlist');
  };

  const renderStars = (averageRating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(averageRating)) {
        stars.push(<FaStar key={i} className="text-yellow-500 text-sm" />);
      } else if (i < averageRating) {
        stars.push(<FaStar key={i} className="text-yellow-500 text-sm" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <section className="w-full flex flex-col items-center justify-center">
        {tour ? (
          <>
            <div className="w-[90%] mt-10">
              <h1 className="w-full text-left text-2xl lg:text-4xl font-bold">
                {tour.title}
              </h1>
              <div className="flex w-full mt-4 gap-4 items-center">
                <p className="text-[#778088] flex items-center justify-center">
                  <FaMapMarkerAlt />
                  {tour.destination}
                </p>
                <div className="flex items-center">
                  <div className="flex gap-2 items-center">
                    <div className="flex">
                      {renderStars(tour.averageRating)}{' '}
                    </div>

                    <p>{tour.averageRating}/5</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-[80%] w-full mt-20 flex flex-col items-center lg:flex-row  gap-20">
              <img
                className="lg:w-[70%] w-full lg:h-[600px] object-cover object-center"
                src={`${process.env.REACT_APP_API_URL}/${tour.imageUrl[0].replace(/\\/g, '/')}`}
                alt={tour.title}
              />
              <div className="lg:w-[25%] w-[80%] mt-6 lg:mt-0 bg-white shadow-lg rounded-md px-4 py-2">
                <h1 className="w-full text-xl text-black py-2 border-b-2 border-gray-50 font-semibold">
                  Bookings
                </h1>

                <form className="mt-4">
                  <div className="mt-4">
                    <label
                      htmlFor="bookingDate"
                      className="block font-semibold"
                    >
                      Select Date
                    </label>
                    <input
                      type="date"
                      id="bookingDate"
                      className="border p-2 rounded w-full bg-gray-100"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="numberOfPeople"
                      className="block font-semibold"
                    >
                      Number of People
                    </label>
                    <input
                      type="number"
                      id="numberOfPeople"
                      className="border p-2 rounded w-full bg-gray-100"
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="paymentMethod"
                      className="block font-semibold"
                    >
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      className="border p-2 rounded w-full bg-gray-100"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="credit card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="notes" className="block font-semibold">
                      Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      className="border p-2 rounded w-full bg-gray-100"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      maxLength="500"
                      placeholder="Any special requests or details..."
                    />
                  </div>
                  <div className="mt-6 flex flex-col gap-4">
                    <button
                      type="button"
                      className="bg-[#7BBCB0] text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                      onClick={handleContinue}
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="lg:w-[80%] w-full">
              {/* Features Section */}
              <div className="w-full">
                <div className="features w-full lg:w-[70%] bg-[#F8FAFC] flex flex-col items-center justify-center my-10 gap-4 py-10">
                  {/* Row 1 */}
                  <div className="w-[90%] flex flex-col md:flex-row justify-between gap-4">
                    {/* Free Cancellation */}
                    <div className="w-full md:w-[45%]">
                      <div className="w-full items-start py-2 flex gap-5">
                        <FaUndoAlt className="mt-2 text-[#d5212d]" />
                        <div>
                          <h1 className="text-[18px] text-top font-semibold">
                            Free Cancellation
                          </h1>
                          <p className="text-gray-400">
                            Cancel up to 24 hours in advance to receive a full
                            refund
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Health Precautions */}
                    <div className="w-full md:w-[45%]">
                      <div className="w-full items-start py-2 flex gap-5">
                        <FaMapMarkerAlt className="mt-2 text-[#d5212d]" />
                        <div>
                          <h1 className="text-[18px] font-semibold">
                            Health precautions
                          </h1>
                          <p className="text-gray-400">
                            Special health and safety measures apply. Learn more
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="w-[90%] flex flex-col md:flex-row justify-between gap-4">
                    {/* Mobile Ticketing */}
                    <div className="w-full md:w-[45%]">
                      <div className="w-full items-start py-2 flex gap-5">
                        <FaTicketAlt className="mt-2 text-[#d5212d]" />
                        <div>
                          <h1 className="text-[18px] text-top font-semibold">
                            Mobile ticketing
                          </h1>
                          <p className="text-gray-400">
                            Use your phone or print your voucher
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Duration */}
                    <div className="w-full md:w-[45%]">
                      <div className="w-full items-start py-2 flex gap-5">
                        <FaClock className="mt-2 text-[#d5212d]" />
                        <div>
                          <h1 className="text-[18px] font-semibold">
                            Duration {tour.duration}
                          </h1>
                          <p className="text-gray-400">
                            Check availability to see starting times.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="w-[90%] flex flex-col md:flex-row justify-between gap-4">
                    {/* Instant Confirmation */}
                    <div className="w-full md:w-[45%]">
                      <div className="w-full items-start py-2 flex gap-5">
                        <FaUndoAlt className="mt-2 text-[#d5212d]" />
                        <div>
                          <h1 className="text-[18px] text-top font-semibold">
                            Instant confirmation
                          </h1>
                          <p className="text-gray-400">
                            Don’t wait for the confirmation!
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Live Tour Guide */}
                    <div className="w-full md:w-[45%]">
                      <div className="w-full items-start py-2 flex gap-5">
                        <FaUndoAlt className="mt-2 text-[#d5212d]" />
                        <div>
                          <h1 className="text-[18px] font-semibold">
                            Live tour guide in English
                          </h1>
                          <p className="text-gray-400">English</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="lg:w-[70%] px-4 w-full mt-10">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700">{tour.description}</p>
              </div>

              {/* Activities Section */}
              <div className="lg:w-[70%] w-full mt-10">
                <h2 className="text-2xl font-bold mb-4">Activities</h2>
                <h3 className="text-xl font-semibold mb-2 ml-4">
                  Day {tour.itinerary[0].day}
                </h3>
                <ul className="list-disc pl-5 text-gray-700 ml-6">
                  {tour.itinerary[0].activities.map((activityItem) => (
                    <li key={activityItem._id} className="mb-2">
                      <span className="font-semibold">
                        {activityItem.time}:{' '}
                      </span>
                      {activityItem.activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <section className=" w-full lg:w-[80%] flex flex-col items-center justify-center py-10">
              <h1 className="text-2xl font-bold w-full text-left my-5">
                Related Tours
              </h1>
              <div className="w-[90%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TourData.length > 0 ? (
                  TourData.map((tour, index) => (
                    <TourCard tour={tour} key={index} />
                  ))
                ) : (
                  <p>No tours available.</p>
                )}
              </div>
            </section>
          </>
        ) : (
          <p>No tour found</p>
        )}
      </section>
      <section className="w-full flex items-center justify-center">
        <div className="lg:w-[80%] w-full">
          <Reviews tourId={tour?._id} tour={tour} />
        </div>
      </section>
    </>
  );
};

export default TourDetails;
