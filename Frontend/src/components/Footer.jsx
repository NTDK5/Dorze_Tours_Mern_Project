/* eslint-disable react/no-unescaped-entities */
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
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent">
              DorzeTours
            </h2>
            <p className="text-gray-600">
              Crafting unforgettable journeys through Ethiopia's cultural heritage and natural wonders.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#F29404]"
              />
              <button className="absolute right-2 top-2 bg-[#F29404] text-white px-6 py-1.5 rounded-md hover:bg-[#DB8303] transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <FaMapMarker className="text-[#F29404]" />
                <span>Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FaEnvelope className="text-[#F29404]" />
                <span>info@dinkatourethiopia.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FaPhone className="text-[#F29404]" />
                <span>+251 911 558 344</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Explore</h3>
            <div className="grid grid-cols-1 gap-3">
              {['Home', 'About Us', 'Destinations', 'Tours', 'Contact', 'Gallery'].map((link) => (
                <Link
                  key={link}
                  to="/"
                  className="text-gray-600 hover:text-[#F29404] transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Tours */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Popular Tours</h3>
            <div className="grid grid-cols-1 gap-3">
              {['Omo Valley', 'Harar', 'Bale Mountains', 'Arbaminch', 'Lalibela', 'Simien Mountains'].map((tour) => (
                <Link
                  key={tour}
                  to="/"
                  className="text-gray-600 hover:text-[#F29404] transition-colors"
                >
                  {tour}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-gray-200" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-600">
          <div className="flex items-center gap-6 text-2xl">
            <FaFacebook className="hover:text-[#F29404] cursor-pointer transition-colors" />
            <FaInstagram className="hover:text-[#F29404] cursor-pointer transition-colors" />
            <FaTelegram className="hover:text-[#F29404] cursor-pointer transition-colors" />
            <FaTiktok className="hover:text-[#F29404] cursor-pointer transition-colors" />
            <FaWhatsapp className="hover:text-[#F29404] cursor-pointer transition-colors" />
          </div>
          <p className="text-sm">© 2024 Dorze Tours. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
