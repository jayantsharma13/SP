import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../services/apiService.js';

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    pass: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.email || !formData.pass) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const response = await apiService.login(formData);
      
      // The apiService automatically stores the auth data and user will be logged in
      // Redirect to home page on successful login
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Netflix-style Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-red-600 mb-2">StudentsPark</h1>
          <p className="text-gray-400">Sign in to access placement experiences from students worldwide</p>
        </div>

        {/* Login Card */}
        <div className="bg-black bg-opacity-80 rounded-lg shadow-2xl p-8 border border-gray-800">
          <h2 className="text-3xl font-bold text-white mb-6">Sign In</h2>

          {error && (
            <div className="bg-red-600 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="pass" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="pass"
                name="pass"
                value={formData.pass}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-red-600 hover:text-red-500 font-semibold transition-colors">
                Sign up now
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>🎬 Share your placement journey</p>
          <p>📚 Help fellow students succeed</p>
        </div>
      </div>
    </div>
  );
}
