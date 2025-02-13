import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ItineraryAccordion = ({ itinerary }) => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="space-y-4">
            {itinerary?.map((day, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                    <button
                        className="w-full p-4 bg-gray-50 flex justify-between items-center"
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                        <h4 className="font-semibold">Day {day.day}</h4>
                        {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {openIndex === index && (
                        <div className="p-4 bg-white space-y-4">
                            {day.activities?.map((activity, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <span className="font-medium text-[#F29404]">
                                        {activity.time}
                                    </span>
                                    <p className="text-gray-600 flex-1">
                                        {activity.activity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ItineraryAccordion; 