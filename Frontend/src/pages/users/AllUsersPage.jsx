import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTotalUsers } from '../../services/userApi'; // Update the path if needed
import UsersTable from '../../components/UserTable'; // Update the path if needed

const AdminDashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalUsers'],
    queryFn: fetchTotalUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  // The data should have a 'users' key based on the example response structure
  const userData = data?.users || [];
  console.log(userData);
  return (
    <section className="full flex flex-col text-white font-bold">
      <h1 className="text-4xl">Users</h1>
      <div className="mt-[50px] flex w-full justify-between">
        <UsersTable data={userData} />
      </div>
    </section>
  );
};

export default AdminDashboard;
