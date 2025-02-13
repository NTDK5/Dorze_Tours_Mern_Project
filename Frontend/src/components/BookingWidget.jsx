import React from 'react';
import { FaCalendar, FaUsers } from 'react-icons/fa';

const BookingWidget = ({ price, onBooking }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
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
        </div>
    );
};

export default BookingWidget; 