import { useState, useEffect } from 'react';
import aiService from '../services/aiService.js';

export function CompanySummary({ companyName, isVisible = true }) {
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (companyName && isVisible) {
      fetchCompanyData();
    }
  }, [companyName, isVisible]);

  const fetchCompanyData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch both summary and insights in parallel
      const [summaryData, insightsData] = await Promise.all([
        aiService.getCompanySummary(companyName),
        aiService.getCompanyInsights(companyName)
      ]);
      
      setSummary(summaryData);
      setInsights(insightsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch company data');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
          <span className="text-gray-300 text-sm">Generating AI insights...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-600 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-red-400">⚠️</span>
          <span className="text-red-300">{error}</span>
        </div>
        <button
          onClick={fetchCompanyData}
          className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!summary && !insights) return null;

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-4 mb-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-6 h-6 bg-gradient-to-r from-red-600 to-pink-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">🤖</span>
        </div>
        <div>
          <h3 className="text-base font-bold text-white">AI Insights for {companyName}</h3>
          <p className="text-gray-400 text-xs">Powered by Gemini AI</p>
        </div>
      </div>

      {/* Tab Navigation - Compact */}
      <div className="flex space-x-1 mb-3 bg-gray-800 rounded p-1">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-1 px-3 rounded text-xs font-medium transition-colors ${
            activeTab === 'summary'
              ? 'bg-red-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          📊 Summary
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-1 px-3 rounded text-xs font-medium transition-colors ${
            activeTab === 'insights'
              ? 'bg-red-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          📈 Details
        </button>
      </div>

      {/* Content */}
      {activeTab === 'summary' && summary && (
        <div className="space-y-4">
          {/* Main Summary */}
          <div>
            <h4 className="text-base font-semibold text-white mb-2">Quick Overview</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{summary.summary}</p>
          </div>

          {/* Statistics - Compact */}
          {summary.statistics && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-red-400">{summary.statistics.averageRating}</div>
                <div className="text-gray-400 text-xs">Rating</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-400">{summary.statistics.selectionRate}%</div>
                <div className="text-gray-400 text-xs">Success</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-400">{summary.totalReviews}</div>
                <div className="text-gray-400 text-xs">Reviews</div>
              </div>
            </div>
          )}

          {/* Key Insights - Compact */}
          {summary.keyInsights && summary.keyInsights.length > 0 && (
            <div>
              <h4 className="text-base font-semibold text-white mb-2">💡 Key Points</h4>
              <ul className="space-y-1">
                {summary.keyInsights.slice(0, 3).map((insight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1 text-xs">•</span>
                    <span className="text-gray-300 text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths & Challenges - Side by side, compact */}
          <div className="grid grid-cols-2 gap-4">
            {summary.strengths && summary.strengths.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Strengths</h4>
                <ul className="space-y-1">
                  {summary.strengths.slice(0, 2).map((strength, index) => (
                    <li key={index} className="text-gray-300 text-xs">• {strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {summary.challenges && summary.challenges.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Challenges</h4>
                <ul className="space-y-1">
                  {summary.challenges.slice(0, 2).map((challenge, index) => (
                    <li key={index} className="text-gray-300 text-xs">• {challenge}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Preparation Recommendations - Top 3 only */}
          {summary.recommendedPreparation && summary.recommendedPreparation.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-2">🎯 Top Prep Tips</h4>
              <ul className="space-y-1">
                {summary.recommendedPreparation.slice(0, 3).map((tip, index) => (
                  <li key={index} className="text-gray-300 text-xs">• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && insights && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h5 className="text-white font-semibold mb-2">Total Reviews</h5>
              <div className="text-2xl font-bold text-red-400">{insights.overview.totalReviews}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h5 className="text-white font-semibold mb-2">Average Rating</h5>
              <div className="text-2xl font-bold text-green-400">{insights.overview.averageRating}/5</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h5 className="text-white font-semibold mb-2">Recent Activity</h5>
              <div className="text-2xl font-bold text-blue-400">{insights.overview.recentReviews}</div>
            </div>
          </div>

          {/* Results Distribution */}
          {insights.results && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">📊 Interview Results</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(insights.results).map(([result, count]) => (
                  <div key={result} className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{count}</div>
                    <div className="text-gray-400 text-sm">{result}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job Roles */}
          {insights.jobRoles && Object.keys(insights.jobRoles).length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">💼 Popular Roles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(insights.jobRoles)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 6)
                  .map(([role, count]) => (
                    <div key={role} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                      <span className="text-gray-300">{role}</span>
                      <span className="text-red-400 font-semibold">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Difficulty Distribution */}
          {insights.difficulty && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">⚡ Difficulty Levels</h4>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(insights.difficulty).map(([level, count]) => (
                  <div key={level} className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{count}</div>
                    <div className="text-gray-400 text-sm">{level}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-700 text-center">
        <p className="text-gray-500 text-xs">
          AI Generated • {summary?.isAIGenerated !== false ? 'Gemini 2.0' : 'Stats Based'}
        </p>
      </div>
    </div>
  );
}