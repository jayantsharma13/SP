import { useState, useEffect } from 'react';
import aiService from '../services/aiService.js';

export function PreparationTips({ companyName, jobRole, onClose }) {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPreparationTips = async () => {
    if (!companyName || !jobRole) return;
    
    setLoading(true);
    setError('');
    
    try {
      const tipsData = await aiService.getPreparationTips(companyName, jobRole);
      setTips(tipsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch preparation tips');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when component mounts
  useEffect(() => {
    fetchPreparationTips();
  }, [companyName, jobRole]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🎯</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Preparation Tips</h2>
              <p className="text-gray-400 text-sm">
                {jobRole} at {companyName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-300">Generating personalized preparation tips...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-600 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-red-400">⚠️</span>
                <span className="text-red-300">{error}</span>
              </div>
              <button
                onClick={fetchPreparationTips}
                className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
              >
                Try again
              </button>
            </div>
          )}

          {tips && (
            <div className="space-y-8">
              {/* Preparation Tips */}
              {tips.tips && tips.tips.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="text-blue-400 mr-2">📚</span>
                    Preparation Strategy
                  </h3>
                  <div className="space-y-3">
                    {tips.tips.map((tip, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-400">
                        <p className="text-gray-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills to Focus */}
              {tips.skillsToFocus && tips.skillsToFocus.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="text-green-400 mr-2">🎯</span>
                    Key Skills & Topics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tips.skillsToFocus.map((skill, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3 border border-green-400/20">
                        <span className="text-gray-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Questions */}
              {tips.commonQuestions && tips.commonQuestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="text-yellow-400 mr-2">❓</span>
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {tips.commonQuestions.map((question, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-400">
                        <p className="text-gray-300 font-medium">Q: {question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process Insights */}
              {tips.processInsights && tips.processInsights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="text-purple-400 mr-2">🔍</span>
                    Interview Process Insights
                  </h3>
                  <div className="space-y-3">
                    {tips.processInsights.map((insight, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-400">
                        <p className="text-gray-300">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Based on {tips.basedOnReviews} review{tips.basedOnReviews !== 1 ? 's' : ''}
                  </span>
                  <span className="text-gray-500">
                    Generated: {tips.lastUpdated ? new Date(tips.lastUpdated).toLocaleString() : 'Now'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-800 rounded-b-xl">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              💡 Tips powered by Gemini AI analysis of real interview experiences
            </p>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}