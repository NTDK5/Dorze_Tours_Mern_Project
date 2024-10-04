import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { setCredentials } from '../../states/slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import countryList from 'react-select-country-list';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch(); // Dispatch actions
  const [formData, setFormData] = useState({
    first_name: userInfo.first_name,
    last_name: userInfo.last_name,
    country: userInfo.country,
    email: userInfo.email,
    password: '', // Handle password separately
  });

  // Fetching country options for the select input
  const options = useMemo(
    () =>
      countryList()
        .getData()
        .map((country) => ({
          label: country.label, // Full country name
          value: country.value, // Country code (optional)
        })),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      country: selectedOption ? selectedOption.label : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add your token here
          },
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

      // Dispatch action to update userInfo in Redux state
      dispatch(setCredentials(response.data));

      // Handle success - e.g., show a success message or redirect
      console.log(response.data);
    } catch (error) {
      // Handle error
      console.error(
        'Error updating profile:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-xl text-left pl-[40px] font-semibold py-10">
        Personal Information
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-2 lg:px-[40px] px-4 font-mulish pb-10"
      >
        <div className="flex flex-col mb-2">
          <label htmlFor="first_name" className="text-left mb-2">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="p-[12px] rounded bg-[#F4F4F5]"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="last_name" className="text-left mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="p-[12px] rounded bg-[#F4F4F5]"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="country" className="text-left mb-2">
            Country
          </label>
          <Select
            id="country"
            name="country"
            value={options.find((option) => option.label === formData.country)}
            onChange={handleSelectChange}
            options={options}
            placeholder="Select your country"
            className="basic-single"
            classNamePrefix="select"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="email" className="text-left mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-[12px] rounded bg-[#F4F4F5]"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="password" className="text-left mb-2">
            New Password (optional)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="p-[12px] rounded bg-[#F4F4F5]"
          />
        </div>
        <button
          type="submit"
          className="bg-[#7BBCB0] w-64 text-white py-2 px-4 rounded-lg hover:bg-[#268b79] transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
