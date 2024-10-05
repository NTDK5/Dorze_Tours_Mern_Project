// components/TourCard.js
/* eslint-disable react/prop-types */

import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaCar, FaUserFriends, FaStar } from 'react-icons/fa';

const TourCard = ({ tour }) => {
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

  return (
    <Link to={`/tour/${tour._id}`} className="bg-white shadow-lg rounded-lg">
      <img
        className="w-full h-[200px] lg:h-[300px]  object-cover object-center"
        src={`https://dorze-tours.onrender.com/${tour.imageUrl[0].replace(/\\/g, '/')}`}
        alt={tour.title}
      />

      <div className="px-4 w-full mt-4">
        <h3 className="text-xl font-bold">{tour.title}</h3>
        <div className="flex mt-2 w-full items-center gap-1">
          <FaClock className="text-gray-700 p-0" />
          <p className="text-center text-gray-700">Duration {tour.duration}</p>
        </div>
        <div className="flex mt-2 w-full items-center gap-1">
          <FaCar className="text-gray-700 p-0" />
          <p className="text-center text-gray-700">Private Transport</p>
        </div>
        <div className="flex mt-2 w-full items-center gap-1">
          <FaUserFriends className="text-gray-700 p-0" />
          <p className="text-center text-gray-700">Family Plan</p>
        </div>
        <div className="w-full border-t-2 py-2 border-gray-50 flex items-end justify-between">
          <div className="flex flex-col items-center">
            <div className="flex">
              {renderStars(tour.averageRating)}{' '}
              {/* Render dynamic stars based on averageRating */}
            </div>
            <p>{tour.totalRatings} reviews</p> {/* Show total reviews */}
          </div>
          <div>
            <h2 className="font-semibold lg:text-2xl text-lg text-[#F29404]">
              ${tour.price}.00
            </h2>
            <p>Per Person</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
