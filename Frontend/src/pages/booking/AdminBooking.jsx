import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaSearch, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const fetchTotalBookings = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/bookings`,
    {
      withCredentials: true,
    }
  );
  return data;
};

const AdminBookingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalBookings'],
    queryFn: fetchTotalBookings,
  });

  const deleteBooking = useMutation({
    mutationFn: async (id) => {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/bookings/${id}`,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['totalBookings']);
    },
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, status }) => {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/bookings/${id}`,
        { status },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['totalBookings']);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBooking.mutate(id);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateBooking.mutate({ id, status: newStatus });
  };

  const filteredBookings = data?.filter((booking) => {
    const matchesSearch =
      booking.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || booking.bookingType === selectedType;
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-200 text-green-800';
      case 'cancelled':
        return 'bg-red-200 text-red-800';
      case 'refunded':
        return 'bg-purple-200 text-purple-800';
      default:
        return 'bg-yellow-200 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center p-4">
        Error fetching booking data
      </div>
    );
  }

  const renderBookingDetails = (booking) => {
    switch (booking.bookingType) {
      case 'Tour':
        return (
          <div>
            <span className="font-medium text-white">{booking.tour?.title}</span>
            <div className="text-sm text-gray-400">
              Date: {new Date(booking.bookingDate).toLocaleDateString()}
            </div>
          </div>
        );
      case 'Lodge':
        return (
          <div>
            <span className="font-medium text-white">{booking.lodge?.name}</span>
            <div className="text-sm text-gray-400">
              Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
              <br />
              Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
            </div>
          </div>
        );
      case 'Car':
        return (
          <div>
            <span className="font-medium text-white">
              {booking.car ? `${booking.car.brand} ${booking.car.model} (${booking.car.year})` : 'Car Unavailable'}
            </span>
            <div className="text-sm text-gray-400">
              Type: {booking.car?.transmission} | {booking.car?.fuelType} | {booking.car?.seats} seats
              <br />
              Pickup: {booking.pickupLocation}
              <br />
              Dropoff: {booking.dropoffLocation}
              <br />
              Duration: {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Booking Management</h1>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Tour">Tours</option>
          <option value="Lodge">Lodge</option>
          <option value="Car">Cars</option>
        </select>
        <select
          className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Booking Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredBookings?.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderBookingDetails(booking)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{booking.user?.first_name} {booking.user?.last_name}</div>
                  <div className="text-sm text-gray-400">{booking.user?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${getStatusColor(booking.status)}`}
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                  >
                    <option value="pending" className="bg-white text-gray-800">Pending</option>
                    <option value="confirmed" className="bg-white text-gray-800">Confirmed</option>
                    <option value="cancelled" className="bg-white text-gray-800">Cancelled</option>
                    <option value="refunded" className="bg-white text-gray-800">Refunded</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  ${booking.totalPrice?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-blue-400 hover:text-blue-500 mr-4"
                    onClick={() => navigate(`/admin/bookings/${booking._id}`)}
                  >
                    <FaEye className="text-xl" />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-500"
                    onClick={() => handleDelete(booking._id)}
                  >
                    <FaTrash className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookingPage;
