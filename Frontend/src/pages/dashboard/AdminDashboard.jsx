import React from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchTotalUsers } from '../../services/userApi';

function AdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalUsers'],
    queryFn: fetchTotalUsers,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const totalUsers = data?.count;
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
      </div>
    </section>
  );
}

export default AdminDashboard;
