/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */

import React from 'react';
import { FaCalendar, FaUsers } from 'react-icons/fa';
import FormAuthGuard from './FormAuthGuard';

const BookingWidget = ({ price, onBooking, onWishlist, userInfo, tour }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h3 className="text-2xl font-bold mb-4">Book This Tour</h3>
            <div className="mb-4">
                <span className="text-3xl font-bold text-[#F29404]">${price}</span>
                <span className="text-gray-500"> / person</span>
            </div>

            <FormAuthGuard formTitle="booking">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#F29404]">${price}</span>
                        <span className="text-gray-500">per person</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FaCalendar className="text-[#F29404]" />
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <FaUsers className="text-[#F29404]" />
                            <select className="w-full p-2 border rounded-lg">
                                {[...Array(10).keys()].map((num) => (
                                    <option key={num + 1} value={num + 1}>
                                        {num + 1} {num === 0 ? 'Person' : 'People'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={onBooking}
                        className="w-full bg-[#F29404] text-white py-3 rounded-lg hover:bg-[#DB8303] transition-colors"
                    >
                        Book Now
                    </button>
                </div>
            </FormAuthGuard>

            <button
                onClick={onWishlist}
                className="w-full mt-3 py-2 border border-[#F29404] text-[#F29404] rounded-md hover:bg-[#F29404]/10 transition-colors"
            >
                Save to Wishlist
            </button>
        </div>
    );
};

export default BookingWidget; 