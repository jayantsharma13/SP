import { Link } from 'react-router-dom';
import { useState } from 'react';
import authService from '../services/authService.js';
import apiService from '../services/apiService.js';

export function ReviewCard({ review, onReviewDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isAdmin = authService.isAdmin();

  const handleDeleteReview = async () => {
    if (!isAdmin) return;
    
    setIsDeleting(true);
    try {
      await apiService.deleteReview(review.id);
      setShowDeleteConfirm(false);
      
      // Call parent callback to remove review from list
      if (onReviewDeleted) {
        onReviewDeleted(review.id);
      }
      
      // Show success message
      alert('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    const amount = salary.amount.toLocaleString();
    const period = salary.period === 'yearly' ? '/year' : '/month';
    return `${salary.currency} ${amount}${period}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-900 text-green-300 border border-green-500';
      case 'Medium': return 'bg-yellow-900 text-yellow-300 border border-yellow-500';
      case 'Hard': return 'bg-red-900 text-red-300 border border-red-500';
      default: return 'bg-gray-800 text-gray-300 border border-gray-600';
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'Selected': return 'bg-green-900 text-green-300 border border-green-500';
      case 'Rejected': return 'bg-red-900 text-red-300 border border-red-500';
      case 'Pending': return 'bg-blue-900 text-blue-300 border border-blue-500';
      case 'Withdrew': return 'bg-gray-800 text-gray-300 border border-gray-600';
      default: return 'bg-gray-800 text-gray-300 border border-gray-600';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-6 netflix-card-hover hover:border-red-500 transition-all duration-300 group">
      {/* Netflix-style Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
              EPISODE
            </span>
            <span className="text-red-400 text-sm">#{review.id}</span>
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{review.companyName}</h3>
          <p className="text-gray-300">{review.jobRole}</p>
          <p className="text-sm text-gray-400">{review.location} • {review.jobType}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            {isAdmin && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-700 hover:bg-red-800 text-white p-1.5 rounded text-xs transition-colors"
                title="Delete Review (Admin Only)"
              >
                🗑️
              </button>
            )}
            <StarRating rating={review.rating.overall} />
            <span className="text-lg font-bold text-white">{review.rating.overall}</span>
          </div>
          <p className="text-sm text-gray-400">{formatDate(review.datePosted)}</p>
        </div>
      </div>

      {/* Experience Type and Result */}
      <div className="flex gap-2 mb-4">
        <span className="inline-block bg-gray-800 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500">
          🎭 {review.experienceType}
        </span>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(review.difficulty)}`}>
          🎯 {review.difficulty}
        </span>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getResultColor(review.result)}`}>
          {review.result === 'Selected' ? '✅' : review.result === 'Rejected' ? '❌' : review.result === 'Pending' ? '⏳' : '🚪'} {review.result}
        </span>
      </div>

      {/* Review Title */}
      <h4 className="text-lg font-medium text-gray-200 mb-3 leading-relaxed">"{review.reviewTitle}"</h4>

      {/* Salary if offered */}
      {review.salaryOffered && (
        <div className="mb-4">
          <span className="inline-block bg-green-900 text-green-300 px-4 py-2 rounded-full text-sm font-medium border border-green-500">
            💰 {formatSalary(review.salaryOffered)}
          </span>
        </div>
      )}

      {/* Process Overview */}
      <div className="mb-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
        <p className="text-sm font-medium text-gray-300 mb-2">⏱️ Duration: <span className="text-white">{review.duration}</span></p>
        <div className="flex flex-wrap gap-1">
          {review.processStages.slice(0, 3).map((stage, index) => (
            <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs border border-gray-600">
              {stage}
            </span>
          ))}
          {review.processStages.length > 3 && (
            <span className="bg-gray-700 text-gray-400 px-2 py-1 rounded text-xs border border-gray-600">
              +{review.processStages.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Key Topics */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-300 mb-2">🧠 Key Topics:</p>
        <div className="flex flex-wrap gap-1">
          {review.oaExperience?.topics.slice(0, 2).map((topic, index) => (
            <span key={index} className="bg-purple-900 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500">
              {topic}
            </span>
          ))}
          {review.interviewExperience?.rounds[0]?.topics.slice(0, 2).map((topic, index) => (
            <span key={index} className="bg-orange-900 text-orange-300 px-2 py-1 rounded text-xs border border-orange-500">
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Rating breakdown - Netflix style */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex justify-between bg-gray-800 px-3 py-2 rounded border border-gray-700">
          <span className="text-gray-400">Process:</span>
          <span className="font-medium text-white">{review.rating.processClarity}⭐</span>
        </div>
        <div className="flex justify-between bg-gray-800 px-3 py-2 rounded border border-gray-700">
          <span className="text-gray-400">Difficulty:</span>
          <span className="font-medium text-white">{review.rating.difficultyRating}⭐</span>
        </div>
        <div className="flex justify-between bg-gray-800 px-3 py-2 rounded border border-gray-700">
          <span className="text-gray-400">Behavior:</span>
          <span className="font-medium text-white">{review.rating.interviewerBehavior}⭐</span>
        </div>
        <div className="flex justify-between bg-gray-800 px-3 py-2 rounded border border-gray-700">
          <span className="text-gray-400">Recommend:</span>
          <span className="font-medium text-white">{review.rating.wouldRecommend}⭐</span>
        </div>
      </div>

      {/* Experience preview */}
      <div className="mb-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
        <p className="text-gray-300 line-clamp-2 leading-relaxed">
          <span className="font-medium text-red-400">📖 Synopsis: </span>
          {review.overallExperience.length > 120 ? `${review.overallExperience.substring(0, 120)}...` : review.overallExperience}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {review.tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs border border-blue-500">
            #{tag}
          </span>
        ))}
        {review.tags.length > 3 && (
          <span className="bg-gray-700 text-gray-400 px-2 py-1 rounded text-xs border border-gray-600">
            +{review.tags.length - 3} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <p className="text-gray-300">🎓 {review.reviewerInfo.college}</p>
          <p className="text-gray-400">{review.reviewerInfo.degree} • Class of {review.reviewerInfo.passingYear}</p>
        </div>
        <Link 
          to={`/review/${review.id}`} 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors flex items-center gap-2"
        >
          ▶ Watch Full Story
        </Link>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-4">🗑️ Delete Review</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this review for <span className="font-semibold text-red-400">{review.companyName}</span>? 
              This action cannot be undone.
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
