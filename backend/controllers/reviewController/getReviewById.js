import Review from '../../models/Review.js';

// Get a single review by ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('userId', 'name email branch year')
      .lean();

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Transform _id to id for frontend compatibility
    const transformedReview = {
      ...review,
      id: review._id.toString(),
      _id: undefined,
    };

    res.json({
      success: true,
      data: transformedReview,
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message,
    });
  }
};
