/* eslint-disable react/no-unescaped-entities */

import React, { useEffect } from 'react';
import gallery1 from '../../assets/images/gallery1.webp';
import gallery2 from '../../assets/images/gallery2.webp';
import gallery3 from '../../assets/images/gallerry3.webp';
import oldCar from '../../assets/images/old car.webp';
// import recentCar from '../../assets/images/recent car.webp';
import {
  FaMap,
  FaGlobe,
  FaHiking,
  FaLandmark,
  FaPrayingHands,
  FaGem,
  FaArrowRight,
} from 'react-icons/fa';
// import ctaImage from '../../assets/images/Rectangle 158.webp';
import { Link } from 'react-router-dom';
// import lodgeImage from '../../assets/images/lodge.webp';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'Dorze Tours - About Us';
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={gallery2}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Ethiopian landscape"
        />
        <div className="relative z-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent">Dorze Tours</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
            Crafting authentic Ethiopian experiences since 2010
          </p>
        </div>
      </section>

      {/* Discover Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Unveiling Ethiopia's Hidden Treasures
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Embark on an extraordinary journey through the heart of Ethiopia with Dorze Tours.
                From the rock-hewn churches of Lalibela to the majestic Simien Mountains, we offer
                immersive cultural experiences and historical explorations.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-xl border-2 border-[#FFDA32]/20 hover:border-[#F29404] transition-colors">
                  <h3 className="text-xl font-semibold mb-3">Cultural Expertise</h3>
                  <p className="text-gray-500">20+ ethnic communities partnered</p>
                </div>
                <div className="p-6 bg-white rounded-xl border-2 border-[#FFDA32]/20 hover:border-[#F29404] transition-colors">
                  <h3 className="text-xl font-semibold mb-3">Adventure Legacy</h3>
                  <p className="text-gray-500">5000+ satisfied travelers</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src={gallery1}
                className="h-64 w-full object-cover rounded-xl shadow-lg"
                alt="Gallery"
              />
              <img
                src={gallery3}
                className="h-64 w-full object-cover rounded-xl shadow-lg mt-8"
                alt="Gallery"
              />
              <img
                src={oldCar}
                className="h-64 w-full object-cover rounded-xl shadow-lg"
                alt="Vintage vehicle"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Dorze Tours?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Experience Ethiopia through our unique offerings
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-[#F29404]/10 rounded-xl flex items-center justify-center mb-6">
                  <service.icon className="text-3xl text-[#F29404]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lodge Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all">
              <img
                src="/assets/images/lodge.webp"
                alt="Dorze Lodge"
                className="w-full h-[500px] object-cover transform transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-[#FFDA32]/90 px-4 py-2 rounded-full text-sm font-semibold">
                🏆 Award-Winning Experience
              </span>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFDA32] to-[#F29404] bg-clip-text text-transparent">
                Our Signature Lodge Experience
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nestled in the lush highlands, Dorze Lodge offers traditional hospitality
                with modern comforts. Experience authentic Dorze culture while enjoying
                breathtaking mountain views.
              </p>
              <Link
                to="/dorze_lodge"
                className="inline-flex items-center px-8 py-4 bg-[#F29404] text-white rounded-xl font-bold hover:bg-[#DB8303] transition-colors"
              >
                Explore Lodge
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Add this above the component
const services = [
  {
    icon: FaMap,
    title: "Custom Journeys",
    description: "Tailor-made itineraries for unique experiences"
  },
  {
    icon: FaGlobe,
    title: "Cultural Immersion",
    description: "Authentic interactions with local communities"
  },
  {
    icon: FaHiking,
    title: "Adventure Tours",
    description: "Expert-led expeditions to remote regions"
  },
  {
    icon: FaLandmark,
    title: "Historical Expertise",
    description: "UNESCO site specialists"
  },
  {
    icon: FaPrayingHands,
    title: "Spiritual Journeys",
    description: "Sacred site pilgrimages"
  },
  {
    icon: FaGem,
    title: "Luxury Travel",
    description: "Premium experiences with 5-star service"
  }
];

export default AboutPage;
