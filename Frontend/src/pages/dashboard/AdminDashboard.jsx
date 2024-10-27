/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchTotalUsers } from '../../services/userApi';
import { fetchTotalTours } from '../../services/tourApi';
import {
  fetchTotalbooking,
  fetchTotalbookings,
} from '../../services/bookingApi';
import { fetchTotalPayments } from '../../services/paymentApi';
import { fetchTotalReviews } from '../../services/reviewsApi';

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
  if (isUsersLoading || isToursLoading) {
    return <div>Loading...</div>;
  }

  if (isUsersError || isToursError) {
    return <div>Error loading data</div>;
  }

  return (
    <section className="full flex flex-col text-white font-bold">
      <h1 className="text-4xl">Dashboard</h1>
      <div className="mt-[50px] flex w-full justify-between">
        <div className="w-[250px] rounded-[14px] bg-[#273142] h-[150px] py-2 px-4">
          <h3 className="text-gray-300">Total Users</h3>
          <div className="flex justify-between w-full">
            <h1 className="mt-[20px] text-3xl font-bold">{totalUsers}</h1>
            <div className="w-[60px] h-[60px] flex items-center justify-center bg-[#8280FF] rounded-[40%]">
              <FaUserFriends className="text-3xl" />
            </div>
          </div>
        </div>
        <div className="w-[250px] rounded-[14px] bg-[#273142] h-[150px] py-2 px-4">
          <h3 className="text-gray-300">Total Tours</h3>
          <div className="flex justify-between w-full">
            <h1 className="mt-[20px] text-3xl font-bold">{totalTours}</h1>
            <div className="w-[60px] h-[60px] flex items-center justify-center bg-[#8280FF] rounded-[40%]">
              <FaUserFriends className="text-3xl" />
            </div>
          </div>
        </div>
        <div className="w-[250px] rounded-[14px] bg-[#273142] h-[150px] py-2 px-4">
          <h3 className="text-gray-300">Total Bookings</h3>
          <div className="flex justify-between w-full">
            <h1 className="mt-[20px] text-3xl font-bold">{totalBookings}</h1>
            <div className="w-[60px] h-[60px] flex items-center justify-center bg-[#8280FF] rounded-[40%]">
              <FaUserFriends className="text-3xl" />
            </div>
          </div>
        </div>
        <div className="w-[250px] rounded-[14px] bg-[#273142] h-[150px] py-2 px-4">
          <h3 className="text-gray-300">Total Paymets</h3>
          <div className="flex justify-between w-full">
            <h1 className="mt-[20px] text-3xl font-bold">{totalPayments}</h1>
            <div className="w-[60px] h-[60px] flex items-center justify-center bg-[#8280FF] rounded-[40%]">
              <FaUserFriends className="text-3xl" />
            </div>
          </div>
        </div>
        <div className="w-[250px] rounded-[14px] bg-[#273142] h-[150px] py-2 px-4">
          <h3 className="text-gray-300">Total Reviews</h3>
          <div className="flex justify-between w-full">
            <h1 className="mt-[20px] text-3xl font-bold">{TotalReviews}</h1>
            <div className="w-[60px] h-[60px] flex items-center justify-center bg-[#8280FF] rounded-[40%]">
              <FaUserFriends className="text-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
