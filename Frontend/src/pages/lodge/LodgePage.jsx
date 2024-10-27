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
import footerImg from '../../assets/images/Footer_img.png';

const LodgePage = () => {
  const [lodge, setLodge] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guests, setGuests] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [bottomBoundary, setBottomBoundary] = useState(0);
  const navigate = useNavigate();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1024);
  const [stickyTop, setStickyTop] = useState(window.innerHeight * 0.1);
  const [isReady, setIsReady] = useState(false);
  const referenceRef = useRef(null);
  const floatingRef = useRef(null);
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
          totalAmount: totalAmount,
          roomId: room._id,
          numberOfPeople: guests,
          bookingId: response.data._id,
        },
      });
    } catch (err) {
      console.error('Error creating booking:', err);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full md:w-[80%] lg:w-[70%] flex flex-col items-center">
          <div className="w-full py-8 sm:py-12 md:py-16 flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-4xl ml-4 lg:ml-0 font-poppins font-[700] text-[#121210de]">
                {lodge.name}
              </h1>
              <p className="flex flex-col lg:flex-row lg:items-center px-2 text-gray-700 mt-4 gap-2">
                <div className="flex items-center">
                  {' '}
                  <FaMapMarker className="text-gray-500" /> Dorze, Ethiopia{' '}
                </div>

                <span className="text-gray-500 ">
                  You will be welcomed by{' '}
                  <span className="font-bold">Tsehai Bogale</span>
                </span>
              </p>
            </div>
            <div className="flex w-full lg:w-max py-6 px-2 lg:gap-8 z-30 items-center justify-between lg:justify-end lg:mt-0 lg:static lg:bg-none bg-white fixed bottom-0">
              <p className="font-mulish">
                From{' '}
                <span className="text-xl lg:text-2xl">
                  ${lodge.roomTypes?.[0]?.price}/
                </span>{' '}
                night
              </p>
              <a
                href="#book_form"
                className="bg-[#FFDA32]  text-white font-bold py-2 px-4 lg:px-12 rounded-lg shadow-[0_8px_20px_rgba(255,218,50,0.5)] transform transition-all duration-300 hover:scale-105 focus:outline-none"
              >
                Book Now
              </a>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4 max-h-[50vh]">
            <img
              className="w-full md:w-[60%] h-auto rounded-md object-cover"
              src={lodge?.images[0]}
              alt={lodge.name}
            />

            <div className="lg:flex justify-between flex-wrap w-[40%] hidden ">
              <img
                className="w-[49%] h-[49%] rounded-md object-cover object-center"
                src={lodge.images[1]}
              />
              <img
                className="w-[49%] h-[49%] rounded-md object-cover object-center"
                src={lodge.images[2]}
              />
              <img
                className="w-[49%] h-[49%] rounded-md object-cover object-center"
                src={lodge.images[0]}
              />
              <img
                className="w-[49%] h-[49%] rounded-md object-cover object-center"
                src={lodge.images[1]}
              />
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-between lg:items-start lg:flex-row mt-8">
            <div className="w-full lg:w-[60%] mt-10 px-4 lg:mt-0 lg:p-0">
              <div className="">
                <h1 className="text-xl lg:text-2xl font-poppins font-bold">
                  Description
                </h1>
                <p className="mt-2 font-mulish text-sm leading-6 text-[#121210de]">
                  {lodge.description}
                </p>
              </div>
              <div className="lg:self-start  mt-8">
                <h1 className="text-xl lg:text-2xl font-poppins font-bold">
                  Amenities
                </h1>
                <ul className="py-4 px-4 columns-2 md:columns-2 list-disc">
                  {lodge.roomTypes[2].amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
              <div className="lg:self-start mt-8">
                <h1 className="text-xl lg:text-2xl font-poppins font-bold">
                  Room Types
                </h1>
                <div className="mt-4 flex flex-col gap-4">
                  {lodge.roomTypes?.map((room) => (
                    <div
                      key={room._id}
                      className="relative bg-white shadow-lg rounded-lg overflow-hidden w-full flex flex-col lg:flex-row justify-between px-4 pb-8"
                    >
                      <img
                        src={lodge.images[1]} // Use the second image for the room card
                        alt={room.type}
                        className="w-full lg:w-48 h-36 object-cover rounded-lg mb-4 lg:mb-0"
                      />
                      <div className="px-4 lg:px-8 py-4 w-full">
                        <div className="w-full flex  lg:flex-row justify-between items-start lg:items-center">
                          <h2 className="text-xl font-bold">{room.type}</h2>
                          <button
                            className="absolute lg:static bottom-0 left-0 w-full mt-2 lg:mt-0 bg-[#FFDA32] lg:w-max text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-[#d4c02c] transition duration-300"
                            onClick={() => setSelectedRoomType(room.type)}
                          >
                            Select Room
                          </button>
                        </div>
                        <div className="mt-4 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
                          <p className="text-gray-600 mb-2 lg:mb-0">
                            {room.availableRooms} available
                          </p>
                          <p>
                            room price:{' '}
                            <span className="font-semibold text-lg">
                              ${room.price} / night
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 w-full  lg:self-start">
                <h1 className="text-2xl font-poppins font-bold">
                  Other Information
                </h1>
                <div className="w-full flex flex-col sm:flex-row justify-between py-6">
                  <div className="flex gap-6 mb-4 sm:mb-0">
                    <FaLanguage className="text-4xl sm:text-6xl text-[#d5212d81]" />
                    <div className="text-left">
                      <p>Language spoken by the team</p>
                      <h4 className="font-bold">English</h4>
                    </div>
                  </div>
                  <div className="flex gap-6 sm:w-[50%]">
                    <FaCreditCard className="text-3xl sm:text-4xl text-[#d5212d81]" />
                    <div className="text-left">
                      <p>Accepted methods of payment</p>
                      <h4 className="font-bold">
                        Paypal, Credit Card, Telebirr
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 w-full lg:self-start">
                <h1 className="text-2xl font-poppins font-bold">
                  Check-In and Check-Out
                </h1>
                <div className="w-full flex flex-col sm:flex-row justify-between py-6">
                  <div className="flex gap-6 mb-4 sm:mb-0">
                    <FaClock className="text-3xl sm:text-4xl text-[#d5212d81]" />
                    <div className="text-left">
                      <p>Check-In time</p>
                      <h4 className="font-bold">16h00</h4>
                    </div>
                  </div>
                  <div className="flex gap-6 sm:w-[50%]">
                    <FaClock className="text-3xl sm:text-4xl text-[#d5212d81]" />
                    <div className="text-left">
                      <p>Check-Out time</p>
                      <h4 className="font-bold">11h00</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10lg:self-start">
                <h1 className="text-2xl font-poppins font-bold">
                  Cancellation Policy
                </h1>
                <p className="mt-4">
                  Reservations made on Vaolo are subject to a standard
                  cancellation policy. Here are the fees that apply in the case
                  of a cancellation or a no-show on the part of the traveler.
                </p>
                <div className="grid mt-4 grid-cols-1 sm:grid-cols-[115px_auto] w-full p-3 gap-5 border-y-2 border-gray-100">
                  <div className="text-center">
                    <div className="font-bold">7 days</div>
                    <div>before the date</div>
                  </div>
                  <p>
                    No cancellation fees. Travellers can cancel their
                    reservation free of charge up to 7 days before their arrival
                    date.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[115px_auto] w-full p-3 gap-5 border-b-2 border-gray-200">
                  <div className="text-center">
                    <div className="font-bold">7 days</div>
                    <div>Up to 24 hours</div>
                  </div>
                  <p>
                    Travellers must pay 50% of the first night&apos;s stay and
                    50% of the first day&apos;s activity.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[115px_auto] w-full p-3 gap-5 border-b-2 border-gray-200">
                  <div className="text-center">
                    <div className="font-bold">Less than 24 hours</div>
                    <div>before the date</div>
                  </div>
                  <p>
                    Travellers must pay 100% of the first night&apos;s stay and
                    100% of the first day&apos;s activity.
                  </p>
                </div>
              </div>
              <div className="mt-10 lg:self-start ">
                <h1 className="text-2xl font-poppins font-bold">
                  Getting there
                </h1>
                <div className="w-full flex justify-between lg:flex-row flex-col">
                  <div className="">
                    <h1 className="text-xl font-bold mt-6">Dorze Lodge</h1>
                    <a
                      className="flex mt-4 px-6 py-2 border-[1px] border-[#d5212d81] items-center gap-3 rounded-lg"
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaCompass className="text-[#d5212d81]" />
                      GPS : 6.182277, 37.580566
                    </a>
                  </div>
                  <div className="lg:w-[50%] w-full">
                    <h1 className="text-xl font-bold mt-6">
                      Additional indications
                    </h1>
                    <p className="text-sm text-[#121210de] mt-4 font-mulish font-[400] leading-6 tracking-[0.2]">
                      From Addis Ababa, to Arba Minch, 1 hour by plane or about
                      7 hours by road (450 km).At 15 min from Arba Minch, take
                      the A7 road north towards Sodo, turn left to take a dirt
                      road, which goes up the mountain towards the village. The
                      lodge is about 30-45 minutes to the entrance of the
                      village.
                    </p>
                  </div>
                </div>
                <div className="w-full mt-8">
                  <MapComponent />
                </div>
              </div>
            </div>

            <div
              id="book_form"
              className="bg-white shadow-lg rounded-md p-4 w-[90%] lg:w-[35%] mt-6 h-max lg:mt-0  lg:sticky lg:top-[10vh] border-[1px] border-[#ffd9329a]"
            >
              <h1 className="text-lg lg:text-xl font-semibold">Bookings</h1>
              <form
                onSubmit={handleBooking}
                className="flex flex-col space-y-4"
              >
                <div className="mt-4 w-full">
                  <label
                    htmlFor="numberOfPeople"
                    className="block font-semibold"
                  >
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    id="numberOfPeople"
                    className="border p-2 rounded w-full bg-gray-100"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div className="mt-4 w-full">
                  <label htmlFor="bookingDate" className="block font-semibold">
                    Select Check In Date
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    required
                  />
                </div>
                <div className="mt-4 w-full">
                  <label htmlFor="bookingDate" className="block font-semibold">
                    Select Check Out Date
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    required
                  />
                </div>
                <div className="mt-4 w-full">
                  <label htmlFor="bookingDate" className="block font-semibold">
                    Select Room Type
                  </label>
                  <select
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    required
                  >
                    <option value="" disabled>
                      Select Room Type
                    </option>
                    {lodge.roomTypes?.map((room) => (
                      <option key={room._id} value={room.type}>
                        {room.type} - ${room.price} ({room.availableRooms}{' '}
                        available)
                      </option>
                    ))}
                  </select>
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
                <button
                  type="submit"
                  className="bg-[#FFDA32] text-white font-bold py-2 rounded-lg"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LodgePage;
