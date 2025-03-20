/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  FaLanguage,
  FaCreditCard,
  FaClock,
  FaCompass,
  FaMapMarkedAlt,
  FaTree,
  FaHandsHelping,
  FaUmbrellaBeach,
  FaMountain,
  FaSun,
  FaSchool,
} from 'react-icons/fa';
import MapComponent from '../../components/MapComponent';
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaMapMarker,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Ensure 'useNavigate' is imported
import footerImg from '../../assets/images/Footer_img.webp';
import LoadingScreen from '../../components/Loading';
import { useSelector } from 'react-redux';
import FormAuthGuard from '../../components/FormAuthGuard';

const lodgeFeatures = [
  {
    icon: FaTree,
    title: "Mountain Location",
    description: "Situated at 2800m elevation with panoramic views"
  },
  {
    icon: FaHandsHelping,
    title: "Community-Run",
    description: "Directly supports local Dorze families"
  },
  {
    icon: FaUmbrellaBeach,
    title: "Cultural Immersion",
    description: "Daily weaving demonstrations & traditional meals"
  },
  {
    icon: FaMountain,
    title: "Nature Trails",
    description: "Guided hikes through bamboo forests"
  },
  {
    icon: FaSun,
    title: "Sunset Views",
    description: "Spectacular views over Abaya & Chamo lakes"
  },
  {
    icon: FaSchool,
    title: "Local Support",
    description: "Funds community school projects"
  }
];

const LodgePage = () => {
  const [lodge, setLodge] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guests, setGuests] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'Dorze Lodge';
  }, []);
  const lodgeCoordinates = {
    latitude: 6.180743649457227,
    longitude: 37.57992938705831,
  };
  const googleMapsUrl = `https://www.google.com/maps?q=${lodgeCoordinates.latitude},${lodgeCoordinates.longitude}`;

  useEffect(() => {
    const fetchLodge = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/lodge`,
          {
            withCredentials: true,
          }
        );
        setLodge(data[0]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch lodge details.');
        setLoading(false);
      }
    };

    fetchLodge();
  }, []);
  const handleBooking = async (e) => {
    e.preventDefault();

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Ensure check-out is after check-in
    if (checkOut <= checkIn) {
      alert('Check-out date must be after check-in date');
      return;
    }

    const numberOfNights = Math.ceil(
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );

    const room = lodge.roomTypes.find((room) => room.type === selectedRoomType);

    // Safeguard for negative room price
    const totalAmount = room.price * numberOfNights;
    if (totalAmount <= 0) {
      alert('Invalid total price calculated');
      return;
    }

    const bookingData = {
      bookingType: 'Lodge',
      lodgeId: lodge._id,
      roomType: selectedRoomType,
      numberOfPeople: guests,
      checkInDate,
      checkOutDate,
      paymentMethod,
      notes: '',
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookings`,
        bookingData,
        {
          withCredentials: true,
        }
      );
      navigate('/checkout', {
        state: {
          booking: {
            _id: response.data._id,
            bookingType: "Lodge",
            tourTitle: lodge.name,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            numberOfPeople: guests,
            roomId: room._id,
            roomType: selectedRoomType,
            lodgeId: lodge._id,
          },
          totalAmount: totalAmount,
        },
      });
    } catch (err) {
      console.error('Error creating booking:', err);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={lodge.images[0]}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Dorze Lodge"
        />
        <div className="relative z-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent">
              {lodge.name}
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
            Authentic Cultural Experience in the Ethiopian Highlands
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Lodge Details */}
          <div className="space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent mb-6">
                Cultural Sanctuary
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {lodge.description}
              </p>

              {/* Room Types */}
              <div className="grid grid-cols-1 gap-4 mt-8">
                {lodge.roomTypes?.map((room) => (
                  <div key={room._id} className="p-6 bg-gray-50 rounded-xl border-2 border-[#FFDA32]/20 hover:border-[#F29404] transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{room.type}</h3>
                        <p className="text-[#F29404] text-lg font-bold mt-2">
                          ${room.price} <span className="text-gray-500 text-sm">/ night</span>
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {room.amenities.map((amenity, index) => (
                            <span key={index} className="bg-[#F29404]/10 text-[#F29404] px-2 py-1 rounded-full text-sm">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="bg-[#F29404]/10 text-[#F29404] px-3 py-1 rounded-full text-sm">
                        {room.availableRooms} rooms left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Unique Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {lodgeFeatures.map((feature, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-[#FFDA32]/10 transition-colors">
                    <feature.icon className="text-[#F29404] text-2xl mb-3" />
                    <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Location</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-600">
                  <FaMapMarker className="text-[#F29404] text-2xl" />
                  <p>{lodge.location}</p>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <FaPhone className="text-[#F29404] text-2xl" />
                  <a href={`tel:${lodge.contactInfo.phone}`} className="hover:text-[#F29404]">
                    {lodge.contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <FaEnvelope className="text-[#F29404] text-2xl" />
                  <a href={`mailto:${lodge.contactInfo.email}`} className="hover:text-[#F29404]">
                    {lodge.contactInfo.email}
                  </a>
                </div>
                <div className="w-full h-[400px] rounded-xl overflow-hidden">
                  <MapComponent />
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#F29404] hover:text-[#DB8303] transition-colors"
                >
                  <FaCompass className="mr-2" />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Lodge Gallery</h2>
              <div className="grid grid-cols-3 gap-4">
                {lodge.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="h-48 w-full object-cover rounded-xl"
                    alt={`Lodge view ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[#FFDA32]/20 hover:border-[#F29404] transition-colors lg:sticky lg:top-8">
            <h2 className="text-2xl font-bold mb-6">Book Your Stay</h2>
            <FormAuthGuard formTitle="lodge booking">
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="space-y-4">
                  <label className="block font-semibold">Guests</label>
                  <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#F29404] focus:ring-2 focus:ring-[#F29404]/20"
                    min="1"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block font-semibold">Check-in Date</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#F29404] focus:ring-2 focus:ring-[#F29404]/20"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block font-semibold">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#F29404] focus:ring-2 focus:ring-[#F29404]/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block font-semibold">Room Type</label>
                  <select
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#F29404] focus:ring-2 focus:ring-[#F29404]/20"
                  >
                    <option value="">Select Room Type</option>
                    {lodge.roomTypes?.map((room) => (
                      <option key={room._id} value={room.type}>
                        {room.type} (${room.price}/night)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#F29404] text-white font-bold rounded-xl hover:bg-[#DB8303] transition-colors shadow-lg hover:shadow-xl"
                >
                  Confirm Booking
                </button>
              </form>
            </FormAuthGuard>
          </div>
        </div>
      </div>
    </>
  );
};

export default LodgePage;
