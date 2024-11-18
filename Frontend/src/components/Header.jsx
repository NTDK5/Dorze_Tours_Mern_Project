import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../services/authService';
import { logout } from '../states/slices/authSlice';
import { FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApiCall] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detect mobile view
  const menuRef = useRef(null); // Reference for the menu

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    // Close the menu if clicked outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Detect scroll and update the background color
  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Update mobile state on resize
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [location]);

  const noHeaderRoutes = ['/login', '/register', '/admin'];
  if (noHeaderRoutes.some((route) => location.pathname.startsWith(route))) {
    return null;
  }

  const isHomePage =
    location.pathname === '/' || location.search.includes('verified=true');

  const isActive = (path) => location.pathname === path;

  return (
    <header
      id="header"
      className={`top-0 w-full h-[8vh] p-4 z-50 sticky transition-all duration-300 ${
        isScrolled || !isHomePage || menuOpen
          ? 'bg-white text-black shadow-lg'
          : 'bg-transparent text-white'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="text-xl lg:text-3xl font-bold logo">
          <a href="/" className="font-mulish">
            <span className="font-bold text-black">
              <span className="text-[#D5212C]">Dor</span>
              <span>zeT</span>
              <span className="text-[#F29404]">ours</span>
            </span>
          </a>
        </div>

        {/* Hamburger icon */}
        <div className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </div>

        {/* Navigation Menu */}
        <nav
          ref={menuRef}
          className={`md:flex items-center space-x-8 transition-all duration-300  lg:bg-white/30 border border-white/20  backdrop:blur-lg  rounded-[25px] ${
            menuOpen
              ? 'block bg-white shadow-md absolute top-[6vh] right-0 w-full rounded-md px-0 '
              : 'hidden'
          } md:block`}
        >
          <div
            className={`flex flex-row items-center ${isScrolled || !isHomePage ? '' : 'lg:font-bold'} gap-2 md:flex-row md:space-x-8 text-[16px]  ${
              menuOpen ? 'py-2 px-4 w-full flex-col' : ''
            }`}
          >
            <Link
              to="/"
              className={`block hover:border-white  hover:text-[#F29404] py-0 ${
                isActive('/')
                  ? 'lg:text-white text-[#F29404] py-2 px-6 rounded-[25px] font-bold lg:bg-[#F29404]'
                  : ''
              } ${menuOpen ? 'py-2 px-0 w-full text-center rounded-md hover:bg-gray-100' : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/about_us"
              className={`block hover:border-white  hover:text-[#F29404] ${
                isActive('/about_us')
                  ? 'text-[#F29404] border-b-2 border-white font-bold'
                  : ''
              } ${menuOpen ? 'py-2 w-full text-center rounded-md hover:bg-gray-100' : ''}`}
              onClick={closeMenu}
            >
              About us
            </Link>
            <Link
              to="/dorze_lodge"
              className={`block hover:border-white  hover:text-[#F29404] ${
                isActive('/dorze_lodge')
                  ? 'text-[#F29404] border-b-2 border-white font-bold'
                  : ''
              } ${menuOpen ? 'py-2 w-full text-center rounded-md hover:bg-gray-100' : ''}`}
              onClick={closeMenu}
            >
              Dorze Lodge
            </Link>
            <Link
              to="/our_packages"
              className={`block hover:border-white  hover:text-[#F29404] ${
                isActive('/our_packages')
                  ? 'text-[#F29404] border-b-2 border-white font-bold'
                  : ''
              } ${menuOpen ? 'py-2 w-full text-center rounded-md hover:bg-gray-100' : ''}`}
              onClick={closeMenu}
            >
              Our Packages
            </Link>
            <Link
              to="/gallery"
              className={`block hover:border-white  hover:text-[#F29404] ${
                isActive('/gallery')
                  ? 'text-[#F29404] border-b-2 border-white font-bold'
                  : ''
              } ${menuOpen ? 'py-2 w-full text-center rounded-md hover:bg-gray-100' : ''}`}
              onClick={closeMenu}
            >
              Gallery
            </Link>
            {!userInfo && (
              <Link
                to="/login"
                className={` h-max rounded-[25px] px-6 py-2 md:inline-block ${
                  menuOpen
                    ? 'w-full text-center flex justify-center items-center rounded-md'
                    : ''
                }`}
                onClick={closeMenu}
              >
                Sign In
              </Link>
            )}

            {userInfo && isMobile && (
              <>
                {/* Settings and Logout in mobile view */}
                <Link
                  to="/profile"
                  className={`block hover:border-white  hover:text-[#F29404] py-2 w-full text-center rounded-md hover:bg-gray-100`}
                  onClick={closeMenu}
                >
                  <FaCog className="inline mr-2" /> Settings
                </Link>
                <button
                  onClick={logoutHandler}
                  className="block text-left px-4 py-2 hover:bg-gray-100 w-full text-center rounded-md hover:bg-gray-100"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </>
            )}
          </div>

          {userInfo && !isMobile && (
            <div className="relative">
              {/* Dropdown for desktop view */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white"
              >
                <FaUser />
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 bg-white text-black shadow-md rounded-md transition-all duration-300 overflow-hidden ${
                  dropdownOpen
                    ? 'max-h-screen opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 flex items-center"
                  onClick={closeMenu}
                >
                  <FaCog className="mr-2" /> Settings
                </Link>
                <button
                  onClick={logoutHandler}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
