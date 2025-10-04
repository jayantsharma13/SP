import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../services/apiService.js';

export function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pass: '',
    confirmPassword: '',
    role: 'student',
    branch: '',
    year: '',
    rollNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? (value ? Number(value) : '') : value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.name || !formData.email || !formData.pass) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (formData.pass.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }

      if (formData.pass !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Prepare data for API (remove confirmPassword)
      const { confirmPassword, ...signupData } = formData;
      
      // Convert empty year to undefined
      if (signupData.year === '') {
        delete signupData.year;
      }

      const response = await apiService.signup(signupData);
      
      // The apiService automatically stores the auth data and user will be logged in
      // Redirect to home page on successful signup
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Netflix-style Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-red-600 mb-2">StudentsPark</h1>
          <p className="text-gray-400">Join the ultimate placement community</p>
        </div>

        {/* Signup Card */}
        <div className="bg-black bg-opacity-80 rounded-lg shadow-2xl p-8 border border-gray-800">
          <h2 className="text-3xl font-bold text-white mb-6">Create Account</h2>

          {error && (
            <div className="bg-red-600 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Two Column Layout for Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
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
            </div>

            {/* Two Column Layout for Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password Field */}
              <div>
                <label htmlFor="pass" className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="pass"
                  name="pass"
                  value={formData.pass}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  placeholder="Min. 8 characters"
                  required
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>

            {/* NIT-H Student Information Section */}
            <div className="border-t border-gray-700 pt-5 mt-5">
              <h3 className="text-lg font-semibold text-white mb-4">NIT Hamirpur Student Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Branch Field */}
                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">
                    Branch/Department
                  </label>
                  <input
                    type="text"
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    placeholder="e.g., Computer Science & Engineering"
                  />
                </div>

                {/* Year Field */}
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
                    Current Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                {/* Roll Number Field */}
                <div>
                  <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-300 mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    placeholder="e.g., 21MI001 or 22CS045"
                  />
                </div>

                {/* Role Field */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-red-600 hover:text-red-500 font-semibold transition-colors">
                Sign in
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
          <p>* Required fields</p>
        </div>
      </div>
    </div>
  );
}
