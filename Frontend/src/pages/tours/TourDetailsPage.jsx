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
  FaUsers,
  FaHeart,
  FaShare,
  FaChevronRight,
} from 'react-icons/fa';
import TourCard from '../../components/TourCard';
import Reviews from '../../components/Reviews';
import { useSelector } from 'react-redux';
import LoadingScreen from '../../components/Loading';
import BookingWidget from '../../components/BookingWidget';
import ItineraryAccordion from '../../components/ItineraryAccordion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TourDetails = () => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
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
  useEffect(() => {
    document.title = `Dorze Tours - ${tour?.title}`;
  }, [tour]);
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
        bookingType: 'Tour',
        tourId: id,
        numberOfPeople,
        paymentMethod,
        notes,
        bookingDate,
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookings`,
        bookingData,
        {
          withCredentials: true,
        }
      );

      navigate('/checkout', {
        state: {
          booking: {
            _id: data._id,
            bookingType: "Tour",
            tourTitle: tour.title,
            checkInDate: bookingDate,
            checkOutDate: bookingDate,
            numberOfPeople: numberOfPeople,
            tourId: tour._id,
          },
          totalAmount: tour.price * numberOfPeople,
        },
      });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handlePaymentSuccess = (details) => {
    console.log('Payment successful:', details);
  };
  const handleSaveToWishlist = () => {
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

  if (loading) return <LoadingScreen />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gray-900">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="h-full"
        >
          {tour?.imageUrl?.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={`${process.env.REACT_APP_API_URL}/${img}`}
                alt={tour.title}
                className="w-full h-full object-cover opacity-90 z-2"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent p-6 z-10">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm text-gray-300 mb-2">
              <Link to="/our_packages" className="hover:text-[#FFDA32]">
                Tours
              </Link>
              <FaChevronRight className="inline-block mx-2 text-sm" />
              <span className="text-[#FFDA32]">{tour?.title}</span>
            </nav>
            <h1 className="text-4xl font-bold text-white">{tour?.title}</h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tour Details */}
        <div className="lg:col-span-2">
          {/* Highlights Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-[#F29404]">
                <FaStar className="mr-1" />
                <span className="font-semibold">{tour?.averageRating} ({tour?.totalRatings} reviews)</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Best Seller
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-[#F29404] mr-2" />
                <span className="font-medium">{tour?.destination}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="text-[#F29404] mr-2" />
                <span>{tour?.duration} Days</span>
              </div>
              <div className="flex items-center">
                <FaUsers className="text-[#F29404] mr-2" />
                <span>Group Size: {tour?.groupSize}</span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent">
                Tour Highlights
              </h3>
              <p className="text-gray-600 leading-relaxed">{tour?.description}</p>
            </div>
          </div>

          {/* Itinerary Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent">
              Detailed Itinerary
            </h3>
            <ItineraryAccordion itinerary={tour?.itinerary} />
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <Reviews tourId={tour?._id} tour={tour} />
          </div>
        </div>

        {/* Booking Widget Sidebar */}
        <div className="lg:col-span-1">
          <BookingWidget
            price={tour?.price}
            onBooking={handleContinue}
            onWishlist={handleSaveToWishlist}
            userInfo={userInfo}
            tour={tour}
          />
        </div>
      </div>

      {/* Related Tours */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TourData.map((tour, index) => (
            <TourCard
              tour={tour}
              key={index}
              className="transform transition duration-300 hover:scale-105"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TourDetails;
