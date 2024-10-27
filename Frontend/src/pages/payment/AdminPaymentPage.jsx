import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { fetchTotalPayments } from '../../services/paymentApi';
import PaymentsTable from '../../components/PaymentTable';

const AdminPaymentPage = () => {
  const queryClient = useQueryClient();

  const {
    data: totalPaymentsData,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useQuery({
    queryKey: ['totalPayments'],
    queryFn: fetchTotalPayments,
  });
  const deleteBooking = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${process.env.REACT_APP_API_URL}/payment/${id}`, {
        withCredentials: true,
      });
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

  if (isPaymentsLoading) return <div>Loading...</div>;
  if (isPaymentsError) return <div>Error fetching data</div>;

  const paymentData = totalPaymentsData || [];

  return (
    <section className="full flex flex-col text-white font-bold">
      <div className="w-full flex justify-between">
        <h1 className="text-4xl">Bookings</h1>
      </div>
      <div className="mt-[50px] flex w-full justify-between">
        <PaymentsTable data={paymentData} onDelete={handleDelete} />
      </div>
    </section>
  );
};

export default AdminPaymentPage;
