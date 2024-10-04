/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import {
  FaMapMarkerAlt,
  FaUserFriends,
  FaCalendar,
  FaClock,
  FaCar,
  FaStar,
} from 'react-icons/fa';
import { destinationData } from '../../assets/data/destinationData';
import { testimonials } from '../../assets/data/testimonialData.js';
import ctaImage from '../../assets/images/Rectangle 158.png';
import image3 from '../../assets/images/image 3.png';
import lodgeImage from '../../assets/images/lodge.png';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTotalTours } from '../../services/tourApi';
import TourCard from '../../components/TourCard';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function HomePage() {
  const [verificationMessage, setVerificationMessage] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalTours'],
    queryFn: fetchTotalTours,
  });
  const tourData = data || [];
  const [filter, setFilter] = useState('Addis Ababa');
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = () => {
    if (!searchQuery) {
      toast.error('Please enter a destination to search');
      return;
    }
    setFilter(searchQuery);
  };
  // Filtered tours based on selected destination
  const filteredTours = tourData.filter((tour) => tour.destination === filter);
  const filteredDestination = destinationData.find(
    (destination) => destination.name === filter
  );

  return (
    <div className="relative flex flex-col items-center justify-center">
      <section className="hero-section relative top-[-8vh] left-0 w-full h-[104vh] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-white/70"></div>
        <div className="relative flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            We Find the Best Tour for You
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl lg:max-w-3xl">
            This is a paragraph in the center of the hero section. You can add
            more details here. This is a paragraph in the center of the hero
            section. You can add more details.
          </p>
          <Link
            to="/our_packages"
            className="mt-4 bg-[#FFDA32] text-white font-bold py-2 px-8 rounded-lg lg:px-12 shadow-[0_8px_20px_rgba(255,218,50,0.5)] transform transition-all duration-300 hover:shadow-[0_12px_24px_rgba(255,218,50,0.5)] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FFDA32]"
          >
            Book Now
          </Link>
        </div>
      </section>

      <section className="lg:absolute lg:top-[100vh] w-[90%] md:w-[80%] flex flex-col md:flex-row items-center justify-center rounded-lg lg:transform lg:-translate-y-[80%] bg-white shadow-md lg:py-0 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between w-[90%]">
          <div className="flex flex-col w-full md:w-1/3 mb-4 md:mb-0">
            <div className="flex items-center gap-2 justify-start py-2 px-4">
              <FaMapMarkerAlt className="text-[#F29404]" />
              <h4 className="text-lg font-semibold">Location</h4>
            </div>

            <div className="flex items-center w-full max-w-md mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Destination"
                className="w-full px-4 py-2 placeholder:text-gray-800 text-gray-700 bg-white border-b-2 border-white focus:outline-none focus:ring-0 shadow-none focus:border-b-2 focus:border-blue-700 transition duration-300 ease-in-out"
              />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/3 mb-4 md:mb-0">
            <div className="flex items-center gap-2 justify-start py-2 px-4">
              <FaUserFriends className="text-[#F29404]" />
              <h4 className="text-lg font-semibold">Guests</h4>
            </div>

            <div className="flex items-center w-full max-w-md mx-auto">
              <input
                type="text"
                placeholder="How Many Guests"
                className="w-full px-4 py-2 text-gray-800 placeholder:text-gray-800 bg-white border-b-2 border-white focus:outline-none focus:ring-0 shadow-none focus:border-b-2 focus:border-blue-700 transition duration-300 ease-in-out"
              />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/3">
            <div className="flex items-center gap-2 justify-start py-2 px-4">
              <FaCalendar className="text-[#F29404]" />
              <h4 className="text-lg font-semibold">Date</h4>
            </div>

            <div className="flex items-center w-full max-w-md mx-auto">
              <input
                type="text"
                placeholder="Pick a Date"
                className="w-full px-4 py-2 placeholder:text-gray-800 text-gray-700 bg-white border-b-2 border-white focus:outline-none focus:ring-0 shadow-none focus:border-b-2 focus:border-blue-700 transition duration-300 ease-in-out"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="mt-4 bg-[#FFDA32] text-white font-bold py-2 px-8 rounded-lg lg:px-12 shadow-[0_8px_20px_rgba(255,218,50,0.5)] transform transition-all duration-300 hover:shadow-[0_12px_24px_rgba(255,218,50,0.5)] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FFDA32]"
          >
            Search
          </button>
        </div>
      </section>
      <section className="relative w-full flex flex-col items-center justify-center py-10">
        <div className="flex flex-col w-[90%] md:w-[80%] lg:w-[60%] items-center justify-center text-center">
          <h1 className="text-2xl md:text-3xl font-bold">
            Explore Popular Destinations
          </h1>
          <p className="mt-4 text-base md:text-lg">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit.
          </p>
        </div>
        <div className="px-4 md:px-10 w-[90%] md:w-[70%] lg:w-[50%] flex flex-wrap justify-center gap-4 lg:gap-8 mt-10 md:mt-14">
          {destinationData?.map((destination, index) => (
            <button
              key={index}
              className={`border-2 rounded-full lg:px-6 px-4 py-2 text-sm md:text-base ${
                filter === destination.name
                  ? 'bg-[#F29404] text-white border-[#F29404]'
                  : 'bg-white text-gray-800 border-gray-600'
              }`}
              onClick={() => setFilter(destination.name)}
            >
              {destination.name}
            </button>
          ))}
        </div>
      </section>

      {filteredDestination && (
        <div className="w-[90%] md:w-[80%] lg:w-[60%] mt-10 flex flex-col justify-center items-center">
          <img
            className="w-full h-[300px] md:h-[400px] lg:h-[600px] object-cover object-center"
            src={filteredDestination.image}
            alt={filteredDestination.name}
          />
          <div className="w-[95%] md:w-[90%] bg-white flex flex-col md:flex-row mt-6 py-6 px-4 md:px-6 transform translate-y-[-20%] md:translate-y-[-40%] shadow-lg">
            <div className="w-full md:w-[60%]">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                Discover {filteredDestination.name}
              </h2>
              <p>{filteredDestination.description}</p>
            </div>
          </div>
        </div>
      )}

      <section className="relative lg:w-[60%] w-[80%] flex flex-col items-center justify-center py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.length > 0 ? (
            filteredTours.map((tour, index) => (
              <TourCard tour={tour} key={index} />
            ))
          ) : (
            <p>No tours available for {filter}</p>
          )}
        </div>
      </section>
      <section className="w-full h-max relative my-[100px]">
        <img
          className="object-cover object-center w-full h-[60vh] md:h-[70vh] lg:h-[80vh] z-10"
          src={ctaImage}
          alt="Background"
        />
        <div className="absolute w-full top-0 left-0 h-full bg-gradient-to-br from-[#48057D] to-[#2ADDE7] z-20 opacity-[80%] backdrop-blur-[25px]"></div>

        <div className="absolute w-full top-0 h-full flex items-center justify-center">
          <div className="w-[90%] md:w-[80%] lg:w-[70%] flex flex-col md:flex-row items-center justify-between">
            <img
              className="w-[30%] md:w-[40%] lg:w-[50%] object-center z-30 bg-cover bg-center"
              src={image3}
              alt="Guide"
            />
            <div className="w-full md:w-[50%] z-30 gap-4 md:gap-[30px] text-white flex flex-col items-start justify-center mt-6 md:mt-0">
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-wide">
                EXPERT GUIDES
              </h1>
              <p className="text-sm md:text-base">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint. Velit officia consequat duis enim velit mollit.
                Exercitation veniam consequat sunt nostrud amet. Amet minim
                mollit non deserunt ullamco est sit aliqua dolor do amet sint.
                Velit officia consequat duis enim velit mollit. Exercitation
                veniam consequat sunt nostrud amet.
              </p>
              <Link
                to="/our_packages"
                className="bg-[#FFDA32] text-white font-bold py-2 px-8 lg:px-12 rounded-lg shadow-[0_8px_20px_rgba(255,218,50,0.5)] transform transition-all duration-300 hover:shadow-[0_12px_24px_rgba(255,218,50,0.5)] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FFDA32]"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonial_section w-full h-min-screen flex items-center justify-center py-[100px] bg-[rgb(34, 34, 34)] lg:py-[200px]">
        <div className="testimonial_content w-full px-6 md:w-[90%] lg:w-[80%] flex flex-col items-center justify-center">
          <h1 className="lg:text-6xl text-4xl md:text-5xl text-center">
            What our clients say about us
          </h1>
          <p className="text-xl lg:text-2xl mt-3 text-gray-500">Testimonials</p>
          <div className="testimonial_list w-[100%] flex items-center justify-center flex-wrap mt-[100px] gap-[50px]">
            {testimonials.map((testimonial, index) => (
              <div
                className="testimonial_card w-[350px] h-[300px] border-[2px] border-dotted border-gray-200 p-[30px] text-left relative flex flex-col items-center"
                key={index}
                data-aos="fade-up"
                data-aos-duration="600"
              >
                <p>{testimonial.testimonial}</p>
                <div className="testimonial_profile absolute flex gap-[30px] border-dotted border-t-[2px] border-[#ffae00] bottom-[10px] w-[90%] py-[20px] px-[10px]">
                  <img
                    className="w-[50px] h-[50px] rounded-full "
                    src={testimonial.profileImg}
                  />
                  <div className="testimonial_info">
                    <h3>{testimonial.name}</h3>
                    <p>{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full h-max relative my-[100px]">
        <img
          className="object-cover object-center w-full h-[60vh] md:h-[70vh] lg:h-[80vh] z-10"
          src={ctaImage}
          alt="Background"
        />
        <div className="absolute w-full top-0 left-0 h-full bg-gradient-to-br from-[#48057D] to-[#2ADDE7] z-20 opacity-[80%] backdrop-blur-[25px]"></div>
        <div className="absolute w-full top-0 h-full flex items-center justify-center">
          <div className="w-[90%] md:w-[80%] lg:w-[70%] flex flex-col md:flex-row lg:gap-8 items-center justify-between">
            <img
              className="w-[60%] md:w-[40%] lg:w-[50%] object-center z-30 bg-cover bg-center"
              src={lodgeImage}
              alt="Guide"
            />
            <div className="w-full md:w-[50%] z-30 gap-4 md:gap-[30px] text-white flex flex-col items-start justify-center mt-6 md:mt-0">
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-wide">
                Experience the Heart of Ethiopia at Dorze Lodge
              </h1>
              <p className="text-sm md:text-base">
                Discover the beauty and tranquility of Dorze Lodge, nestled in
                the lush highlands of Ethiopia. Escape the ordinary with
                stunning views, traditional hospitality, and an unforgettable
                experience. Whether you seek adventure, culture, or relaxation,
                Dorze Lodge offers the perfect retreat. Book your stay today and
                immerse yourself in the vibrant heritage of the Dorze people.
              </p>
              <Link
                to="/dorze_lodge"
                className="bg-[#FFDA32] text-white font-bold py-2 px-8 lg:px-12 rounded-lg shadow-[0_8px_20px_rgba(255,218,50,0.5)] transform transition-all duration-300 hover:shadow-[0_12px_24px_rgba(255,218,50,0.5)] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FFDA32]"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
