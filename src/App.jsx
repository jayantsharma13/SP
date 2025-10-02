import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './components/HomePage.jsx';
import { SubmitReview } from './components/SubmitReview.jsx';
import { ReviewDetails } from './components/ReviewDetails.jsx';
import { NetflixSplash } from './components/NetflixSplash.jsx';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
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
            <div className="flex space-x-8">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🏠 Browse
              </Link>
              <Link 
                to="/submit" 
                className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-md text-sm font-bold transition-colors"
              >
                ➕ Add Episode
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit" element={<SubmitReview />} />
          <Route path="/review/:id" element={<ReviewDetails />} />
        </Routes>
      </main>

      {/* Netflix-style Footer */}
      <footer className="bg-black border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-600 text-2xl font-bold mb-4">StudentsPark</div>
            <p className="text-gray-400 mb-4">Your ultimate destination for placement interview stories</p>
            <div className="flex justify-center space-x-6 text-gray-500 text-sm">
              <span>🎬 Original Content</span>
              <span>📚 Student Stories</span>
              <span>🎯 Interview Prep</span>
              <span>💼 Career Success</span>
            </div>
            <p className="text-gray-600 text-sm mt-6">&copy; 2024 StudentsPark. Empowering students through shared experiences.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
