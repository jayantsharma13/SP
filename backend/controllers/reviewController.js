import Review from '../models/Review.js';

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
      search
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
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const reviews = await Review.find(filter)
      .sort(sortConfig)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Transform _id to id for frontend compatibility
    const transformedReviews = reviews.map(review => ({
      ...review,
      id: review._id.toString(),
      _id: undefined
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
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get a single review by ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findById(id).lean();
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Transform _id to id for frontend compatibility
    const transformedReview = {
      ...review,
      id: review._id.toString(),
      _id: undefined
    };

    res.json({
      success: true,
      data: transformedReview
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
};

// Create a new review
export const createReview = async (req, res) => {
  try {
    const reviewData = req.body;
    
    // Validate required fields
    const requiredFields = ['companyName', 'jobRole', 'location', 'jobType', 'experienceType', 'rating'];
    const missingFields = requiredFields.filter(field => !reviewData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields
      });
    }

    // Create new review
    const review = new Review(reviewData);
    const savedReview = await review.save();

    // Transform _id to id for frontend compatibility
    const transformedReview = {
      ...savedReview.toObject(),
      id: savedReview._id.toString(),
      _id: undefined
    };

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: transformedReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    const review = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Get review statistics
export const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          companies: { $addToSet: '$companyName' },
          jobTypes: { $addToSet: '$jobType' }
        }
      },
      {
        $project: {
          _id: 0,
          totalReviews: 1,
          averageRating: { $round: ['$averageRating', 2] },
          uniqueCompanies: { $size: '$companies' },
          jobTypes: 1
        }
      }
    ]);

    // Get difficulty distribution
    const difficultyStats = await Review.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalReviews: 0,
          averageRating: 0,
          uniqueCompanies: 0,
          jobTypes: []
        },
        difficultyDistribution: difficultyStats,
        ratingDistribution: ratingStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};
