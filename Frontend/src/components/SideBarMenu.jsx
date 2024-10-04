import React from 'react';
import { NavLink } from 'react-router-dom';

function SideBarMenu() {
  return (
    <header className="w-[10%] h-screen sticky top-0 left-0 bg-[#273142] z-50 flex flex-col items-center px-4 py-[100px] text-white">
      <div className="logo">Dorze Tours</div>
      <nav className="w-[100%] flex flex-col items-center justify-center mt-[50px] gap-2">
        <NavLink
          to={'/admin'}
          end
          className={({ isActive }) =>
            `w-[70%] px-4 py-2 rounded-md border-none text-left ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to={'/admin/users'}
          end
          className={({ isActive }) =>
            `w-[70%] px-4 py-2 rounded-md border-none ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          Users
        </NavLink>
        <NavLink
          to={'/admin/tours'}
          end
          className={({ isActive }) =>
            `w-[70%] px-4 py-2 rounded-md border-none ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          Tours
        </NavLink>
        <NavLink
          to={'/admin/bookings'}
          end
          className={({ isActive }) =>
            `w-[70%] px-4 py-2 rounded-md border-none ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          Bookings
        </NavLink>
        <NavLink
          to={'/admin/payments'}
          end
          className={({ isActive }) =>
            `w-[70%] px-4 py-2 rounded-md border-none ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          Payments
        </NavLink>
        <NavLink
          to={'/admin/reviews'}
          end
          className={({ isActive }) =>
            `w-[70%] px-4 py-2 rounded-md border-none ${
              isActive ? 'bg-[#4880FF]' : ''
            }`
          }
        >
          Reviews
        </NavLink>
      </nav>
    </header>
  );
}

export default SideBarMenu;
