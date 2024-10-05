import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://dorze-tours.onrender.com',
});

export const apiSlice = createApi({
  reducerPath: 'api one',
  baseQuery,
  tagTypes: ['User'],
  endpoints: () => ({}),
});

// export const blogApi = createApi({
//   reducerPath: 'api two',
//   baseQuery,
//   tagTypes: ['blog'],
//   endpoints: (builder) => ({}),
// });
