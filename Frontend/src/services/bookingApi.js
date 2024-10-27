/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import axios from 'axios';

const fetchTotalbookings = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/bookings`,
    {
      withCredentials: true,
    }
  );
  return data;
};

export { fetchTotalbookings };
