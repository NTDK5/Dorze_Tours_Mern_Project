/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import {
  FaMapMarkerAlt,
  FaUserFriends,
  FaCalendar,
  FaClock,
  FaCar,
  FaStar,
  FaTree,
  FaUsers,
} from 'react-icons/fa';
import { destinationData } from '../../assets/data/destinationData';
import { testimonials } from '../../assets/data/testimonialData.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTotalTours } from '../../services/tourApi';
import TourCard from '../../components/TourCard';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import LoadingScreen from '../../components/Loading.jsx';
import HeroSection from '../../components/HeroSection.jsx';
import PageMeta from '../../components/PageMeta';

function HomePage() {
  useEffect(() => {
    document.title = 'Dorze Tours - Home ';
  }, []);
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

  const filteredTours = tourData.filter((tour) => tour.destination === filter);
  const filteredDestination = destinationData.find(
    (destination) => destination.name === filter
  );
  return (
    <>
      <PageMeta
        title="Dorze Tours - Authentic Ethiopian Experiences"
        description="Discover Ethiopia with Dorze Tours. Cultural tours, lodge stays, and car rentals for an authentic Ethiopian experience."
        keywords="Ethiopia tours, cultural experiences, Dorze Tours, Ethiopian travel"
      />
      <div className="relative flex flex-col items-center justify-center">
        <HeroSection />

        <section className=" w-[90%] md:w-[80%] flex flex-col md:flex-row items-center justify-center lg:transform lg:translate-y-[-50%] tran rounded-lg  bg-white shadow-md  lg:py-0 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between w-[90%] ">
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
              className="mt-4 w-full lg:w-max bg-[#FFDA32] text-white font-bold py-2 px-8 rounded-lg lg:px-12 shadow-[0_8px_20px_rgba(255,218,50,0.5)] transform transition-all duration-300 hover:shadow-[0_12px_24px_rgba(255,218,50,0.5)] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FFDA32]"
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
              Discover unique places around the world, from breathtaking
              landscapes to vibrant cities, and immerse yourself in unforgettable
              experiences.
            </p>
          </div>
          <div className="px-4 md:px-10 w-[90%] md:w-[70%] lg:w-[60%] flex flex-wrap justify-center gap-4 lg:gap-8 mt-10 md:mt-14">
            {destinationData?.map((destination, index) => (
              <button
                key={index}
                className={`border-2 rounded-full lg:px-6 px-4 py-2 text-sm md:text-base ${filter === destination.name
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
            <div className="w-[95%] md:w-[90%] bg-[#F9FDFF] flex flex-col gap-4 lg:gap-0 md:flex-row mt-6 py-16 px-4 md:px-6 transform translate-y-[-20%] md:translate-y-[-40%] shadow-lg">
              <div className="w-full md:w-[60%]">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                  Discover {filteredDestination.name}
                </h2>
                <p>{filteredDestination.description}</p>
              </div>
              <div className="w-full lg:w-[40%] flex flex-wrap gap-2">
                <div className="bg-white shadow-sm flex items-center gap-2 px-6 py-2 text-[#D176E0]">
                  <FaCar />
                  <p>Private Transport</p>
                </div>
                <div className="bg-white shadow-sm flex items-center gap-2 px-6 py-2 text-[#7BBCB0]">
                  <FaTree />
                  <p>Nature & Adventure</p>
                </div>
                <div className="bg-white shadow-sm flex items-center gap-2 px-6 py-2 text-[#FC3131]">
                  <FaMapMarkerAlt />
                  <p>Local Visit</p>
                </div>
                <div className="bg-white shadow-sm flex items-center gap-2 px-6 py-2 text-[#5C9BDE]">
                  <FaUsers />
                  <p>Family Trip</p>
                </div>
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

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Dorze Tours</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Authentic cultural experiences guided by local experts with sustainable tourism practices</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🏔</div>
                <h3 className="text-xl font-semibold mb-2">Unique Destinations</h3>
                <p className="text-gray-600">Access to remote communities and hidden natural wonders</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">👨👩👧👦</div>
                <h3 className="text-xl font-semibold mb-2">Local Experts</h3>
                <p className="text-gray-600">Guides born and raised in the regions we&apos;re visiting</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold mb-2">Sustainable Tourism</h3>
                <p className="text-gray-600">Community-focused travel that gives back</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-orange-500 text-white py-16 w-full">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready for Your Adventure?</h2>
            <p className="text-xl mb-8">Start planning your unforgettable Ethiopian experience today</p>
            <Link
              to="/our_packages"
              className="bg-white text-orange-500 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse All Tours
            </Link>
          </div>
        </section>

        <section className="w-full relative my-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image Section */}
              <div className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <img
                  className="w-full h-[500px] object-top object-cover transform transition-transform duration-500 group-hover:scale-105"
                  src="/assets/images/image 3.webp"
                  alt="Expert Guide"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-[#FFDA32]/90 px-4 py-2 rounded-full text-sm font-semibold text-gray-900">
                  🇪🇹 Certified Local Expert
                </span>
              </div>

              {/* Content Section */}
              <div className="space-y-6 lg:space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent">
                  Guided by Passion,<br />Informed by Heritage
                </h2>

                <div className="space-y-4">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Our guides aren't just experts - they're storytellers, historians,
                    and ambassadors of Ethiopian culture. With deep roots in their
                    communities, they transform tours into immersive journeys.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border-2 border-[#FFDA32]/20 hover:border-[#F29404] transition-colors">
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">Cultural Immersion</h3>
                      <p className="text-sm text-gray-500">Access to authentic local experiences</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border-2 border-[#FFDA32]/20 hover:border-[#F29404] transition-colors">
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">Safety First</h3>
                      <p className="text-sm text-gray-500">Certified wilderness first responders</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/our_packages"
                  className="inline-flex items-center px-8 py-4 bg-[#F29404] text-white rounded-xl font-bold hover:bg-[#DB8303] transition-colors shadow-lg hover:shadow-xl"
                >
                  Meet Our Guides
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Travelers Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from adventurers who've explored Ethiopia with us
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => {
                const initials = testimonial.name
                  .split(/[ .]+/)
                  .slice(0, 2)
                  .map(n => n[0])
                  .join('')
                  .toUpperCase();

                return (
                  <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-[#F29404] rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      "{testimonial.testimonial}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="w-full relative my-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image Section */}
              <div className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <img
                  className="w-full h-[500px] object-cover transform transition-transform duration-500 group-hover:scale-105"
                  src="https://public.vaolo.com/i/photo/large_4x3/eyJpZCI6IndwLWNvbnRlbnQvdXBsb2Fkcy8yMDE4LzEyL0J1bmdhbG93cy0yLTIuanBnIiwic3RvcmFnZSI6InN0b3JlIn0?signature=a215481c17c832225499705c39a82960e40f595e4df11b2dbf8c7373839b8333"
                  alt="Dorze Lodge"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-[#FFDA32]/90 px-4 py-2 rounded-full text-sm font-semibold text-gray-900">
                  🏆 Award-Winning Lodge
                </span>
              </div>

              {/* Content Section */}
              <div className="space-y-6 lg:space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent">
                  Experience the Heart<br />of Ethiopia
                </h2>

                <div className="space-y-4">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Discover the beauty and tranquility of Dorze Lodge, nestled in
                    the lush highlands. Escape the ordinary with stunning views,
                    traditional hospitality, and an unforgettable experience.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border-2 border-[#FFDA32]/20 hover:border-[#F29404] transition-colors">
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">Cultural Retreat</h3>
                      <p className="text-sm text-gray-500">Immerse in Dorze traditions</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border-2 border-[#FFDA32]/20 hover:border-[#F29404] transition-colors">
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">Nature Escapes</h3>
                      <p className="text-sm text-gray-500">Breathtaking mountain views</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/dorze_lodge"
                  className="inline-flex items-center px-8 py-4 bg-[#F29404] text-white rounded-xl font-bold hover:bg-[#DB8303] transition-colors shadow-lg hover:shadow-xl"
                >
                  Book Your Stay
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div >
    </>
  );
}

export default HomePage;