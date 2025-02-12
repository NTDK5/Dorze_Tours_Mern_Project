import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

const AdminPaymentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: payments, isLoading, isError } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments`, {
        withCredentials: true,
      });
      return data;
    },
  });

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
        Error fetching payment data
      </div>
    );
  }
  const handleDelete = async (paymentId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/payments/${paymentId}`, {
        withCredentials: true,
      });
      alert("Payment deleted successfully!");
      window.location.reload(); // Reload to fetch updated payments
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment");
    }
  };
  // const filteredPayments = payments.filter(payment =>
  //   payment.booking.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   payment.booking.user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="p-6 bg-gray-900 h-max">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Payment Management</h1>
        <div className="relative flex-2/3">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {payments.map(payment => (
              <tr key={payment?._id} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">
                    {payment?.booking?.user
                      ? `${payment.booking.user.first_name} ${payment.booking.user.last_name}`
                      : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">${payment?.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-semibold ${payment.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
                    {payment?.status}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(payment._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
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

export default AdminPaymentPage;