// userApi.js
import axios from 'axios';

// Fetch all tours
const fetchTotalReviews = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/reviews`,
    {
      withCredentials: true,
    }
  );
  return data;
};

export { fetchTotalReviews };
