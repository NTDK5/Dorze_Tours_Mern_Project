/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { fetchTotalTours } from '../services/tourApi';
import axios from 'axios';
import FormAuthGuard from './FormAuthGuard';

const CustomTripModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        destinations: [],
        travelers: 1,
        startDate: '',
        endDate: '',
        budget: '',
        notes: ''
    });

    const { userInfo } = useSelector((state) => state.auth);
    const [submitted, setSubmitted] = useState(false);

    const { data: tours } = useQuery({
        queryKey: ['totalTours'],
        queryFn: fetchTotalTours,
    });

    const uniqueDestinations = [
        ...new Set(tours?.map((tour) => tour.destination) || []),
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/custom-trips`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                    withCredentials: true,
                }
            );

            setSubmitted(true);
            setTimeout(onClose, 2000);
        } catch (error) {
            console.error('Submission error:', error.response?.data || error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                {submitted ? (
                    <div className="text-center p-8">
                        <h3 className="text-2xl font-bold text-[#F29404] mb-4">Request Received!</h3>
                        <p className="text-gray-600">Our travel experts will contact you within 24 hours</p>
                    </div>
                ) : (
                    <FormAuthGuard formTitle="custom trip planning">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="text-2xl font-bold text-[#F29404] mb-6">Build Your Dream Trip</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 mb-2">Destinations (from existing tours)</label>
                                    <select
                                        name="destinations"
                                        multiple
                                        className="w-full p-2 border rounded-lg"
                                        onChange={(e) => setFormData({ ...formData, destinations: [...e.target.selectedOptions].map(o => o.value) })}
                                        required
                                    >
                                        {uniqueDestinations.map(destination => (
                                            <option key={destination} value={destination}>{destination}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">Number of Travelers</label>
                                    <input
                                        type="number"
                                        name="travelers"
                                        min="1"
                                        value={formData.travelers}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Budget Range (USD)</label>
                                <select
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                >
                                    <option value="">Select Budget</option>
                                    <option value="1000-3000">$1,000 - $3,000</option>
                                    <option value="3000-5000">$3,000 - $5,000</option>
                                    <option value="5000+">$5,000+</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Additional Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg h-32"
                                    placeholder="Special requirements, preferred activities..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#F29404] text-white py-3 rounded-lg font-semibold hover:bg-[#DB8303] transition-colors"
                            >
                                Submit Request
                            </button>
                        </form>
                    </FormAuthGuard>
                )}
            </div>
        </div>
    );
};

export default CustomTripModal; 