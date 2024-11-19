import React, { useState, useMemo, useEffect } from 'react';
import signInImage from '../../assets/image2.webp';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../../states/slices/authSlice';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import {
  FaFlag,
  FaLock,
  FaUser,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Dorze Tours - Register';
  }, []);
  const options = useMemo(
    () =>
      countryList()
        .getData()
        .map((country) => ({
          label: country.label,
          value: country.value,
        })),
    []
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      country: selectedOption ? selectedOption.label : '',
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          country: formData.country,
          password: formData.password,
        },
        { withCredentials: true }
      );

      alert(response.data.message);
      if (response.data.verified) {
        dispatch(setCredentials(response.data));
        navigate('/');
      } else {
        navigate('/verify_email');
        alert('Please verify your email to complete registration.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="hidden md:block w-1/2 h-full relative">
        <img
          src={signInImage}
          className="w-full h-full absolute top-0 left-0 z-10 object-center object-cover"
          alt="signupimage"
        />
        <div className="overlay w-full h-full absolute top-0 left-0 z-50"></div>
      </div>

      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-4">
        <div className="form_content w-full md:w-3/4 lg:w-1/2 flex flex-col gap-5">
          <h1 className="text-3xl md:text-5xl">
            Create Your Account on{' '}
            <span className="font-bold">
              <span className="text-[#D5212C]">Dor</span>
              <span>zeT</span>
              <span className="text-[#F29404]">ours</span>
            </span>
          </h1>
          <h6 className="text-gray-500 mb-5 md:mb-10">
            Fill in your details below
          </h6>

          {error && <div className="text-red-500">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-10">
              <div className="relative w-full md:w-1/2">
                <FaUser className="absolute top-1/2 transform -translate-y-1/2 left-2 text-[#d5212d4f]" />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="pl-10 py-2 border border-gray-300 w-full rounded"
                />
              </div>

              <div className="relative w-full md:w-1/2">
                <FaUser className="absolute top-1/2 transform -translate-y-1/2 left-2 text-[#d5212d4f]" />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="pl-10 py-2 border border-gray-300 w-full rounded"
                />
              </div>
            </div>

            <div className="relative mb-4 md:mb-10">
              <FaEnvelope className="absolute top-1/2 transform -translate-y-1/2 left-2 text-[#d5212d4f]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="pl-10 py-2 border border-gray-300 w-full rounded"
              />
            </div>

            <div className="relative mb-4 md:mb-10">
              <FaFlag className="absolute top-1/2 transform -translate-y-1/2 left-2 text-[#d5212d4f]" />
              <Select
                options={options}
                onChange={handleSelectChange}
                placeholder="Select your country"
                className="w-full"
              />
            </div>

            <div className="relative mb-4 md:mb-10">
              <FaLock className="absolute top-1/2 transform -translate-y-1/2 left-2 text-[#d5212d4f]" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="pl-10 py-2 border border-gray-300 w-full rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 transform -translate-y-1/2 right-2 text-[#d5212d4f] focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative mb-4 md:mb-10">
              <FaLock className="absolute top-1/2 transform -translate-y-1/2 left-2 text-[#d5212d4f]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="pl-10 py-2 border border-gray-300 w-full rounded"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 transform -translate-y-1/2 right-2 text-[#d5212d4f] focus:outline-none"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F29404] text-white py-2 rounded hover:bg-orange-500 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

            <p className="text-center mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-400">
                Sign in here!
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
