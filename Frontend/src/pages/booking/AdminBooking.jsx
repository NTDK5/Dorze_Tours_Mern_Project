import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import BookingTable from '../../components/BookingTable';
import { useNavigate } from 'react-router-dom';

// Fetch function for bookings
const fetchTotalBookings = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/bookings`,
    {
      withCredentials: true,
    }
  );
  return data;
};

const AdminBookingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch bookings
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalBookings'],
    queryFn: fetchTotalBookings,
  });

  // Delete mutation
  const deleteBooking = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${process.env.REACT_APP_API_URL}/bookings/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['totalBookings']); // Refetch bookings after deletion
    },
  });

  // Handle delete function
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBooking.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  const bookingData = data || [];

  return (
    <section className="full flex flex-col text-white font-bold">
      <div className="w-full flex justify-between">
        <h1 className="text-4xl">Bookings</h1>
        <button
          className="py-2 px-6 bg-blue-500 rounded-md"
          onClick={() => navigate('/admin/create_booking')}
        >
          Create
        </button>
      </div>
      <div className="mt-[50px] flex w-full justify-between">
        <BookingTable data={bookingData} onDelete={handleDelete} />
      </div>
    </section>
  );
};

export default AdminBookingPage;
