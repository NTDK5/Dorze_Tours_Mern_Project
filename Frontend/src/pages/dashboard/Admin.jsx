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
    <div className="admin-dashboard flex w-full justify-between min-h-screen bg-gray-900">
      <SideBarMenu />
      <div className="main-content flex w-[90%] min-h-full items-start justify-center py-[100px]">
        <div className="w-[90%] ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Admin;
