import Review from '../../models/Review.js';
import aiService from '../../services/aiService.js';

/**
 * Generate AI summary for a specific company
 */
export const generateCompanySummary = async (req, res) => {
  try {
    const { companyName } = req.params;
    
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }

    // Fetch all reviews for the company
    const reviews = await Review.find({
      companyName: { $regex: new RegExp(companyName, 'i') }
    })
    .populate('userId', 'name branch year')
    .lean();

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No reviews found for ${companyName}`
      });
    }

    // Generate AI summary
    const summary = await aiService.generateCompanySummary(reviews, companyName);

    res.json({
      success: true,
      data: {
        companyName,
        ...summary,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating company summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate company summary',
      error: error.message
    });
  }
};

/**
 * Generate preparation tips for a specific role at a company
 */
export const generatePreparationTips = async (req, res) => {
  try {
    const { companyName, jobRole } = req.params;
    
    if (!companyName || !jobRole) {
      return res.status(400).json({
        success: false,
        message: 'Company name and job role are required'
      });
    }

    // Fetch reviews for the specific company and role
    const reviews = await Review.find({
      companyName: { $regex: new RegExp(companyName, 'i') },
      jobRole: { $regex: new RegExp(jobRole, 'i') }
    })
    .populate('userId', 'name branch year')
    .lean();

    // If no specific role reviews, fall back to all company reviews
    let fallbackReviews = [];
    if (reviews.length === 0) {
      fallbackReviews = await Review.find({
        companyName: { $regex: new RegExp(companyName, 'i') }
      })
      .populate('userId', 'name branch year')
      .lean();
    }

    const finalReviews = reviews.length > 0 ? reviews : fallbackReviews;

    if (finalReviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No reviews found for ${jobRole} role at ${companyName}`
      });
    }

    // Generate preparation tips
    const tips = await aiService.generatePreparationTips(finalReviews, jobRole, companyName);

    res.json({
      success: true,
      data: {
        companyName,
        jobRole,
        ...tips,
        basedOnReviews: finalReviews.length,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating preparation tips:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate preparation tips',
      error: error.message
    });
  }
};

/**
 * Get company insights dashboard data
 */
export const getCompanyInsights = async (req, res) => {
  try {
    const { companyName } = req.params;
    
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }

    // Fetch all reviews for the company
    const reviews = await Review.find({
      companyName: { $regex: new RegExp(companyName, 'i') }
    })
    .populate('userId', 'name branch year')
    .lean();

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No reviews found for ${companyName}`
      });
    }

    // Calculate detailed statistics
    const insights = calculateDetailedInsights(reviews);

    res.json({
      success: true,
      data: {
        companyName,
        ...insights,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching company insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company insights',
      error: error.message
    });
  }
};

/**
 * Calculate detailed insights for a company
 */
function calculateDetailedInsights(reviews) {
  const totalReviews = reviews.length;
  
  // Rating analysis
  const ratings = reviews.map(r => r.rating?.overall || 0).filter(r => r > 0);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;
  
  // Result analysis
  const results = reviews.reduce((acc, review) => {
    acc[review.result || 'Unknown'] = (acc[review.result || 'Unknown'] || 0) + 1;
    return acc;
  }, {});
  
  // Difficulty analysis
  const difficulty = reviews.reduce((acc, review) => {
    acc[review.difficulty || 'Unknown'] = (acc[review.difficulty || 'Unknown'] || 0) + 1;
    return acc;
  }, {});
  
  // Job role analysis
  const jobRoles = reviews.reduce((acc, review) => {
    acc[review.jobRole] = (acc[review.jobRole] || 0) + 1;
    return acc;
  }, {});
  
  // Location analysis
  const locations = reviews.reduce((acc, review) => {
    acc[review.location] = (acc[review.location] || 0) + 1;
    return acc;
  }, {});
  
  // Experience type analysis
  const experienceTypes = reviews.reduce((acc, review) => {
    acc[review.experienceType] = (acc[review.experienceType] || 0) + 1;
    return acc;
  }, {});
  
  // Recent reviews trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const recentReviews = reviews.filter(review => 
    new Date(review.createdAt) >= sixMonthsAgo
  );
  
  return {
    overview: {
      totalReviews,
      averageRating: parseFloat(avgRating),
      recentReviews: recentReviews.length
    },
    results,
    difficulty,
    jobRoles,
    locations,
    experienceTypes,
    trends: {
      recentActivity: recentReviews.length,
      growthRate: totalReviews > 0 ? ((recentReviews.length / totalReviews) * 100).toFixed(1) : 0
    }
  };
}