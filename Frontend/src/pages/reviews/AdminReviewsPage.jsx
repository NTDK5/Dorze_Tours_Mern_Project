import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar } from 'react-icons/fa';

const AdminReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const limit = 10;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/reviews`,
                    {
                        params: { page, limit, search: searchTerm },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                        withCredentials: true,
                    }
                );
                setReviews(data.reviews);
                setPages(data.pages);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchReviews();
    }, [page, searchTerm]);

    const renderStars = (rating) => {
        return Array(5)
            .fill(0)
            .map((_, index) => (
                <span key={index} className="text-yellow-500">
                    {index < Math.floor(rating) ? <FaStar /> : <FaRegStar />}
                </span>
            ));
    };

    if (loading) return <div className="text-center p-8">Loading reviews...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Tour Reviews</h1>
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tour</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Ratings</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Comment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-700">
                            {reviews.map((review) => (
                                <tr key={review._id} className="hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {review.tour?.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {review.user?.first_name} {review.user?.last_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-400 text-sm">Guide:</span>
                                                {renderStars(review.guideRating)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-400 text-sm">Transport:</span>
                                                {renderStars(review.transportationRating)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-400 text-sm">Value:</span>
                                                {renderStars(review.valueForMoneyRating)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-400 text-sm">Safety:</span>
                                                {renderStars(review.safetyRating)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                                        {review.comment}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-gray-300">
                        Page {page} of {pages}
                    </span>
                    <button
                        onClick={() => setPage(Math.min(pages, page + 1))}
                        disabled={page === pages}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminReviewsPage; 