import mongoose from 'mongoose';

// Online Assessment Experience Schema
const oaExperienceSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  topics: [{ type: String }],
  questionsCount: { type: Number },
  timeLimit: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  description: { type: String }
});

// Interview Round Schema
const interviewRoundSchema = new mongoose.Schema({
  roundName: { type: String, required: true },
  duration: { type: String },
  topics: [{ type: String }],
  questionsAsked: [{ type: String }],
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  interviewerProfile: { type: String }
});

// Interview Experience Schema
const interviewExperienceSchema = new mongoose.Schema({
  rounds: [interviewRoundSchema]
});

// Rating Schema
const ratingSchema = new mongoose.Schema({
  overall: { type: Number, min: 1, max: 5, required: true },
  processClarity: { type: Number, min: 1, max: 5, required: true },
  interviewerBehavior: { type: Number, min: 1, max: 5, required: true },
  difficultyRating: { type: Number, min: 1, max: 5, required: true },
  wouldRecommend: { type: Number, min: 1, max: 5, required: true }
});

// Salary Schema
const salarySchema = new mongoose.Schema({
  amount: { type: Number },
  currency: { type: String, default: 'INR' },
  period: { type: String, enum: ['yearly', 'monthly'], default: 'yearly' }
});

// Reviewer Info Schema
const reviewerInfoSchema = new mongoose.Schema({
  college: { type: String },
  degree: { type: String },
  passingYear: { type: Number },
  cgpa: { type: Number },
  previousExperience: { type: String }
});

// Main Review Schema
const reviewSchema = new mongoose.Schema({
  // Basic Information
  companyName: { type: String, required: true, trim: true },
  jobRole: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  jobType: { type: String, required: true, enum: ['Full-time', 'Internship', 'Part-time', 'Contract'] },
  
  // Experience Details
  experienceType: { 
    type: String, 
    required: true, 
    enum: ['Interview', 'Online Assessment', 'Both'] 
  },
  processStages: [{ type: String }],
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  duration: { type: String },
  
  // Experiences
  oaExperience: oaExperienceSchema,
  interviewExperience: interviewExperienceSchema,
  
  // Outcome and Details
  result: { type: String, enum: ['Selected', 'Rejected', 'Pending', 'Withdrew'] },
  salaryOffered: salarySchema,
  
  // Review Content
  reviewTitle: { type: String, required: true },
  overallExperience: { type: String, required: true },
  preparationTips: { type: String },
  questionsAsked: [{ type: String }],
  adviceForFuture: { type: String },
  
  // Ratings
  rating: ratingSchema,
  
  // Reviewer Information
  reviewerInfo: reviewerInfoSchema,
  
  // Metadata
  tags: [{ type: String }],
  datePosted: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, {
  timestamps: true,
  collection: 'reviews'
});

// Indexes for better query performance
reviewSchema.index({ companyName: 1 });
reviewSchema.index({ jobRole: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ datePosted: -1 });
reviewSchema.index({ tags: 1 });
reviewSchema.index({ difficulty: 1 });

// Virtual for formatted date
reviewSchema.virtual('formattedDate').get(function() {
  return new Date(this.datePosted).toLocaleDateString();
});

// Transform function to include virtuals in JSON
reviewSchema.set('toJSON', { virtuals: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
