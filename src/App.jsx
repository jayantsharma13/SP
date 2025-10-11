import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { HomePage } from './components/HomePage.jsx';
import { SubmitReview } from './components/SubmitReview.jsx';
import { ReviewDetails } from './components/ReviewDetails.jsx';
import { NetflixSplash } from './components/NetflixSplash.jsx';
import { Login } from './components/Login.jsx';
import { Signup } from './components/Signup.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AdminDashboard } from './components/AdminDashboard.jsx';
import authService from './services/authService.js';
import apiService from './services/apiService.js';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user data on mount and listen for authentication changes
  useEffect(() => {
    const userData = authService.getUser();
    if (userData) {
      setUser(userData);
    }

    // Listen for storage changes (when auth data is updated)
    const handleStorageChange = (e) => {
      if (e.key === 'user_data') {
        const newUserData = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(newUserData);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab auth changes
    const handleAuthChange = (e) => {
      setUser(e.detail);
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleLogout = () => {
    apiService.logout();
    // No need to manually set user to null as the authStateChanged event will handle it
    navigate('/');
  };

  if (showSplash) {
    return <NetflixSplash onAnimationComplete={handleSplashComplete} />;
  }
  
  return (
    <div className="min-h-screen bg-black">
      {/* Netflix-style Navigation */}
      <nav className="bg-black shadow-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-3xl font-bold text-red-600 hover:text-red-500 transition-colors">
                StudentsPark
              </Link>
              <span className="text-white text-xs ml-2 bg-gray-800 px-2 py-1 rounded">EPISODES</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🏠 Browse
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/submit" 
                    className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-md text-sm font-bold transition-colors"
                  >
                    ➕ Add Episode
                  </Link>
                  
                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm">{user.name}</span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                          {user.email}
                        </div>
                        <div className="px-4 py-2 text-xs text-gray-400">
                          Role: <span className="text-red-500">{user.role}</span>
                        </div>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                          >
                            ⚙️ Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          🚪 Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-md text-sm font-bold transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/submit" 
            element={
              <ProtectedRoute>
                <SubmitReview />
              </ProtectedRoute>
            } 
          />
          <Route path="/review/:id" element={<ReviewDetails />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {/* Netflix-style Footer */}
      <footer className="bg-black border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-600 text-2xl font-bold mb-4">StudentsPark</div>
            <p className="text-gray-400 mb-4">Your ultimate destination for placement interview experiences</p>
            <div className="flex justify-center space-x-6 text-gray-500 text-sm">
              <span>🎬 Original Content</span>
              <span>📚 Student Stories</span>
              <span>🎯 Interview Prep</span>
              <span>💼 Career Success</span>
            </div>
            <p className="text-gray-600 text-sm mt-6">&copy; 2024 StudentsPark. Empowering students through shared placement experiences.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
