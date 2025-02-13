/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Reviews = ({ tourId, tour }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [overallTourRating, setOverallTourRating] = useState(null);
  const [averageGuideRating, setAverageGuideRating] = useState(0);
  const [averageTransportRating, setAverageTransportRating] = useState(0);
  const [averageValueRating, setAverageValueRating] = useState(0);
  const [averageSafetyRating, setAverageSafetyRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [userReviewed, setUserReviewed] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    guideRating: 0,
    transportationRating: 0,
    valueForMoneyRating: 0,
    safetyRating: 0,
    comment: '',
  });
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;
  const limit = 5; // Number of reviews per page

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/reviews/${tourId}?page=${page}&limit=${limit}`
        );
        setReviews(data.reviews);
        setPages(data.pages);
        calculateOverallRatings(data.reviews);
        // Check if the current user has reviewed
        const hasReviewed = data.reviews.some(
          (review) => review.user._id === userId
        );
        setUserReviewed(hasReviewed);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch reviews.');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tourId, page, userId]);

  const calculateOverallRatings = (reviews) => {
    if (reviews.length === 0) return;

    const totalGuideRating = reviews.reduce(
      (acc, review) => acc + review.guideRating,
      0
    );
    const totalTransportRating = reviews.reduce(
      (acc, review) => acc + review.transportationRating,
      0
    );
    const totalValueRating = reviews.reduce(
      (acc, review) => acc + review.valueForMoneyRating,
      0
    );
    const totalSafetyRating = reviews.reduce(
      (acc, review) => acc + review.safetyRating,
      0
    );

    const guideAverage = totalGuideRating / reviews.length;
    const transportAverage = totalTransportRating / reviews.length;
    const valueAverage = totalValueRating / reviews.length;
    const safetyAverage = totalSafetyRating / reviews.length;

    setAverageGuideRating(guideAverage);
    setAverageTransportRating(transportAverage);
    setAverageValueRating(valueAverage);
    setAverageSafetyRating(safetyAverage);

    const totalOverallRating =
      (guideAverage + transportAverage + valueAverage + safetyAverage) / 4;
    setOverallTourRating(totalOverallRating.toFixed(2));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reviews`,
        {
          ...reviewForm,
          tourId: tourId,
        },
        {
          withCredentials: true,
        }
      );
      alert('Review submitted successfully!');
      setShowForm(false);
      setUserReviewed(true);
    } catch (err) {
      console.error('Failed to submit review.');
      setShowForm(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex">
        {Array(fullStars)
          .fill(0)
          .map((_, idx) => (
            <FaStar key={idx} className="text-yellow-500" />
          ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, idx) => (
            <FaRegStar key={idx} className="text-yellow-500" />
          ))}
      </div>
    );
  };

  const renderProgressBar = (rating) => {
    return (
      <div className="w-full bg-gray-200 rounded h-2">
        <div
          className="bg-yellow-500 h-2 rounded"
          style={{ width: `${(rating / 5) * 100}%` }}
        />
      </div>
    );
  };

  const handleNextPage = () => {
    if (page < pages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  if (loading) return <div className="text-center">Loading reviews...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full mx-auto my-6 p-4 ">
      <div className="flex w-full justify-between">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        <button
          className={`px-4 py-2 rounded mb-4 text-white ${userReviewed
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
            }`}
          onClick={() => setShowForm(!showForm)}
          disabled={userReviewed || !userInfo}
        >
          {showForm ? 'View Reviews' : 'Write a Review'}
        </button>
      </div>
      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Guide Rating (0-5):</label>
            <input
              type="number"
              name="guideRating"
              value={reviewForm.guideRating}
              onChange={handleFormChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Transportation Rating (0-5):</label>
            <input
              type="number"
              name="transportationRating"
              value={reviewForm.transportationRating}
              onChange={handleFormChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Value for Money Rating (0-5):</label>
            <input
              type="number"
              name="valueForMoneyRating"
              value={reviewForm.valueForMoneyRating}
              onChange={handleFormChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Safety Rating (0-5):</label>
            <input
              type="number"
              name="safetyRating"
              value={reviewForm.safetyRating}
              onChange={handleFormChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Comment:</label>
            <textarea
              name="comment"
              value={reviewForm.comment}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit Review
          </button>
        </form>
      ) : (
        <>
          {reviews.length > 0 && (
            <div className="w-full mb-6 flex flex-col md:flex-row justify-between ">
              <div className="mb-4 md:mb-0 flex flex-col gap-2">
                <h3 className="text-xl font-semibold">Overall Tour Rating</h3>
                <p className="text-yellow-500 text-2xl flex  gap-2">
                  {renderStars(overallTourRating)}
                  <span className="">{overallTourRating}/5</span>
                </p>
              </div>

              <div className="space-y-2 lg:w-[30%]">
                <div className="flex justify-between items-center ">
                  <span>Guide</span>
                </div>
                {renderProgressBar(averageGuideRating)}
                <div className="flex justify-between items-center">
                  <span>Transportation</span>
                </div>
                {renderProgressBar(averageTransportRating)}
                <div className="flex justify-between items-center">
                  <span>Value for Money</span>
                </div>
                {renderProgressBar(averageValueRating)}
                <div className="flex justify-between items-center">
                  <span>Safety</span>
                </div>
                {renderProgressBar(averageSafetyRating)}
              </div>
            </div>
          )}

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 border-b space-y-2 mb-4 bg-gray-50"
              >
                <div className="flex flex-col lg:flex-row w-full justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">
                      {review.user.first_name} {review.user.last_name}
                    </h4>
                    <p>{review.user.country}</p>
                  </div>

                  <div className="flex flex-wrap lg:flex-col items-start justify-between">
                    <span>Guide: {review.guideRating}/5</span>
                    <span>Transportation: {review.transportationRating}/5</span>
                    <span>Value: {review.valueForMoneyRating}/5</span>
                    <span>Safety: {review.safetyRating}/5</span>
                  </div>
                </div>

                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <div>No reviews available.</div>
          )}
          <div className="flex justify-between mt-4">
            <button
              className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className={`px-4 py-2 rounded ${page === pages ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              onClick={handleNextPage}
              disabled={page === pages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Reviews;
