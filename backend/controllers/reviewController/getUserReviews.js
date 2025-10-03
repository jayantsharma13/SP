import Review from '../../models/Review.js';

// Get reviews created by a specific user (by userId)
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'datePosted',
      sortOrder = 'desc',
    } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Find reviews by the specified user
    const reviews = await Review.find({ userId })
      .sort(sortConfig)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email branch year')
      .lean();

    // Transform _id to id for frontend compatibility
    const transformedReviews = reviews.map((review) => ({
      ...review,
      id: review._id.toString(),
      _id: undefined,
    }));

    // Get total count for pagination
    const total = await Review.countDocuments({ userId });

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: transformedReviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews',
      error: error.message,
    });
  }
};
