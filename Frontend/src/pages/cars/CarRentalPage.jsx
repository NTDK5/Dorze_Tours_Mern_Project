import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCar, FaGasPump, FaCog, FaUsers, FaHeadset, FaCalendarAlt, FaShieldAlt, FaPlaneDeparture, FaMapMarkedAlt, FaTools, FaClock } from 'react-icons/fa';
import LoadingScreen from '../../components/Loading';
import carouselBg from '../../assets/images/carousel-2.jpg';
import CountUp from 'react-countup';
import factBg from '../../assets/images/fact-bg.jpg';
import { toast } from 'react-hot-toast';

const CarRentalPage = () => {
    const navigate = useNavigate();
    const [selectedCar, setSelectedCar] = useState(null);
    const [bookingData, setBookingData] = useState({
        pickupLocation: '',
        dropoffLocation: '',
        pickupDate: '',
        pickupTime: '',
        dropoffDate: '',
        dropoffTime: '',
        additionalServices: [],
        specialRequests: ''
    });

    const [filters, setFilters] = useState({
        transmission: 'all',
        fuelType: 'all',
        minPrice: '',
        maxPrice: ''
    });

    const { data: cars, isLoading } = useQuery({
        queryKey: ['cars'],
        queryFn: async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/cars`);
            return data;
        },
    });

    const filteredCars = cars?.filter((car) => {
        return (
            (filters.transmission === 'all' || car.transmission === filters.transmission) &&
            (filters.fuelType === 'all' || car.fuelType === filters.fuelType) &&
            (!filters.minPrice || car.pricePerDay >= Number(filters.minPrice)) &&
            (!filters.maxPrice || car.pricePerDay <= Number(filters.maxPrice))
        );
    });

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCar) {
            toast.error('Please select a car first');
            return;
        }

        // Calculate total days
        const pickupDateTime = new Date(`${bookingData.pickupDate} ${bookingData.pickupTime}`);
        const dropoffDateTime = new Date(`${bookingData.dropoffDate} ${bookingData.dropoffTime}`);
        const totalDays = Math.ceil((dropoffDateTime - pickupDateTime) / (1000 * 60 * 60 * 24));

        if (totalDays <= 0) {
            toast.error('Invalid date selection');
            return;
        }

        const totalPrice = selectedCar.pricePerDay * totalDays;

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/bookings`,
                {
                    bookingType: 'Car',
                    carId: selectedCar._id,
                    numberOfPeople: 1,
                    paymentMethod: 'paypal',
                    pickupLocation: bookingData.pickupLocation,
                    dropoffLocation: bookingData.dropoffLocation,
                    checkInDate: pickupDateTime,
                    checkOutDate: dropoffDateTime,
                    notes: bookingData.specialRequests,
                    totalPrice: totalPrice,
                    status: 'pending'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    withCredentials: true
                }
            );

            navigate('/checkout', {
                state: {
                    booking: {
                        ...response.data,
                        carDetails: selectedCar,
                        totalDays
                    },
                    totalAmount: totalPrice
                }
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        }
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <div className="min-h-screen">
            {/* Hero Section with Carousel Background */}
            <div
                className="relative h-[60vh] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${carouselBg})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Car Rental Service</h1>
                        <p className="text-xl md:text-2xl">Explore Ethiopia with our premium fleet</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 -mt-10 relative z-10 ">
                {/* Booking Form */}
                <form onSubmit={handleBookingSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8 lg:translate-y-[-25%]">
                    <h2 className="text-2xl font-bold mb-6">Book Your Car</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pickup Location */}
                        <div>
                            <label className="block text-gray-700 mb-2 font-semibold">
                                <FaMapMarkedAlt className="inline mr-2" />
                                Pickup Location
                            </label>
                            <input
                                type="text"
                                value={bookingData.pickupLocation}
                                onChange={(e) => setBookingData({
                                    ...bookingData,
                                    pickupLocation: e.target.value
                                })}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter pickup location"
                                required
                            />
                        </div>

                        {/* Dropoff Location */}
                        <div>
                            <label className="block text-gray-700 mb-2 font-semibold">
                                <FaMapMarkedAlt className="inline mr-2" />
                                Drop-off Location
                            </label>
                            <input
                                type="text"
                                value={bookingData.dropoffLocation}
                                onChange={(e) => setBookingData({
                                    ...bookingData,
                                    dropoffLocation: e.target.value
                                })}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter drop-off location"
                                required
                            />
                        </div>

                        {/* Pickup Date */}
                        <div>
                            <label className="block text-gray-700 mb-2 font-semibold">
                                <FaCalendarAlt className="inline mr-2" />
                                Pickup Date
                            </label>
                            <input
                                type="date"
                                value={bookingData.pickupDate}
                                onChange={(e) => setBookingData({
                                    ...bookingData,
                                    pickupDate: e.target.value
                                })}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Pickup Time */}
                        <div>
                            <label className="block text-gray-700 mb-2 font-semibold">
                                <FaClock className="inline mr-2" />
                                Pickup Time
                            </label>
                            <input
                                type="time"
                                value={bookingData.pickupTime}
                                onChange={(e) => setBookingData({
                                    ...bookingData,
                                    pickupTime: e.target.value
                                })}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Dropoff Date */}
                        <div>
                            <label className="block text-gray-700 mb-2 font-semibold">
                                <FaCalendarAlt className="inline mr-2" />
                                Drop-off Date
                            </label>
                            <input
                                type="date"
                                value={bookingData.dropoffDate}
                                onChange={(e) => setBookingData({
                                    ...bookingData,
                                    dropoffDate: e.target.value
                                })}
                                min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Dropoff Time */}
                        <div>
                            <label className="block text-gray-700 mb-2 font-semibold">
                                <FaClock className="inline mr-2" />
                                Drop-off Time
                            </label>
                            <input
                                type="time"
                                value={bookingData.dropoffTime}
                                onChange={(e) => setBookingData({
                                    ...bookingData,
                                    dropoffTime: e.target.value
                                })}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                </form>

                {/* Filters Section */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-left">Filter Cars</h2>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <select
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all flex-1 md:w-48"
                                value={filters.transmission}
                                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                            >
                                <option value="all">All Transmissions</option>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>

                            <select
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all flex-1 md:w-48"
                                value={filters.fuelType}
                                onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                            >
                                <option value="all">All Fuel Types</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <input
                                type="number"
                                placeholder="Min Price"
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all w-full md:w-32"
                                value={filters.minPrice || ''}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all w-full md:w-32"
                                value={filters.maxPrice || ''}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Car Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-20">
                    {filteredCars?.map((car) => (
                        <div
                            key={car._id}
                            onClick={() => setSelectedCar(car)}
                            className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all ${selectedCar?._id === car._id ? 'ring-2 ring-blue-500' : ''
                                }`}
                        >
                            <div className="relative">
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/${car.images[0]}`}
                                    alt={car.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg">
                                    ${car.pricePerDay}/day
                                </div>
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-bold mb-2">{car.name}</h2>
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`px-2 py-1 rounded ${car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {car.available ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <FaCog className="mr-2" />
                                        {car.transmission}
                                    </div>
                                    <div className="flex items-center">
                                        <FaGasPump className="mr-2" />
                                        {car.fuelType}
                                    </div>
                                    <div className="flex items-center">
                                        <FaUsers className="mr-2" />
                                        {car.seats} Seats
                                    </div>
                                    <div className="flex items-center">
                                        <FaCar className="mr-2" />
                                        {car.year}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Booking Summary */}
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-[100000]">
                    <div className="container mx-auto flex justify-between items-center">
                        {selectedCar && (
                            <div className="text-lg font-semibold">
                                Selected: {selectedCar.brand} {selectedCar.model} - ${selectedCar.pricePerDay}/day
                            </div>
                        )}
                        <button
                            onClick={handleBookingSubmit}
                            disabled={!selectedCar}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>

                {/* Fact Counter Section */}
                <div
                    className="relative py-20 mb-16 -mx-4 sm:-mx-6 lg:-mx-8"
                    style={{
                        backgroundImage: `url(${factBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        width: '100vw',
                        position: 'relative',
                        left: '50%',
                        right: '50%',
                        marginLeft: '-50vw',
                        marginRight: '-50vw'
                    }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/70"></div>

                    {/* Content */}
                    <div className="relative container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {/* Happy Clients */}
                            <div className="text-white">
                                <div className="text-4xl font-bold mb-2">
                                    <CountUp end={5000} duration={2.5} />+
                                </div>
                                <p className="text-gray-300">Happy Clients</p>
                            </div>

                            {/* Cars in Fleet */}
                            <div className="text-white">
                                <div className="text-4xl font-bold mb-2">
                                    <CountUp end={200} duration={2.5} />+
                                </div>
                                <p className="text-gray-300">Cars in Fleet</p>
                            </div>

                            {/* Pickup Locations */}
                            <div className="text-white">
                                <div className="text-4xl font-bold mb-2">
                                    <CountUp end={50} duration={2.5} />+
                                </div>
                                <p className="text-gray-300">Pickup Locations</p>
                            </div>

                            {/* Years Experience */}
                            <div className="text-white">
                                <div className="text-4xl font-bold mb-2">
                                    <CountUp end={15} duration={2.5} />+
                                </div>
                                <p className="text-gray-300">Years Experience</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="w-full py-16 mb-8">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* 24/7 Support */}
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <FaHeadset className="text-2xl text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
                                <p className="text-gray-600">Round-the-clock customer support for all your rental needs, including roadside assistance.</p>
                            </div>

                            {/* Flexible Rental Plans */}
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <FaCalendarAlt className="text-2xl text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Flexible Rental Plans</h3>
                                <p className="text-gray-600">Daily, weekly, and monthly rental options to suit your travel schedule.</p>
                            </div>

                            {/* Insurance Coverage */}
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <FaShieldAlt className="text-2xl text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Insurance Coverage</h3>
                                <p className="text-gray-600">Comprehensive insurance options for peace of mind during your journey.</p>
                            </div>

                            {/* Airport Pickup */}
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                    <FaPlaneDeparture className="text-2xl text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Airport Pickup</h3>
                                <p className="text-gray-600">Convenient airport pickup and drop-off services at major Ethiopian airports.</p>
                            </div>

                            {/* GPS Navigation */}
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                    <FaMapMarkedAlt className="text-2xl text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">GPS Navigation</h3>
                                <p className="text-gray-600">Built-in GPS systems to help you navigate Ethiopia with ease.</p>
                            </div>

                            {/* Free Maintenance */}
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                    <FaTools className="text-2xl text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Free Maintenance</h3>
                                <p className="text-gray-600">Complimentary maintenance and cleaning services throughout your rental period.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarRentalPage; 