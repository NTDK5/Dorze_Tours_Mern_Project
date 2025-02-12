/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import { FaUserFriends, FaRoute, FaBookmark, FaCreditCard, FaStar, FaCar } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchTotalUsers } from '../../services/userApi';
import { fetchTotalTours } from '../../services/tourApi';
import {
  fetchTotalbooking,
  fetchTotalbookings,
} from '../../services/bookingApi';
import { fetchTotalPayments } from '../../services/paymentApi';
import { fetchTotalReviews } from '../../services/reviewsApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
  const {
    data: totalUsersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useQuery({
    queryKey: ['totalUsers'],
    queryFn: fetchTotalUsers,
  });

  const {
    data: totalToursData,
    isLoading: isToursLoading,
    isError: isToursError,
  } = useQuery({
    queryKey: ['totalTours'],
    queryFn: fetchTotalTours,
  });
  const {
    data: totalBookingsData,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
  } = useQuery({
    queryKey: ['totalbookings'],
    queryFn: fetchTotalbookings,
  });
  const {
    data: totalPaymentsData,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useQuery({
    queryKey: ['totalPayments'],
    queryFn: fetchTotalPayments,
  });
  const {
    data: totalReviewsData,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useQuery({
    queryKey: ['totalReviews'],
    queryFn: fetchTotalReviews,
  });
  const totalUsers = totalUsersData?.count;
  const totalTours = totalToursData?.length;
  const totalBookings = totalBookingsData?.length;
  const totalPayments = totalPaymentsData?.length;
  const TotalReviews = totalReviewsData?.totalReviews;
  console.log(totalPaymentsData);

  const statsCards = [
    {
      title: 'Total Users',
      value: totalUsersData?.count || 0,
      icon: <FaUserFriends />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Tours',
      value: totalToursData?.length || 0,
      icon: <FaRoute />,
      color: 'bg-green-500',
    },
    {
      title: 'Total Bookings',
      value: totalBookingsData?.length || 0,
      icon: <FaBookmark />,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Payments',
      value: totalPaymentsData?.length || 0,
      icon: <FaCreditCard />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Reviews',
      value: totalReviewsData?.totalReviews || 0,
      icon: <FaStar />,
      color: 'bg-red-500',
    },
  ];

  if (isUsersLoading || isToursLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-2">{stat.value}</h3>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Booking Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={totalBookingsData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="bookingDate" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line type="monotone" dataKey="totalPrice" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {(totalBookingsData || []).slice(0, 5).map((booking, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <FaBookmark className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">New Booking</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-white font-bold">${booking.totalPrice}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
