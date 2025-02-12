import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import signInImage from '../../assets/image2.webp';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../states/slices/authSlice';
import GoogleLoginButton from '../../components/GoogleLoginButton';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'Dorze Tours - Login';
  }, []);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate, userInfo]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/auth`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setCredentials(response.data));
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('Email not verified. Please check your inbox.');
      } else if (error.response && error.response.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] flex flex-col md:flex-row">
      <div className="hidden md:block md:w-1/2 h-full relative">
        <img
          src={signInImage}
          className="w-full h-full absolute top-0 left-0 z-10 object-center object-cover"
          alt="signinimage"
        />
        <div className="overlay w-full h-full absolute top-0 left-0 z-50"></div>
      </div>

      <div className="w-full md:w-1/2 h-full flex items-center justify-center px-4 md:px-0 shadow-lg md:shadow-none">
        <div className="form_content w-full md:w-3/4 lg:w-1/2 flex flex-col gap-5">
          <h1 className="text-3xl md:text-5xl">
            Welcome Back to{' '}
            <span className="font-bold">
              <span className="text-[#D5212C]">Dor</span>
              <span>zeT</span>
              <span className="text-[#F29404]">ours</span>
            </span>
          </h1>
          <h6 className="text-gray-500 mb-5 md:mb-10">
            Sign in to your account below
          </h6>
          <form onSubmit={handleLogin}>
            <div className="form_group relative mb-4 md:mb-6">
              <FaUser className="input-icon absolute top-1/2 transform -translate-y-1/2 left-2 text-[#d5212d4f]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="input pl-10 py-2 border border-gray-300 w-full rounded"
              />
            </div>
            <div className="form_group relative mb-4 md:mb-6">
              <FaLock className="input-icon absolute top-1/2 transform -translate-y-1/2 left-2 text-[#d5212d4f]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input pl-10 py-2 border border-gray-300 w-full rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 transform -translate-y-1/2 right-2 text-[#d5212d4f] focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              className="button bg-[#F29404] text-white py-2 rounded w-full hover:bg-orange-500 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {error && <div className="text-red-500 mt-3">{error}</div>}
            <p className="text-center mt-4">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-orange-400">
                Sign up here!
              </Link>
            </p>
          </form>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
