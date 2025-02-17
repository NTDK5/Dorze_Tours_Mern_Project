import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
// import LoadingScreen from '../../components/Loading';

const CustomTripsAdmin = () => {
    const { userInfo } = useSelector((state) => state.auth);

    const { data: customTrips, isError } = useQuery({
        queryKey: ['customTrips'],
        queryFn: async () => {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/custom-trips`,
                {
                    headers: {
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                    withCredentials: true,
                }
            );
            console.log(data)
            return data;
        },
    });

    // if (isLoading) return <LoadingScreen />;
    if (isError) return <div>Error loading requests</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#F29404] mb-8">Custom Trip Requests</h1>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left">User</th>
                            <th className="px-6 py-4 text-left">Destinations</th>
                            <th className="px-6 py-4 text-left">Travel Dates</th>
                            <th className="px-6 py-4 text-left">Budget</th>
                            <th className="px-6 py-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {customTrips?.map((trip) => (
                            <tr key={trip._id}>
                                <td className="px-6 py-4">{trip.user?.first_name + " " + trip.user?.last_name}</td>
                                <td className="px-6 py-4">
                                    {trip.destinations.join(', ')}
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(trip.startDate).toLocaleDateString()} -
                                    {new Date(trip.endDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">{trip.budget}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm ${trip.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        trip.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {trip.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomTripsAdmin; 