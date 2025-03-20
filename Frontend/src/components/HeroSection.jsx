/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomTripModal from "./CustomTripModal";

export default function HeroSection() {
    const [showCustomModal, setShowCustomModal] = useState(false);

    return (
        <>
            <section className="relative w-full h-[100vh] hero-section">
                <div className="absolute inset-0 bg-black/50 z-0"></div>
                <div className="container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-3xl text-white z-10 relative">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
                            Discover Ethiopia's Hidden Treasures
                        </h1>
                        <p className="text-lg lg:text-xl mb-8 opacity-90 leading-relaxed">
                            Journey through ancient history, breathtaking landscapes, and vibrant cultures with our expertly crafted tours.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                to="/our_packages"
                                className="bg-[#F29404] hover:bg-[#DB8303] px-6 py-2 lg:px-8 lg:py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                            >
                                Explore Tours
                            </Link>
                            <button
                                onClick={() => setShowCustomModal(true)}
                                className="border-2 border-white hover:bg-white hover:text-purple-900 px-6 py-2 lg:px-8 lg:py-3 rounded-lg font-semibold transition-colors"
                            >
                                Custom Trip
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {showCustomModal && <CustomTripModal onClose={() => setShowCustomModal(false)} />}
        </>
    );
} 