import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService.js';
import apiService from '../services/apiService.js';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = authService.isAdmin();

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await apiService.getReviewStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-900 via-gray-900 to-black rounded-lg p-8 mb-8 border border-gray-800">
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-red-600 text-white px-4 py-2 rounded font-bold">ADMIN</span>
          <span className="text-red-400 font-semibold">Dashboard</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Platform Administration
        </h1>
        <p className="text-gray-300">
          Manage the NIT Hamirpur placement review platform
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-gray-900 rounded-lg border border-gray-800">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin statistics...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Platform Statistics */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              📊 Platform Statistics
            </h2>
            
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-white mb-1">
                    {stats.overview?.totalReviews || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total Reviews</div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-white mb-1">
                    {stats.overview?.uniqueCompanies || 0}
                  </div>
                  <div className="text-sm text-gray-400">Companies</div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-white mb-1">
                    {stats.overview?.averageRating || 0}⭐
                  </div>
                  <div className="text-sm text-gray-400">Average Rating</div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    Active
                  </div>
                  <div className="text-sm text-gray-400">Platform Status</div>
                </div>
              </div>
            )}
          </div>

          {/* Admin Actions */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              ⚙️ Admin Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-white mb-2">Review Management</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Delete inappropriate or spam reviews directly from the review cards or detail pages.
                </p>
                <div className="text-xs text-gray-500">
                  ✅ Delete buttons visible on all reviews
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-white mb-2">User Management</h3>
                <p className="text-gray-400 text-sm mb-4">
                  All users are automatically assigned NIT Hamirpur as their college.
                </p>
                <div className="text-xs text-gray-500">
                  ✅ College-specific platform active
                </div>
              </div>
            </div>
          </div>

          {/* Platform Info */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              ℹ️ Platform Information
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span>Platform Type</span>
                <span className="text-white">NIT Hamirpur Exclusive</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span>Review Filtering</span>
                <span className="text-green-400">✅ Active</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span>College Auto-Assignment</span>
                <span className="text-green-400">✅ Active</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span>AI Summaries</span>
                <span className="text-green-400">✅ Optimized</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Admin Delete Access</span>
                <span className="text-green-400">✅ Enabled</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg p-6">
            <h3 className="font-semibold text-blue-400 mb-2">📋 Admin Instructions</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• <strong>Delete Reviews:</strong> Look for the 🗑️ button on review cards and detail pages</li>
              <li>• <strong>Monitor Content:</strong> Check reviews regularly for inappropriate content</li>
              <li>• <strong>Platform Stats:</strong> Visit this dashboard to see platform statistics</li>
              <li>• <strong>User Support:</strong> Only NIT Hamirpur students can create accounts</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}