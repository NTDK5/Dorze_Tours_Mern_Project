import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaSuitcase,
  FaClipboardList,
  FaMoneyBill,
  FaStar,
} from 'react-icons/fa';

function SideBarMenu() {
  return (
    <header className="h-screen sticky top-0 left-0 bg-[#273142] z-50 flex flex-col items-center py-[100px] text-white group hover:w-[200px] w-[60px] transition-all duration-300 ease-in-out">
      <div className="logo opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
        Dorze Tours
      </div>
      <nav className="w-full flex flex-col items-center justify-center mt-[50px] gap-2">
        <NavLink
          to={'/admin'}
          end
          className={({ isActive }) =>
            `w-full px-4 py-2 rounded-md flex items-center gap-4 transition-all duration-300 ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          <FaHome className="text-xl text-white flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            Dashboard
          </span>
        </NavLink>

        <NavLink
          to={'/admin/users'}
          end
          className={({ isActive }) =>
            `w-full px-4 py-2 rounded-md flex items-center gap-4 transition-all duration-300 ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          <FaUsers className="text-xl flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            Users
          </span>
        </NavLink>

        <NavLink
          to={'/admin/tours'}
          end
          className={({ isActive }) =>
            `w-full px-4 py-2 rounded-md flex items-center gap-4 transition-all duration-300 ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          <FaSuitcase className="text-xl flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            Tours
          </span>
        </NavLink>

        <NavLink
          to={'/admin/bookings'}
          end
          className={({ isActive }) =>
            `w-full px-4 py-2 rounded-md flex items-center gap-4 transition-all duration-300 ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          <FaClipboardList className="text-xl flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            Bookings
          </span>
        </NavLink>

        <NavLink
          to={'/admin/payments'}
          end
          className={({ isActive }) =>
            `w-full px-4 py-2 rounded-md flex items-center gap-4 transition-all duration-300 ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          <FaMoneyBill className="text-xl flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            Payments
          </span>
        </NavLink>

        <NavLink
          to={'/admin/reviews'}
          end
          className={({ isActive }) =>
            `w-full px-4 py-2 rounded-md flex items-center gap-4 transition-all duration-300 ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          <FaStar className="text-xl flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            Reviews
          </span>
        </NavLink>
      </nav>
    </header>
  );
}

export default SideBarMenu;
