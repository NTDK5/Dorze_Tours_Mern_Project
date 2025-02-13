// components/TourCard.js
/* eslint-disable react/prop-types */

import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaUserFriends, FaStar } from 'react-icons/fa';

const TourCard = ({ tour }) => {
  const renderStars = (averageRating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-sm ${i < averageRating ? 'text-[#F29404]' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <Link
      to={`/tour/${tour._id}`}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
    >
      <div className="relative">
        <img
          className="w-full h-[200px] lg:h-[300px] object-cover"
          src={`${process.env.REACT_APP_API_URL}/${tour.imageUrl[0].replace(/\\/g, '/')}`}
          alt={tour.title}
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-[#FFDA32]/90 px-3 py-1 rounded-full text-sm font-semibold">
          {tour.duration}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">{tour.title}</h3>
          <span className="flex items-center gap-1">
            {renderStars(tour.averageRating)}
          </span>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <FaClock className="text-[#F29404]" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUserFriends className="text-[#F29404]" />
            <span>{tour.maxGroupSize}</span>
          </div>
        </div>

        <p className="text-gray-600 line-clamp-3">{tour.description}</p>

        <div className="flex items-center justify-between pt-4">
          <span className="text-2xl font-bold text-[#F29404]">
            ${tour.price}
            <span className="text-sm text-gray-500"> / person</span>
          </span>
          <button className="bg-[#F29404] text-white px-6 py-2 rounded-lg hover:bg-[#DB8303] transition-colors">
            View Tour
          </button>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
