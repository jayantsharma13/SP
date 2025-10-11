import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReviewCard } from '../components/ReviewCard.jsx';
import { CompanySummary } from '../components/CompanySummary.jsx';
import { PreparationTips } from '../components/PreparationTips.jsx';
import apiService from '../services/apiService.js';
import authService from '../services/authService.js';

export function HomePage() {
  const [sortBy, setSortBy] = useState('date');
  const [filterByRating, setFilterByRating] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedView, setGroupedView] = useState(true);
  const [selectedCompanyForSummary, setSelectedCompanyForSummary] = useState('');
  const [showPreparationTips, setShowPreparationTips] = useState(false);
  const [selectedRoleForTips, setSelectedRoleForTips] = useState({ company: '', role: '' });

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const fetchedReviews = await apiService.getAllReviews();
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle review deletion
  const handleReviewDeleted = (deletedReviewId) => {
    setReviews(prevReviews => prevReviews.filter(review => review.id !== deletedReviewId));
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      const matchesSearch = searchTerm === '' || 
        review.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.reviewerInfo.degree && review.reviewerInfo.degree.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRating = filterByRating === null || 
        Math.floor(review.rating.overall) >= filterByRating;
      
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
        case 'rating':
          return b.rating.overall - a.rating.overall;
        case 'company':
          return a.companyName.localeCompare(b.companyName);
        default:
          return 0;
      }
    });

  // Group reviews by company
  const groupedReviews = filteredAndSortedReviews.reduce((groups, review) => {
    const company = review.companyName;
    if (!groups[company]) {
      groups[company] = [];
    }
    groups[company].push(review);
    return groups;
  }, {});

  // Sort companies by the number of reviews (descending) or alphabetically
  const sortedCompanies = Object.keys(groupedReviews).sort((a, b) => {
    if (sortBy === 'company') {
      return a.localeCompare(b);
    }
    // Default: sort by number of reviews (most reviews first)
    return groupedReviews[b].length - groupedReviews[a].length;
  });

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating.overall, 0) / reviews.length : 0;
  const selectedCount = reviews.filter((review) => review.result === 'Selected').length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Netflix-style Hero Section */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-red-900 text-white rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-600 text-white px-4 py-2 rounded font-bold text-lg">
              PLACEMENT REVIEWS
            </div>
            <div className="text-red-400 font-semibold">Original Series</div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
            Interview Experiences
          </h1>
          <p className="text-xl text-gray-200 mb-6 max-w-3xl leading-relaxed">
            Discover real interview experiences, online assessment insights, and placement strategies from NIT Hamirpur students. 
            Your next career breakthrough starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/submit"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded font-bold text-lg transition-colors flex items-center gap-2"
            >
              ▶ Share Your Story
            </Link>
            <div className="flex gap-8 text-gray-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{reviews.length}</div>
                <div className="text-sm">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{Object.keys(groupedReviews).length}</div>
                <div className="text-sm">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{averageRating.toFixed(1)}</div>
                <div className="text-sm">⭐ Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{selectedCount}</div>
                <div className="text-sm">Success Stories</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Netflix-style Filters and Search */}
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-8 border border-gray-800">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-gray-300 mb-2">🔍 Search Stories</label>
            <input
              type="text"
              placeholder="Search by company, role, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="date">📅 Newest Episodes</option>
                <option value="rating">⭐ Top Rated</option>
                <option value="company">🏢 Company A-Z</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Rating</label>
              <select
                value={filterByRating ?? ''}
                onChange={(e) => setFilterByRating(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Ratings</option>
                <option value="4">⭐⭐⭐⭐+ Highly Rated</option>
                <option value="3">⭐⭐⭐+ Good Stories</option>
                <option value="2">⭐⭐+ Average</option>
                <option value="1">⭐+ All Stories</option>
              </select>
            </div>

            {/* View Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">View Style</label>
              <div className="flex rounded-md overflow-hidden">
                <button
                  onClick={() => setGroupedView(true)}
                  className={`px-4 py-3 text-sm font-medium ${
                    groupedView 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } transition-colors`}
                >
                  🏢 By Company
                </button>
                <button
                  onClick={() => setGroupedView(false)}
                  className={`px-4 py-3 text-sm font-medium ${
                    !groupedView 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } transition-colors border-l border-gray-700`}
                >
                  📄 All Reviews
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active filters display */}
        {(searchTerm || filterByRating) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                🔍 "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-red-200 hover:text-white"
                >
                  ×
                </button>
              </span>
            )}
            {filterByRating && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                ⭐ {filterByRating}+ Stars
                <button 
                  onClick={() => setFilterByRating(null)}
                  className="text-red-200 hover:text-white"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>



      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-300 text-lg">
          📺 {filteredAndSortedReviews.length} reviews from {sortedCompanies.length} companies
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-red-400 mb-6">
            <svg className="animate-spin mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Loading Reviews...</h3>
          <p className="text-gray-400">Fetching the latest placement experiences...</p>
        </div>
      ) : (
      /* Netflix-style Reviews Grid */
      filteredAndSortedReviews.length === 0 ? (
        <div className="text-center py-16 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-red-400 mb-6">
            <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No episodes found</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Looks like this genre is empty! Be the first to create content for this category.
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors"
          >
            🎬 Create Your Episode
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">🎭 Interview Stories Collection</h2>
            
            {groupedView ? (
              /* Company-wise grouped reviews */
              <div className="space-y-8">
                {sortedCompanies.map((company) => (
                  <div key={company} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    {/* Company Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold text-white">{company}</h3>
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {groupedReviews[company].length} {groupedReviews[company].length === 1 ? 'Review' : 'Reviews'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>Avg Rating:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-white font-medium">
                              {(groupedReviews[company].reduce((sum, review) => sum + review.rating.overall, 0) / groupedReviews[company].length).toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCompanyForSummary(
                              selectedCompanyForSummary === company ? '' : company
                            )}
                            className={`px-3 py-1 text-white text-xs rounded transition-colors flex items-center gap-1 ${
                              selectedCompanyForSummary === company
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            🤖 {selectedCompanyForSummary === company ? 'Hide' : 'AI Summary'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* AI Company Summary - Inline */}
                    {selectedCompanyForSummary === company && (
                      <div className="mb-6">
                        <CompanySummary 
                          companyName={company}
                          isVisible={true}
                        />
                      </div>
                    )}

                    {/* Popular Roles for Preparation Tips */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-300 text-sm">Popular roles:</span>
                        {Array.from(new Set(groupedReviews[company].map(r => r.jobRole)))
                          .slice(0, 3)
                          .map(role => (
                            <button
                              key={role}
                              onClick={() => {
                                if (authService.isAuthenticated()) {
                                  setSelectedRoleForTips({ company, role });
                                  setShowPreparationTips(true);
                                } else {
                                  // Redirect to login for preparation tips
                                  window.location.href = '/login';
                                }
                              }}
                              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors flex items-center gap-1"
                              title={authService.isAuthenticated() ? `Get AI tips for ${role}` : 'Login required for personalized tips'}
                            >
                              🎯 {role} Tips
                              {!authService.isAuthenticated() && <span className="text-xs">🔒</span>}
                            </button>
                          ))}
                      </div>
                    </div>
                    
                    {/* Reviews Grid for this company */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {groupedReviews[company].map((review) => (
                        <ReviewCard key={review.id} review={review} onReviewDeleted={handleReviewDeleted} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Individual reviews in grid format */
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} onReviewDeleted={handleReviewDeleted} />
                ))}
              </div>
            )}
          </div>
        </>
      )
      )}

      {/* Netflix-style Call to Action */}
        {filteredAndSortedReviews.length > 0 && (
          <div className="mt-16 text-center bg-gradient-to-r from-red-900 via-gray-900 to-black rounded-lg p-12 border border-gray-800">
            <div className="bg-red-600 text-white px-4 py-2 rounded font-bold text-sm inline-block mb-4">
              EXCLUSIVE CONTENT
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Share Your Story?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
              Join your fellow NIT Hamirpur students in building the most comprehensive placement resource. Your experience matters!
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center px-12 py-4 bg-red-600 text-white rounded font-bold text-lg hover:bg-red-700 transition-colors"
            >
              🎬 Start Recording
            </Link>
          </div>
        )}

      {/* Preparation Tips Modal */}
      {showPreparationTips && selectedRoleForTips.company && selectedRoleForTips.role && (
        <PreparationTips
          companyName={selectedRoleForTips.company}
          jobRole={selectedRoleForTips.role}
          onClose={() => {
            setShowPreparationTips(false);
            setSelectedRoleForTips({ company: '', role: '' });
          }}
        />
      )}
    </div>
  );
}
