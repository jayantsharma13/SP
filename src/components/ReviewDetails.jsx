import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService.js';
import authService from '../services/authService.js';

export function ReviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isAdmin = authService.isAdmin();

  useEffect(() => {
    const fetchReview = async () => {
      if (id) {
        try {
          const reviewData = await apiService.getReviewById(id);
          setReview(reviewData);
        } catch (error) {
          console.error('Error fetching review:', error);
          setReview(null);
        }
      }
      setLoading(false);
    };

    fetchReview();
  }, [id]);

  const handleDeleteReview = async () => {
    if (!isAdmin || !review) return;
    
    setIsDeleting(true);
    try {
      await apiService.deleteReview(review.id);
      setShowDeleteConfirm(false);
      alert('Review deleted successfully');
      navigate('/'); // Redirect to home page after deletion
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review: ' + error.message);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 bg-gray-900 rounded-lg border border-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading review...</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 bg-gray-900 rounded-lg border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-4">Episode Not Found</h1>
        <p className="text-gray-400 mb-8">The episode you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors"
        >
          ← Back to Episodes
        </button>
      </div>
    );
  }

  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    const amount = salary.amount.toLocaleString();
    const period = salary.period === 'yearly' ? '/year' : '/month';
    return `${salary.currency} ${amount}${period}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const StarRating = ({ rating, label }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-2xl ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`}>
        ★
      </span>
    ));
    return (
      <div className="flex items-center gap-2">
        <div className="flex">{stars}</div>
        <span className="text-xl font-bold text-white">{rating}</span>
        {label && <span className="text-sm text-gray-400">({label})</span>}
      </div>
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'Selected': return 'text-green-400';
      case 'Rejected': return 'text-red-400';
      case 'Pending': return 'text-blue-400';
      case 'Withdrew': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Episodes
        </button>
      </div>

      {/* Netflix-style Header */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-red-900 text-white rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative p-8 md:p-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="bg-red-600 text-white px-4 py-2 rounded font-bold text-lg">EPISODE</span>
              <span className="text-red-400 font-semibold">#{review.id}</span>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded font-bold transition-colors flex items-center gap-2"
                title="Delete Review (Admin Only)"
              >
                🗑️ Delete Review
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{review.companyName}</h1>
              <p className="text-2xl text-gray-200 mb-4">{review.jobRole}</p>
              <div className="flex flex-wrap gap-4 text-lg text-gray-300 mb-6">
                <span>📍 {review.location}</span>
                <span>💼 {review.jobType}</span>
                <span className={getDifficultyColor(review.difficulty)}>🎯 {review.difficulty}</span>
                <span className={getResultColor(review.result)}>
                  {review.result === 'Selected' ? '✅' : review.result === 'Rejected' ? '❌' : review.result === 'Pending' ? '⏳' : '🚪'} {review.result}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={review.rating.overall} />
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{formatDate(review.datePosted)}</span>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-black bg-opacity-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-400 mb-4">📊 Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Experience Type:</span>
                    <span className="text-white">{review.experienceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Duration:</span>
                    <span className="text-white">{review.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Process Clarity:</span>
                    <span className="text-white">{review.rating.processClarity}⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Interviewer Behavior:</span>
                    <span className="text-white">{review.rating.interviewerBehavior}⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Would Recommend:</span>
                    <span className="text-white">{review.rating.wouldRecommend}⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Experience */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              📖 The Full Story
            </h2>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-red-400 mb-4">"{review.reviewTitle}"</h3>
              <p className="text-gray-300 leading-relaxed text-lg">{review.overallExperience}</p>
              
              {review.salaryOffered && (
                <div className="mt-6">
                  <span className="inline-block bg-green-900 text-green-300 px-6 py-3 rounded-full font-bold border border-green-500">
                    💰 Salary Offered: {formatSalary(review.salaryOffered)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Process Breakdown */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">🎬 Process Breakdown</h3>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-red-400 mb-3">Experience Type</h4>
                  <p className="text-gray-300">{review.experienceType}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-red-400 mb-3">Total Duration</h4>
                  <p className="text-gray-300">{review.duration}</p>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-red-400 mb-3">Process Stages</h4>
              <div className="flex flex-wrap gap-2">
                {review.processStages.map((stage, index) => (
                  <span key={index} className="bg-gray-700 text-gray-300 px-4 py-2 rounded-full border border-gray-600">
                    {index + 1}. {stage}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Questions Asked */}
          {review.questionsAsked && review.questionsAsked.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">❓ Questions Asked</h3>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="space-y-4">
                  {review.questionsAsked.map((question, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded border border-gray-600">
                      <p className="text-gray-300 leading-relaxed">{question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preparation Tips */}
          {review.preparationTips && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">💡 Preparation Tips</h3>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-300 leading-relaxed text-lg">{review.preparationTips}</p>
              </div>
            </div>
          )}

          {/* Advice for Future Candidates */}
          {review.adviceForFuture && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">🎯 Advice for Future Candidates</h3>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-300 leading-relaxed text-lg">{review.adviceForFuture}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">🏷️ Tags</h3>
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-900 text-blue-300 px-3 py-1 rounded text-sm border border-blue-500">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* About the Reviewer */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">🎓 About the Reviewer</h3>
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-red-400">College:</span>
                <p className="text-gray-300 mt-1">{review.reviewerInfo.college}</p>
              </div>
              <div>
                <span className="font-semibold text-red-400">Degree:</span>
                <p className="text-gray-300 mt-1">{review.reviewerInfo.degree}</p>
              </div>
              <div>
                <span className="font-semibold text-red-400">Passing Year:</span>
                <p className="text-gray-300 mt-1">{review.reviewerInfo.passingYear}</p>
              </div>
              <div>
                <span className="font-semibold text-red-400">Experience:</span>
                <p className="text-gray-300 mt-1">{review.reviewerInfo.previousExperience}</p>
              </div>
              {review.reviewerInfo.cgpa && (
                <div>
                  <span className="font-semibold text-red-400">CGPA:</span>
                  <p className="text-gray-300 mt-1">{review.reviewerInfo.cgpa}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Actions */}
      <div className="mt-12 text-center">
        <button
          onClick={() => navigate('/submit')}
          className="px-8 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
        >
          🎬 Share Your Story
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-4">🗑️ Delete Review</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this review for <span className="font-semibold text-red-400">{review.companyName}</span>? 
              This action cannot be undone and will permanently remove this episode.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Deleting...
                  </>
                ) : (
                  <>
                    🗑️ Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
