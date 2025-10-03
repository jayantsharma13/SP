import Review from '../../models/Review.js';

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the review first to check ownership
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user is authorized to delete (owner or admin)
    if (
      review.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    // Delete the review
    await Review.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message,
    });
  }
};
