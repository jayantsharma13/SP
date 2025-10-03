import Review from '../../models/Review.js';

// Get all reviews with filtering and sorting
export const getAllReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'datePosted',
      sortOrder = 'desc',
      company,
      difficulty,
      rating,
      jobType,
      search,
    } = req.query;

    // Build filter object
    const filter = {};

    if (company) {
      filter.companyName = { $regex: company, $options: 'i' };
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (rating) {
      filter.rating = { $gte: parseInt(rating) };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobRole: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with user population
    const reviews = await Review.find(filter)
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
    const total = await Review.countDocuments(filter);

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
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};
