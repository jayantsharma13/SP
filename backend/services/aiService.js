import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY?.trim();
console.log('GEMINI_API_KEY loaded:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

class AIService {
  /**
   * Check if API key is available
   */
  isApiKeyAvailable() {
    const apiKey = process.env.GEMINI_API_KEY;
    const isAvailable = !!apiKey && apiKey.trim() !== '' && apiKey.length > 20;
    console.log('API Key check - Available:', isAvailable, 'Length:', apiKey?.length || 0);
    return isAvailable;
  }

  /**
   * Generate a summary of company reviews
   * @param {Array} reviews - Array of review objects
   * @param {string} companyName - Name of the company
   * @returns {Object} - Generated summary with insights
   */
  async generateCompanySummary(reviews, companyName) {
    try {
      if (!reviews || reviews.length === 0) {
        return {
          summary: `No reviews available for ${companyName} yet.`,
          keyInsights: [],
          averageRating: 0,
          totalReviews: 0
        };
      }

      // Check if API key is available
      if (!this.isApiKeyAvailable()) {
        return this.generateFallbackSummary(reviews, companyName);
      }

      // Calculate statistics
      const stats = this.calculateStats(reviews);
      
      // Prepare review data for AI analysis
      const reviewData = reviews.map(review => ({
        jobRole: review.jobRole,
        location: review.location,
        jobType: review.jobType,
        difficulty: review.difficulty,
        result: review.result,
        overallExperience: review.overallExperience,
        preparationTips: review.preparationTips,
        adviceForFuture: review.adviceForFuture,
        rating: review.rating,
        processStages: review.processStages,
        experienceType: review.experienceType
      }));

      const prompt = this.buildSummaryPrompt(companyName, reviewData, stats);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summaryText = response.text();

      // Parse the AI response
      const parsedSummary = this.parseSummaryResponse(summaryText);

      return {
        ...parsedSummary,
        statistics: stats,
        totalReviews: reviews.length
      };

    } catch (error) {
      console.error('Error generating AI summary:', error);
      
      // Return fallback summary on API error
      return this.generateFallbackSummary(reviews, companyName);
    }
  }

  /**
   * Generate a fallback summary when AI is not available
   */
  generateFallbackSummary(reviews, companyName) {
    const stats = this.calculateStats(reviews);
    
    // Generate a basic summary based on statistics
    const topRoles = Object.entries(stats.jobTypeDistribution || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 1)
      .map(([role]) => role);

    const summary = `${stats.averageRating}/5 rating with ${stats.selectionRate}% success rate.`;

    const keyInsights = [
      `${stats.selectionRate}% get selected`,
      `Top role: ${topRoles[0] || 'Various'}`
    ];

    return {
      summary,
      keyInsights,
      strengths: ["Structured process", "Good opportunities"],
      challenges: ["Competitive selection"],
      recommendedPreparation: [
        "Master technical skills",
        "Practice behavioral questions", 
        "Research company culture"
      ],
      statistics: stats,
      totalReviews: reviews.length,
      isAIGenerated: false
    };
  }

  /**
   * Generate personalized preparation tips based on reviews
   * @param {Array} reviews - Array of review objects for specific role/company
   * @param {string} jobRole - Target job role
   * @returns {Object} - Personalized tips and insights
   */
  async generatePreparationTips(reviews, jobRole, companyName) {
    try {
      if (!reviews || reviews.length === 0) {
        return {
          tips: [`Start preparing for ${jobRole} role at ${companyName} by focusing on fundamentals.`],
          commonQuestions: [],
          skillsToFocus: [],
          processInsights: []
        };
      }

      // Check if API key is available
      if (!this.isApiKeyAvailable()) {
        return this.generateFallbackTips(reviews, jobRole, companyName);
      }

      const relevantReviews = reviews.filter(review => 
        review.jobRole.toLowerCase().includes(jobRole.toLowerCase())
      );

      const prompt = this.buildPreparationPrompt(relevantReviews, jobRole, companyName);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const tipsText = response.text();

      return this.parsePreparationResponse(tipsText);

    } catch (error) {
      console.error('Error generating preparation tips:', error);
      
      // Return fallback tips on API error
      return this.generateFallbackTips(reviews, jobRole, companyName);
    }
  }

  /**
   * Generate fallback preparation tips when AI is not available
   */
  generateFallbackTips(reviews, jobRole, companyName) {
    const relevantReviews = reviews.filter(review => 
      review.jobRole.toLowerCase().includes(jobRole.toLowerCase())
    );

    const allQuestions = [];
    const allTips = [];

    relevantReviews.forEach(review => {
      if (review.questionsAsked) allQuestions.push(...review.questionsAsked);
      if (review.preparationTips) allTips.push(review.preparationTips);
    });

    return {
      tips: [
        "Master core technical concepts",
        "Practice behavioral questions", 
        "Research company culture",
        "Prepare project explanations"
      ],
      commonQuestions: [...new Set(allQuestions)].slice(0, 5),
      skillsToFocus: [
        "Technical skills",
        "Problem solving",
        "Communication",
        "Leadership"
      ],
      processInsights: [
        `${relevantReviews.length} reviews available`,
        "Multiple interview rounds",
        "Technical + behavioral focus"
      ],
      isAIGenerated: false
    };
  }

  /**
   * Calculate statistics from reviews
   */
  calculateStats(reviews) {
    const totalReviews = reviews.length;
    let totalRating = 0;
    let selectedCount = 0;
    let rejectedCount = 0;
    const difficultyCount = { Easy: 0, Medium: 0, Hard: 0 };
    const jobTypeCount = {};
    const locationCount = {};

    reviews.forEach(review => {
      if (review.rating && review.rating.overall) {
        totalRating += review.rating.overall;
      }
      
      if (review.result === 'Selected') selectedCount++;
      if (review.result === 'Rejected') rejectedCount++;
      
      if (review.difficulty) {
        difficultyCount[review.difficulty] = (difficultyCount[review.difficulty] || 0) + 1;
      }
      
      if (review.jobType) {
        jobTypeCount[review.jobType] = (jobTypeCount[review.jobType] || 0) + 1;
      }
      
      if (review.location) {
        locationCount[review.location] = (locationCount[review.location] || 0) + 1;
      }
    });

    return {
      averageRating: totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0,
      selectionRate: totalReviews > 0 ? ((selectedCount / totalReviews) * 100).toFixed(1) : 0,
      difficultyDistribution: difficultyCount,
      jobTypeDistribution: jobTypeCount,
      locationDistribution: locationCount,
      totalReviews
    };
  }

  /**
   * Build prompt for company summary generation
   */
  buildSummaryPrompt(companyName, reviewData, stats) {
    return `Generate a VERY SHORT summary for ${companyName} based on ${reviewData.length} reviews.

Stats: ${stats.averageRating}/5 rating, ${stats.selectionRate}% selection rate
Main roles: ${Object.keys(stats.jobTypeDistribution || {}).slice(0, 2).join(', ')}
Difficulty: ${Object.keys(stats.difficultyDistribution || {}).sort((a,b) => (stats.difficultyDistribution[b] || 0) - (stats.difficultyDistribution[a] || 0))[0] || 'Medium'}

Respond in this EXACT JSON format with MAXIMUM limits:
{
  "summary": "1-2 sentences only about interview process and company culture",
  "keyInsights": [
    "Max 2 insights, each under 15 words"
  ],
  "strengths": [
    "Max 2 strengths, each under 10 words"
  ],
  "challenges": [
    "Max 1 challenge, under 12 words"
  ],
  "recommendedPreparation": [
    "Max 3 tips, each under 12 words"
  ]
}

Keep everything EXTREMELY concise. No explanations, just key points.`;
  }

  /**
   * Build prompt for preparation tips generation
   */
  buildPreparationPrompt(reviews, jobRole, companyName) {
    const questionsAsked = [];
    const preparationTips = [];

    reviews.forEach(review => {
      if (review.questionsAsked) {
        questionsAsked.push(...review.questionsAsked);
      }
      if (review.preparationTips) {
        preparationTips.push(review.preparationTips);
      }
    });

    const uniqueQuestions = [...new Set(questionsAsked)].slice(0, 8);
    const uniqueTips = [...new Set(preparationTips)].slice(0, 5);

    return `Generate SHORT preparation tips for ${jobRole} at ${companyName}.

Common questions: ${uniqueQuestions.join(', ')}
Tips from reviews: ${uniqueTips.join('. ')}

Respond in this EXACT JSON format:
{
  "tips": [
    "Max 4 tips, each under 15 words"
  ],
  "commonQuestions": [
    "Max 5 most frequent questions"
  ],
  "skillsToFocus": [
    "Max 4 skills, each under 8 words"
  ],
  "processInsights": [
    "Max 3 insights, each under 12 words"
  ]
}

Keep everything VERY concise and actionable.`;
  }

  /**
   * Parse AI response for company summary
   */
  parseSummaryResponse(responseText) {
    try {
      // Clean the response text and extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing if JSON is not properly formatted
      return {
        summary: responseText,
        keyInsights: [],
        strengths: [],
        challenges: [],
        recommendedPreparation: []
      };
    } catch (error) {
      console.error('Error parsing summary response:', error);
      return {
        summary: responseText,
        keyInsights: [],
        strengths: [],
        challenges: [],
        recommendedPreparation: []
      };
    }
  }

  /**
   * Parse AI response for preparation tips
   */
  parsePreparationResponse(responseText) {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        tips: [responseText],
        commonQuestions: [],
        skillsToFocus: [],
        processInsights: []
      };
    } catch (error) {
      console.error('Error parsing preparation response:', error);
      return {
        tips: [responseText],
        commonQuestions: [],
        skillsToFocus: [],
        processInsights: []
      };
    }
  }
}

export default new AIService();