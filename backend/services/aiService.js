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
      .slice(0, 2)
      .map(([role]) => role);

    const summary = `Based on ${reviews.length} reviews, ${companyName} has a ${stats.averageRating}/5 rating with ${stats.selectionRate}% selection rate. Common roles: ${topRoles.join(', ')}.`;

    const keyInsights = [
      `${stats.selectionRate}% success rate from ${stats.totalReviews} candidates`,
      `Most hiring for: ${topRoles.join(', ')}`
    ];

    return {
      summary,
      keyInsights,
      strengths: ["Structured process", "Multiple opportunities"],
      challenges: ["Competitive selection"],
      recommendedPreparation: [
        "Focus on role-specific technical skills",
        "Practice behavioral questions",
        "Research company background"
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
    const allStages = [];

    relevantReviews.forEach(review => {
      if (review.questionsAsked) allQuestions.push(...review.questionsAsked);
      if (review.preparationTips) allTips.push(review.preparationTips);
      if (review.processStages) allStages.push(...review.processStages);
    });

    return {
      tips: [
        `Prepare thoroughly for ${jobRole} role at ${companyName}`,
        "Focus on both technical and behavioral questions",
        "Practice coding problems if it's a technical role",
        "Research the company's recent developments and culture",
        "Prepare questions to ask the interviewer",
        "Review your resume and be ready to discuss your experience"
      ],
      commonQuestions: [...new Set(allQuestions)].slice(0, 10),
      skillsToFocus: [
        "Technical skills relevant to the role",
        "Problem-solving abilities",
        "Communication skills",
        "Leadership and teamwork",
        "Company-specific knowledge"
      ],
      processInsights: [
        `Based on ${relevantReviews.length} reviews for ${jobRole}`,
        "Interview process typically involves multiple rounds",
        "Prepare for both technical and HR rounds",
        "Be ready to discuss your past projects in detail"
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
    return `Analyze the following interview reviews for ${companyName} and generate a concise company summary.

Company: ${companyName}
Total Reviews: ${reviewData.length}
Average Rating: ${stats.averageRating}/5
Selection Rate: ${stats.selectionRate}%

Review Data:
${JSON.stringify(reviewData, null, 2)}

Please provide a structured response in the following JSON format:
{
  "summary": "A brief 3-4 sentence overview of the company's interview process and key characteristics based on reviews",
  "keyInsights": [
    "2-3 most important insights about the interview process",
    "Focus on practical information for candidates"
  ],
  "strengths": [
    "Top 2-3 company strengths mentioned in reviews"
  ],
  "challenges": [
    "Main 1-2 challenges or concerns mentioned"
  ],
  "recommendedPreparation": [
    "Top 3-4 most effective preparation tips based on review patterns"
  ]
}

Keep the summary concise, actionable, and directly based on the provided review data. Prioritize the most impactful information for future candidates.`;
  }

  /**
   * Build prompt for preparation tips generation
   */
  buildPreparationPrompt(reviews, jobRole, companyName) {
    const questionsAsked = [];
    const preparationTips = [];
    const processStages = [];

    reviews.forEach(review => {
      if (review.questionsAsked) {
        questionsAsked.push(...review.questionsAsked);
      }
      if (review.preparationTips) {
        preparationTips.push(review.preparationTips);
      }
      if (review.processStages) {
        processStages.push(...review.processStages);
      }
    });

    return `Generate personalized preparation tips for the ${jobRole} role at ${companyName} based on the following review data:

Reviews: ${JSON.stringify(reviews, null, 2)}

Common Questions Asked: ${JSON.stringify(questionsAsked, null, 2)}
Preparation Tips from Reviews: ${JSON.stringify(preparationTips, null, 2)}
Process Stages: ${JSON.stringify(processStages, null, 2)}

Please provide a structured response in JSON format:
{
  "tips": [
    "5-7 specific preparation tips based on the review data"
  ],
  "commonQuestions": [
    "List of frequently asked questions from reviews"
  ],
  "skillsToFocus": [
    "Key skills and topics to focus on"
  ],
  "processInsights": [
    "Insights about the interview process and stages"
  ]
}

Make the tips specific, actionable, and directly based on the review experiences provided.`;
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