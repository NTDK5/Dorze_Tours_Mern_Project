import React, { useEffect } from 'react';
import gallery1 from '../../assets/images/gallery1.webp';
import gallery2 from '../../assets/images/gallery2.webp';
import gallery3 from '../../assets/images/gallerry3.webp';
import oldCar from '../../assets/images/old car.webp';
import recentCar from '../../assets/images/recent car.webp';
import {
  FaMap,
  FaGlobe,
  FaHiking,
  FaLandmark,
  FaPrayingHands,
  FaGem,
} from 'react-icons/fa';
import ctaImage from '../../assets/images/Rectangle 158.webp';
import { Link } from 'react-router-dom';
import lodgeImage from '../../assets/images/lodge.webp';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'Dorze Tours - About Us ';
  }, []);
  return (
    <div className="about_container w-full min-h-screen flex items-center flex-col">
      {/* Hero Section */}
      <div className="about_hero_container w-full flex items-center py-20">
        <div className="about_hero_text w-full flex flex-col text-center">
          <h1 className="text-3xl md:text-5xl font-bold">About Us</h1>
          <p className="text-[#8f8f8f] mt-4 px-4 sm:px-0">
            Discover the heart of Ethiopia with [Company Name], your trusted
            guide to unforgettable adventures.
          </p>
        </div>
      </div>

      {/* Discover Section */}
      <div className="about_discover w-full md:w-[70%] flex flex-col lg:flex-row my-4 lg:my-[100px] px-4">
        <div className="about_discover_text w-full lg:w-[50%]">
          <h1 className="text-xl lg:text-3xl text-center lg:text-left md:text-[40px] font-ubuntu font-bold">
            DISCOVER THE BEAUTY AND DIVERSITY OF ETHIOPIA WITH DINKA TOUR
            ETHIOPIA
          </h1>
          <p className="mt-10 pr-0 md:pr-10">
            Embark on an extraordinary journey through the heart of Ethiopia
            with Dorze Tours Ethiopia. Our mission is to introduce you to the
            wonders of this ancient land, offering immersive cultural
            experiences, historical explorations, and encounters with
            breathtaking natural landscapes. From the rock-hewn churches of
            Lalibela to the majestic Simien Mountains, Ethiopia is a land of
            unparalleled beauty and cultural significance. At Dorze Tours
            Ethiopia, we invite you to delve into the country&apos;s rich
            heritage, explore its diverse ethnic groups, and witness age-old
            traditions that have stood the test of time.
          </p>
        </div>
        <div className="about_discover_image_container w-full lg:w-[50%] flex flex-col gap-5 mt-8 lg:mt-0">
          <div className="w-full h-[300px]">
            <img
              src={gallery2}
              alt="about_image"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="lg:flex w-full h-[200px] gap-5 hidden">
            <img
              src={gallery1}
              alt="about_image"
              className="w-[50%] h-full object-cover rounded-lg"
            />
            <img
              src={gallery3}
              alt="about_image"
              className="w-[50%] h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Vehicle History Section */}
      <section className="py-12 px-6 md:px-20 lg:w-[80%]">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          From Then to Now: Our Vehicles
        </h2>
        <div className="then flex flex-col md:flex-row items-center mb-12">
          <img
            src={oldCar}
            alt="Old Vehicle"
            className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-lg mb-6 md:mb-0 md:mr-6"
          />
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Then</h3>
            <p className="text-gray-600 ">
              Back then, we owned classic vehicles.
            </p>
          </div>
        </div>
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="border-t-2 border-gray-300 w-48"></div>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 4a1 1 0 011 1v9.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L11 14.586V5a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="now flex flex-col md:flex-row-reverse items-center">
          <img
            src={recentCar}
            alt="SUV"
            className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-lg mb-6 md:mb-0 md:ml-6"
          />
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Now</h3>
            <p className="text-gray-600 ">
              Today, we own a fleet of modern SUVs.
            </p>
          </div>
        </div>
      </section>

      {/* Service Section */}
      <div className="w-full flex flex-col items-center py-16 px-6 md:px-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Choose Us?
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto ">
            Discover Ethiopia with our comprehensive range of tailored tours.
          </p>
        </div>
        <div className="w-full md:w-[70%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl">
            <FaMap className="text-5xl text-blue-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Customized Tours
            </h2>
            <p className="text-gray-600">
              Embark on a personalized journey crafted just for you.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl">
            <FaGlobe className="text-5xl text-blue-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Cultural Immersion
            </h2>
            <p className="text-gray-600">
              Immerse yourself in the rich tapestry of Ethiopian culture.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl">
            <FaHiking className="text-5xl text-blue-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Adventure Expeditions
            </h2>
            <p className="text-gray-600">
              Embark on an adrenaline-fueled adventure.
            </p>
          </div>
          <div className=" bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl">
            <FaLandmark className="text-5xl text-blue-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Historical Tours
            </h2>
            <p className="text-gray-600 ">
              Trace the footsteps of ancient civilizations with our historical
              tours.
            </p>
          </div>

          <div className="service_card bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl">
            <FaPrayingHands className="text-5xl text-blue-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Pilgrimage Journeys
            </h2>
            <p className="text-gray-600 ">
              Embark on a spiritual pilgrimage to some of Ethiopia&apos;s
              holiest sites.
            </p>
          </div>

          <div className="service_card bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl">
            <FaGem className="text-5xl text-blue-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Luxury Travel
            </h2>
            <p className="text-gray-600 ">
              Indulge in luxury and comfort with our exclusive range of luxury
              travel packages.
            </p>
          </div>
        </div>
      </div>

      <section className="w-full h-max relative my-[100px]">
        <img
          className="object-cover object-center w-full h-[80vh] md:h-[70vh] lg:h-[80vh] z-10"
          src={ctaImage}
          alt="Background"
        />
        <div className="absolute w-full top-0 left-0 h-full bg-gradient-to-br from-[#48057D] to-[#2ADDE7] z-20 opacity-[80%] backdrop-blur-[25px]"></div>
        <div className="absolute w-full top-0 h-full flex items-center justify-center">
          <div className="w-[90%] md:w-[80%] lg:w-[70%] flex flex-col md:flex-row lg:gap-8 items-center justify-between">
            <img
              className="hidden lg:block w-[60%] md:w-[40%] lg:w-[50%] object-center z-30 bg-cover bg-center"
              src={lodgeImage}
              alt="Guide"
            />

            <div className="w-full md:w-[50%] z-30 text-white flex flex-col items-start justify-center p-6 md:p-8 rounded-lg bg-black bg-opacity-50 backdrop-blur-md">
              <img
                className="lg:hidden w-[60%] md:w-[40%] lg:w-[50%] object-center z-30 bg-cover bg-center"
                src={lodgeImage}
                alt="Guide"
              />
              <h1 className="font-bold text-4xl md:text-5xl lg:text-5xl tracking-wide mb-4">
                Experience the Heart of Ethiopia at Dorze Lodge
              </h1>
              <p className="text-sm md:text-base mb-6">
                Discover the beauty and tranquility of Dorze Lodge, nestled in
                the lush highlands of Ethiopia. Escape the ordinary with
                stunning views, traditional hospitality, and an unforgettable
                experience. Whether you seek adventure, culture, or relaxation,
                Dorze Lodge offers the perfect retreat. Book your stay today and
                immerse yourself in the vibrant heritage of the Dorze people.
              </p>
              <Link
                to="/our_packages"
                className="bg-[#FFDA32] text-white font-bold py-3 px-6 lg:px-8 rounded-lg shadow-[0_8px_20px_rgba(255,218,50,0.5)] transform transition-all duration-300 hover:shadow-[0_12px_24px_rgba(255,218,50,0.5)] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FFDA32]"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
