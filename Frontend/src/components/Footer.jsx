import React from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaMapMarker,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import footerImg from '../assets/images/Footer_img.webp';

const Footer = () => {
  return (
    <footer
      id="footer"
      className="footer mt-[100px] pt-[100px] flex justify-center bg-white w-full h-max relative bottom-0 shadow-[0_-5px_15px_rgba(0,0,0,0.1)]"
    >
      {/* <img
        src={footerImg}
        className="absolute right-0 bottom-0"
        width="500"
        height="200"
        alt="Footer Background"
      /> */}

      <div className="footer_content w-[90%] lg:w-[70%]">
        <div className="footer_row flex flex-wrap justify-between gap-10 lg:gap-0">
          {/* Footer Logo and Subscribe */}
          <div className="footer_logo w-max md:w-[40%] lg:w-auto">
            <div className="text-xl lg:text-3xl font-bold logo">
              <a href="/" className="font-mulish">
                <span className="font-bold text-black">
                  <span className="text-[#D5212C]">Dor</span>
                  <span>zeT</span>
                  <span className="text-[#F29404]">ours</span>
                </span>
              </a>
            </div>
            <p>Travel helps companies manage payments easily.</p>
            <div className="email_input_container w-full sm:w-[300px] flex relative mt-[50px]">
              <input
                className="email_input border-none w-full py-2 px-4 rounded-sm"
                placeholder="Enter your email"
                required
              />
              <button className="email_subscribe_button bg-[#F29404] text-white font-bold absolute right-0 px-4 py-2 rounded-md">
                Subscribe
              </button>
            </div>
            <div className="socials flex gap-4 text-[25px] mt-10 px-2 text-[#D5212C]">
              <FaFacebook />
              <FaInstagram />
              <FaTelegram />
              <FaTiktok />
              <FaWhatsapp />
            </div>
          </div>

          {/* Footer Contact */}
          <div className="footer_contact flex flex-col gap-4 w-full md:w-[30%] lg:w-auto">
            <h3 className="text-lg font-bold">Contact</h3>
            <p className="flex items-center gap-2">
              <FaMapMarker className="text-[#D5212C]" /> Addis Ababa, Ethiopia
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-[#D5212C]" />
              info@dinkatourethiopia.com
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-[#D5212C]" />
              251911558344
            </p>
          </div>

          {/* Footer Links */}
          <div className="footer_links flex flex-col gap-4 w-max md:w-[30%] lg:w-auto">
            <h3 className="text-lg font-bold">Links</h3>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              Home
            </Link>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              About Us
            </Link>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              Destinations
            </Link>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              Tours
            </Link>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              Contact Us
            </Link>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              Gallery
            </Link>
          </div>

          {/* Footer Tours */}
          <div className="footer_links flex flex-col gap-4 w-max md:w-[30%] lg:w-auto">
            <h3 className="text-lg font-bold">Tours</h3>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              Omo valley
            </Link>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              Harar
            </Link>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              Bale Mountains
            </Link>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              Arbaminch
            </Link>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              Lalibela
            </Link>
            <Link className="hover:text-[#FFDA32]" to={'/'}>
              Gallery
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer_bottom flex justify-center items-center w-full mt-[50px] py-10 border-t-2 border-[#F29404]">
          <p>© Copyright 2024, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
