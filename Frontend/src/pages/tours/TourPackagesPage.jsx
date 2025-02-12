/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { FaCar, FaUsers, FaStar } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchTotalTours } from '../../services/tourApi';
import { Link } from 'react-router-dom';
import LoadingScreen from '../../components/Loading';
import heroimg from '../../assets/images/tour-hero.webp'
const TourPackagesPage = () => {
  const [selectedDestinations, setSelectedDestinations] = useState(['All']);
  const [selectedDurations, setSelectedDurations] = useState(['All']);
  useEffect(() => {
    document.title = 'Dorze Tours - Our Packages ';
  }, []);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalTours'],
    queryFn: fetchTotalTours,
  });

  const tourList = data || [];

  const uniqueDestinations = [
    'All',
    ...new Set(tourList.map((tour) => tour.destination)),
  ];

  const durations = ['All', '1 day', '3 days', '7 days'];

  const handleDestinationChange = (destination) => {
    if (destination === 'All') {
      setSelectedDestinations(['All']);
    } else {
      setSelectedDestinations((prev) =>
        prev.includes(destination)
          ? prev.filter((d) => d !== destination)
          : [...prev.filter((d) => d !== 'All'), destination]
      );
    }
  };

  const handleDurationChange = (duration) => {
    if (duration === 'All') {
      setSelectedDurations(['All']);
    } else {
      setSelectedDurations((prev) =>
        prev.includes(duration)
          ? prev.filter((d) => d !== duration)
          : [...prev.filter((d) => d !== 'All'), duration]
      );
    }
  };

  const filterTours = () => {
    return tourList.filter(
      (tour) =>
        (selectedDestinations.includes('All') ||
          selectedDestinations.includes(tour.destination)) &&
        (selectedDurations.includes('All') ||
          selectedDurations.includes(tour.duration))
    );
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

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={heroimg}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Ethiopian Tours"
        />
        <div className="relative z-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent">
              Ethiopian Adventures
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
            Discover ancient civilizations and natural wonders
          </p>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent mb-4">
                  Filter Tours
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Destinations</h3>
                    <div className="space-y-2">
                      {uniqueDestinations.map((destination) => (
                        <button
                          key={destination}
                          onClick={() => handleDestinationChange(destination)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedDestinations.includes(destination)
                            ? 'bg-[#F29404] text-white'
                            : 'hover:bg-[#FFDA32]/10'
                            }`}
                        >
                          {destination}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Duration</h3>
                    <div className="space-y-2">
                      {durations.map((duration) => (
                        <button
                          key={duration}
                          onClick={() => handleDurationChange(duration)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedDurations.includes(duration)
                            ? 'bg-[#F29404] text-white'
                            : 'hover:bg-[#FFDA32]/10'
                            }`}
                        >
                          {duration}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent mb-8">
                Available Tours
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterTours().map((tour) => (
                  <Link
                    to={`/tour/${tour._id}`}
                    key={tour._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${tour.imageUrl[0].replace(/\\/g, '/')}`}
                        alt={tour.title}
                        className="w-full h-48 object-cover"
                      />
                      <span className="absolute top-4 right-4 bg-[#FFDA32]/90 px-3 py-1 rounded-full text-sm font-semibold">
                        {tour.duration}
                      </span>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {renderStars(tour.averageRating)}
                          <span className="text-sm text-gray-500 ml-2">
                            ({tour.totalRatings})
                          </span>
                        </div>
                        <span className="text-lg font-bold text-[#F29404]">
                          ${tour.price}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold">{tour.title}</h3>

                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center text-sm text-gray-600">
                          <FaCar className="mr-2 text-[#F29404]" />
                          Transportation
                        </span>
                        <span className="flex items-center text-sm text-gray-600">
                          <FaUsers className="mr-2 text-[#F29404]" />
                          Family Plan
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TourPackagesPage;
