import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SideBarMenu from '../../components/SideBarMenu';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/');
    }
  }, [navigate, userInfo]);

  return (
    <div className="admin-dashboard flex w-full min-h-screen bg-[#1B2431]">
      {/* Admin Sidebar */}
      <SideBarMenu />

      {/* Main content where the nested routes will be rendered */}
      <div className="main-content flex w-[85%] min-h-full items-start justify-center py-[100px]">
        <div className="w-[90%] ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Admin;
