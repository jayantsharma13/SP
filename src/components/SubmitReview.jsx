import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService.js';

export function SubmitReview() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    location: '',
    jobType: 'Full-time',
    experienceType: 'Both',
    processStages: [],
    difficulty: 'Medium',
    duration: '',
    salaryOffered: {
      amount: 0,
      currency: 'INR',
      period: 'yearly'
    },
    rating: {
      overall: 5,
      processClarity: 5,
      interviewerBehavior: 5,
      difficultyRating: 5,
      wouldRecommend: 5
    },
    reviewTitle: '',
    overallExperience: '',
    preparationTips: '',
    adviceForFuture: '',
    questionsAsked: [],
    reviewerInfo: {
      college: '',
      degree: '',
      passingYear: new Date().getFullYear(),
      previousExperience: 'Fresher'
    },
    result: 'Pending',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [stageInput, setStageInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parent === 'salaryOffered' && child === 'amount' ? Number(value) : 
                   parent === 'reviewerInfo' && child === 'passingYear' ? Number(value) :
                   parent === 'reviewerInfo' && child === 'cgpa' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRatingChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      rating: {
        ...prev.rating,
        [category]: value
      }
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddStage = () => {
    if (stageInput.trim() && !formData.processStages.includes(stageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        processStages: [...prev.processStages, stageInput.trim()]
      }));
      setStageInput('');
    }
  };

  const handleRemoveStage = (stageToRemove) => {
    setFormData(prev => ({
      ...prev,
      processStages: prev.processStages.filter(stage => stage !== stageToRemove)
    }));
  };

  const handleAddQuestion = () => {
    if (questionInput.trim() && !formData.questionsAsked.includes(questionInput.trim())) {
      setFormData(prev => ({
        ...prev,
        questionsAsked: [...prev.questionsAsked, questionInput.trim()]
      }));
      setQuestionInput('');
    }
  };

  const handleRemoveQuestion = (questionToRemove) => {
    setFormData(prev => ({
      ...prev,
      questionsAsked: prev.questionsAsked.filter(question => question !== questionToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      const newReview = await apiService.createReview(formData);
      // Navigate to the newly created review
      navigate(`/review/${newReview.id}`);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.message || 'Failed to submit review. Please try again.');
      setSubmitting(false);
    }
  };

  const RatingInput = ({ label, category, value }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleRatingChange(category, rating)}
            className={`text-2xl ${rating <= value ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
        <span className="text-sm text-gray-400 ml-2">{value}/5</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-2xl p-8 border border-gray-800">
      <div className="flex items-center gap-4 mb-8">
        <span className="bg-red-600 text-white px-4 py-2 rounded font-bold">NEW EPISODE</span>
        <span className="text-red-400 font-semibold">Create Your Story</span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-8">🎬 Share Your Interview Experience</h1>
      
      {error && (
        <div className="bg-red-600 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">🏢 Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Role *</label>
              <input
                type="text"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Experience Type and Process */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">🎭 Experience Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Experience Type</label>
              <select
                name="experienceType"
                value={formData.experienceType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="Interview">Interview Only</option>
                <option value="Online Assessment">Online Assessment Only</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 2 weeks, 1 month"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Review Content */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">📝 Your Story</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Review Title *</label>
              <input
                type="text"
                name="reviewTitle"
                value={formData.reviewTitle}
                onChange={handleInputChange}
                required
                placeholder="e.g., Amazing experience at Google for SDE role"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Overall Experience *</label>
              <textarea
                name="overallExperience"
                value={formData.overallExperience}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="Describe your overall interview experience..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Preparation Tips</label>
              <textarea
                name="preparationTips"
                value={formData.preparationTips}
                onChange={handleInputChange}
                rows={4}
                placeholder="What would you recommend for preparation?"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Advice for Future Candidates</label>
              <textarea
                name="adviceForFuture"
                value={formData.adviceForFuture}
                onChange={handleInputChange}
                rows={4}
                placeholder="Any advice for future candidates?"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">⭐ Rate Your Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RatingInput label="Overall Rating" category="overall" value={formData.rating.overall} />
            <RatingInput label="Process Clarity" category="processClarity" value={formData.rating.processClarity} />
            <RatingInput label="Interviewer Behavior" category="interviewerBehavior" value={formData.rating.interviewerBehavior} />
            <RatingInput label="Difficulty Rating" category="difficultyRating" value={formData.rating.difficultyRating} />
          </div>
          <div className="mt-4">
            <RatingInput label="Would Recommend" category="wouldRecommend" value={formData.rating.wouldRecommend} />
          </div>
        </div>

        {/* Reviewer Information */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">🎓 About You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">College *</label>
              <input
                type="text"
                name="reviewerInfo.college"
                value={formData.reviewerInfo.college}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Degree *</label>
              <input
                type="text"
                name="reviewerInfo.degree"
                value={formData.reviewerInfo.degree}
                onChange={handleInputChange}
                required
                placeholder="e.g., B.Tech CSE, MBA"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Passing Year *</label>
              <input
                type="number"
                name="reviewerInfo.passingYear"
                value={formData.reviewerInfo.passingYear}
                onChange={handleInputChange}
                required
                min="2020"
                max="2030"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Previous Experience</label>
              <select
                name="reviewerInfo.previousExperience"
                value={formData.reviewerInfo.previousExperience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="Fresher">Fresher</option>
                <option value="1 year experience">1 year experience</option>
                <option value="2+ years experience">2+ years experience</option>
              </select>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">🎯 Result</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Result</label>
              <select
                name="result"
                value={formData.result}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
                <option value="Withdrew">Withdrew</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Salary Offered (if applicable)</label>
              <input
                type="number"
                name="salaryOffered.amount"
                value={formData.salaryOffered.amount}
                onChange={handleInputChange}
                placeholder="Amount"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            disabled={submitting}
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              '🎬 Share Your Story'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
