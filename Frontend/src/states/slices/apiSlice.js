import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_API_URL}/api`,
});

export const apiSlice = createApi({
  reducerPath: 'api one',
  baseQuery,
  tagTypes: ['User'],
  endpoints: () => ({}),
});
