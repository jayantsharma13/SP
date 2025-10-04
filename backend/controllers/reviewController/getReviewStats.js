import Review from '../../models/Review.js';

// Get review statistics
export const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $match: {
          'reviewerInfo.college': 'NIT Hamirpur'
        }
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          companies: { $addToSet: '$companyName' },
          jobTypes: { $addToSet: '$jobType' },
        },
      },
      {
        $project: {
          _id: 0,
          totalReviews: 1,
          averageRating: { $round: ['$averageRating', 2] },
          uniqueCompanies: { $size: '$companies' },
          jobTypes: 1,
        },
      },
    ]);

    // Get difficulty distribution
    const difficultyStats = await Review.aggregate([
      {
        $match: {
          'reviewerInfo.college': 'NIT Hamirpur'
        }
      },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      {
        $match: {
          'reviewerInfo.college': 'NIT Hamirpur'
        }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalReviews: 0,
          averageRating: 0,
          uniqueCompanies: 0,
          jobTypes: [],
        },
        difficultyDistribution: difficultyStats,
        ratingDistribution: ratingStats,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};
