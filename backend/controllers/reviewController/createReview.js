import Review from '../../models/Review.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      userId: req.user._id, // Add user reference from auth
      reviewerInfo: {
        ...req.body.reviewerInfo,
        college: req.user.branch || req.body.reviewerInfo?.college,
        degree: req.user.year
          ? `Year ${req.user.year}`
          : req.body.reviewerInfo?.degree,
      },
    };

    // Validate required fields
    const requiredFields = [
      'companyName',
      'jobRole',
      'location',
      'jobType',
      'experienceType',
      'rating',
    ];
    const missingFields = requiredFields.filter((field) => !reviewData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields,
      });
    }

    // Create new review
    const review = new Review(reviewData);
    const savedReview = await review.save();

    // Transform _id to id for frontend compatibility
    const transformedReview = {
      ...savedReview.toObject(),
      id: savedReview._id.toString(),
      _id: undefined,
    };

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: transformedReview,
    });
  } catch (error) {
    console.error('Error creating review:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message,
    });
  }
};
