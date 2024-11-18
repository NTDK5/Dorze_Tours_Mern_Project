import React, { useState, useEffect } from 'react';
import { FaCar, FaClock, FaUsers, FaStar } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchTotalTours } from '../../services/tourApi';
import { Link } from 'react-router-dom';
import LoadingScreen from '../../components/Loading';

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
    <section className="w-full flex items-center justify-center">
      <div className="flex flex-col lg:flex-row w-full lg:w-[70%]">
        {/* Filter Section */}
        <div className="w-full lg:w-1/3 p-4 mt-10">
          <h2 className="font-bold text-lg">Filter by Destination</h2>
          <div className="flex lg:flex-col flex-wrap gap-2">
            {uniqueDestinations.map((destination) => (
              <label key={destination} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedDestinations.includes(destination)}
                  onChange={() => handleDestinationChange(destination)}
                  className="mr-2 "
                />
                {destination}
              </label>
            ))}
          </div>

          <h2 className="font-bold text-lg mt-6">Filter by Duration</h2>
          <div className="flex flex-wrap lg:flex-col gap-2">
            {durations.map((duration) => (
              <label key={duration} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedDurations.includes(duration)}
                  onChange={() => handleDurationChange(duration)}
                  className="mr-2"
                />
                {duration}
              </label>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-2/3 p-4">
          <h2 className="font-bold text-2xl mb-4">Available Tours</h2>

          {isError && <p>Error fetching tours.</p>}
          <div className="w-full grid grid-cols-1 gap-4">
            {filterTours().map((tour) => (
              <Link
                to={`/tour/${tour._id}`}
                key={tour._id}
                className="flex flex-col sm:flex-row border rounded-lg shadow-lg w-full"
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}/${tour.imageUrl[0].replace(/\\/g, '/')}`}
                  alt={tour.title}
                  className="min-h-40 sm:w-[30%] object-cover rounded-md"
                />
                <div className="w-full sm:w-[70%] flex justify-between p-4 items-start gap-4">
                  <div className="w-full flex flex-col">
                    <div className="flex gap-2 items-center">
                      <div className="flex">
                        {renderStars(tour.averageRating)}{' '}
                      </div>
                      <p>{tour.totalRatings} reviews</p>
                    </div>
                    <h3 className="text-xl font-bold mt-2">{tour.title}</h3>

                    <div className="flex justify-between flex-wrap">
                      <div className="flex items-center mt-2">
                        <FaCar className="mr-2" />
                        <span>Transportation</span>
                      </div>

                      <div className="flex items-center mt-2">
                        <FaClock className="mr-2" />
                        <span>{tour.duration}</span>
                      </div>

                      <div className="flex items-center mt-2">
                        <FaUsers className="mr-2" />
                        <span>Family Plan</span>
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-lg w-[20%] flex items-center justify-end h-full">
                    ${tour.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourPackagesPage;
