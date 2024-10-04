// userApi.js
import axios from 'axios';

const fetchTotalUsers = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
    withCredentials: true, // Ensure cookies are sent with the request
  });
  return data; // assuming the response is an array of users
};

export { fetchTotalUsers };
