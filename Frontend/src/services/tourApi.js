// userApi.js
import axios from 'axios';

// Fetch all tours
const fetchTotalTours = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/tours`, {
    withCredentials: true, // Ensure cookies are sent with the request
  });
  return data; // assuming the response is an array of tours
};

// Fetch a single tour by ID
const fetchTourById = async (id) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/tours/${id}`,
    {
      withCredentials: true, // Ensure cookies are sent with the request
    }
  );
  return data; // assuming the response is the tour object
};

export { fetchTotalTours, fetchTourById };
