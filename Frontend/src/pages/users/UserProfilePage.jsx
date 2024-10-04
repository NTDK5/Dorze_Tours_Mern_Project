import React from 'react';
import { FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

const UserProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="w-full py-10 flex flex-col items-center">
      <h1 className="font-bold lg:text-3xl text-xl mb-5">My Profile</h1>
      <div className="w-full max-w-4xl shadow-lg rounded-lg flex flex-col md:flex-row lg:mt-10">
        <div className="md:w-1/3 border-b md:border-b-0 md:border-r-2 border-gray-200 lg:py-10 flex flex-col items-center">
          <div className="flex items-center justify-center lg:w-28 lg:h-28 w-20 h-20 rounded-full bg-gray-400 text-white text-4xl mb-4">
            <FaUser />
          </div>
          <h1 className="font-bold text-xl font-mulish text-[#1C2B38]">
            {userInfo.first_name} {userInfo.last_name}
          </h1>
          <div className="flex w-full justify-center gap-2 mb-4">
            <div className="flex px-3 items-center border-r-2 gap-1 text-[14px] border-gray-300 text-[#495560]">
              <FaMapMarkerAlt />
              {userInfo?.country}
            </div>
            <div className="flex px-3 items-center text-[14px] gap-1 text-[#495560]">
              <FaMapMarkerAlt />
              {userInfo?.role}
            </div>
          </div>
          <div className="w-full flex flex-col">
            <NavLink
              end
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? 'w-full flex py-[16px] pl-[30px] bg-[#7BBCB0] text-white'
                  : 'w-full flex py-[16px] pl-[30px] text-gray-600 hover:bg-gray-100'
              }
            >
              Profile Information
            </NavLink>
            <NavLink
              to="/profile/booking_history"
              className={({ isActive }) =>
                isActive
                  ? 'w-full flex py-[16px] pl-[30px] bg-[#7BBCB0] text-white'
                  : 'w-full flex py-[16px] pl-[30px] text-gray-600 hover:bg-gray-100'
              }
            >
              Booking History
            </NavLink>
          </div>
        </div>
        <div className="md:w-2/3  w-full lg:p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
