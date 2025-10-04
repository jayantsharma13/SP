// NIT Hamirpur specific seed data for placement reviews
const nitHamirpurReviews = [
  {
    companyName: 'Oracle',
    jobRole: 'Software Developer',
    location: 'Bangalore, India',
    jobType: 'Full-time',
    experienceType: 'Both',
    processStages: ['Resume Screening', 'Online Assessment', '2 Technical Rounds', 'HR Round'],
    difficulty: 'Medium',
    duration: '6 weeks',
    oaExperience: {
      platform: 'Oracle Online Assessment',
      topics: ['SQL', 'Java', 'Database Design', 'Logic Building'],
      questionsCount: 4,
      timeLimit: '120 minutes',
      difficulty: 'Medium',
      description: 'Focus on SQL queries, Java programming, and logical reasoning.'
    },
    interviewExperience: {
      rounds: [
        {
          roundName: 'Technical Round 1',
          duration: '45 minutes',
          topics: ['Java', 'Database Concepts', 'OOP'],
          questionsAsked: ['Implement HashMap', 'SQL joins explanation', 'Polymorphism in Java'],
          difficulty: 'Medium',
          interviewerProfile: 'Senior Software Engineer'
        },
        {
          roundName: 'Technical Round 2',
          duration: '30 minutes',
          topics: ['System Design', 'Oracle Technologies'],
          questionsAsked: ['Design a library management system', 'Oracle DB features'],
          difficulty: 'Medium',
          interviewerProfile: 'Technical Lead'
        }
      ]
    },
    result: 'Selected',
    salaryOffered: { amount: 420000, currency: 'INR', period: 'yearly' },
    reviewTitle: 'Oracle Software Developer - Great Learning Experience',
    overallExperience: 'Structured and fair interview process with helpful interviewers. Great work culture and growth.',
    preparationTips: 'Revise Java fundamentals, SQL, and basic system design. Understand Oracle technologies.',
    questionsAsked: ['Implement HashMap in Java', 'Complex SQL joins', 'Library management system design', 'Explain polymorphism'],
    adviceForFuture: 'Confidence in Java and SQL is key. Focus on problem-solving.',
    rating: {
      overall: 4, processClarity: 5, interviewerBehavior: 4,
      difficultyRating: 3, wouldRecommend: 4
    },
    reviewerInfo: {
      college: 'NIT Hamirpur', degree: 'B.Tech CSE',
      passingYear: 2024, cgpa: 8.2, previousExperience: 'Fresher'
    },
    tags: ['Oracle', 'Java', 'SQL', 'Database', 'Good Work Culture', 'Selected'],
    datePosted: '2024-01-15'
  },

  {
    companyName: 'DE Shaw',
    jobRole: 'Software Developer Engineer',
    location: 'Hyderabad, India',
    jobType: 'Full-time',
    experienceType: 'Both',
    processStages: ['Resume Screening', 'Online Assessment', '3 Technical Rounds', 'HR Round'],
    difficulty: 'Hard',
    duration: '8 weeks',
    oaExperience: {
      platform: 'HackerRank',
      topics: ['Advanced DSA', 'Dynamic Programming', 'Graph Algorithms', 'Mathematics'],
      questionsCount: 3,
      timeLimit: '180 minutes',
      difficulty: 'Hard',
      description: 'Extremely challenging questions requiring deep algorithmic knowledge.'
    },
    interviewExperience: {
      rounds: [
        {
          roundName: 'Technical Round 1',
          duration: '60 minutes',
          topics: ['Advanced Data Structures', 'Algorithms'],
          questionsAsked: ['LRU Cache implementation', 'Binary tree serialization'],
          difficulty: 'Hard',
          interviewerProfile: 'Senior Software Engineer'
        },
        {
          roundName: 'Technical Round 2',
          duration: '60 minutes',
          topics: ['System Design', 'Scalability'],
          questionsAsked: ['Design URL shortener', 'Database sharding concepts'],
          difficulty: 'Hard',
          interviewerProfile: 'Principal Engineer'
        },
        {
          roundName: 'Technical Round 3',
          duration: '45 minutes',
          topics: ['Problem Solving', 'Mathematics'],
          questionsAsked: ['Complex probability problems', 'Optimization challenges'],
          difficulty: 'Hard',
          interviewerProfile: 'Engineering Manager'
        }
      ]
    },
    result: 'Selected',
    salaryOffered: { amount: 5500000, currency: 'INR', period: 'yearly' },
    reviewTitle: 'DE Shaw SDE - Challenging but Rewarding',
    overallExperience: 'Highly rigorous interview process. Exceptional pay with high expectations.',
    preparationTips: 'Master advanced DSA, system design, and math. Practice regularly.',
    questionsAsked: ['LRU Cache', 'Median in stream', 'URL shortener', 'Probability problem'],
    adviceForFuture: 'Start early. Build speed and precision in solving hard problems.',
    rating: {
      overall: 5, processClarity: 4, interviewerBehavior: 4,
      difficultyRating: 5, wouldRecommend: 5
    },
    reviewerInfo: {
      college: 'NIT Hamirpur', degree: 'B.Tech CSE',
      passingYear: 2024, cgpa: 9.1, previousExperience: 'Fresher'
    },
    tags: ['DE Shaw', 'FAANG+', 'High Pay', 'Extremely Hard', 'Algorithm Expert', 'Selected'],
    datePosted: '2024-02-01'
  },

  {
    companyName: 'Microsoft',
    jobRole: 'Software Development Engineer',
    location: 'Hyderabad, India',
    jobType: 'Full-time',
    experienceType: 'Both',
    processStages: ['Resume Screening', 'Online Assessment', '3 Technical Rounds', 'HR Round'],
    difficulty: 'Medium',
    duration: '6 weeks',
    oaExperience: {
      platform: 'Microsoft Online Assessment',
      topics: ['Data Structures', 'Algorithms', 'Problem Solving'],
      questionsCount: 3,
      timeLimit: '150 minutes',
      difficulty: 'Medium',
      description: 'Well-structured problems focusing on core computer science concepts.'
    },
    interviewExperience: {
      rounds: [
        {
          roundName: 'Technical Round 1',
          duration: '60 minutes',
          topics: ['Arrays', 'Strings', 'Trees'],
          questionsAsked: ['Rotate array by k positions', 'Longest common subsequence'],
          difficulty: 'Medium',
          interviewerProfile: 'Software Engineer II'
        },
        {
          roundName: 'Technical Round 2',
          duration: '60 minutes',
          topics: ['Dynamic Programming', 'Graphs'],
          questionsAsked: ['Coin change problem', 'Shortest path algorithms'],
          difficulty: 'Medium',
          interviewerProfile: 'Senior Software Engineer'
        },
        {
          roundName: 'Technical Round 3',
          duration: '45 minutes',
          topics: ['System Design', 'Behavioral'],
          questionsAsked: ['Design a chat application', 'Leadership examples'],
          difficulty: 'Medium',
          interviewerProfile: 'Engineering Manager'
        }
      ]
    },
    result: 'Selected',
    salaryOffered: { amount: 2800000, currency: 'INR', period: 'yearly' },
    reviewTitle: 'Microsoft SDE - Dream Company Experience',
    overallExperience: 'Amazing interview experience with friendly interviewers. Great work-life balance.',
    preparationTips: 'Focus on medium-level DSA problems, system design basics, and behavioral questions.',
    questionsAsked: ['Array rotation', 'LCS', 'Coin change', 'Chat app design'],
    adviceForFuture: 'Be confident, explain your approach clearly, and ask clarifying questions.',
    rating: {
      overall: 5, processClarity: 5, interviewerBehavior: 5,
      difficultyRating: 3, wouldRecommend: 5
    },
    reviewerInfo: {
      college: 'NIT Hamirpur', degree: 'B.Tech CSE',
      passingYear: 2024, cgpa: 8.7, previousExperience: 'Fresher'
    },
    tags: ['Microsoft', 'FAANG', 'Work Life Balance', 'Dream Company', 'Selected'],
    datePosted: '2024-01-20'
  },

  {
    companyName: 'Goldman Sachs',
    jobRole: 'Technology Analyst',
    location: 'Bangalore, India',
    jobType: 'Full-time',
    experienceType: 'Both',
    processStages: ['Resume Screening', 'Online Assessment', '2 Technical Rounds', 'HR Round'],
    difficulty: 'Medium',
    duration: '5 weeks',
    oaExperience: {
      platform: 'HireVue + HackerRank',
      topics: ['Data Structures', 'Object Oriented Programming', 'Finance Basics'],
      questionsCount: 3,
      timeLimit: '120 minutes',
      difficulty: 'Medium',
      description: 'Mix of coding and finance-related questions.'
    },
    interviewExperience: {
      rounds: [
        {
          roundName: 'Technical Round 1',
          duration: '45 minutes',
          topics: ['Java', 'OOP', 'Data Structures'],
          questionsAsked: ['Design patterns in Java', 'Implement stack using queues'],
          difficulty: 'Medium',
          interviewerProfile: 'Vice President - Technology'
        },
        {
          roundName: 'Technical Round 2',
          duration: '45 minutes',
          topics: ['System Design', 'Database'],
          questionsAsked: ['Design trading system', 'Database optimization'],
          difficulty: 'Medium',
          interviewerProfile: 'Managing Director'
        }
      ]
    },
    result: 'Selected',
    salaryOffered: { amount: 2200000, currency: 'INR', period: 'yearly' },
    reviewTitle: 'Goldman Sachs Technology Analyst - Finance Meets Tech',
    overallExperience: 'Professional environment with focus on both technical skills and business understanding.',
    preparationTips: 'Strong Java/OOP concepts, basic system design, and some finance knowledge helps.',
    questionsAsked: ['Design patterns', 'Stack using queues', 'Trading system design'],
    adviceForFuture: 'Dress formally, understand basic finance concepts, and be confident.',
    rating: {
      overall: 4, processClarity: 4, interviewerBehavior: 5,
      difficultyRating: 3, wouldRecommend: 4
    },
    reviewerInfo: {
      college: 'NIT Hamirpur', degree: 'B.Tech CSE',
      passingYear: 2024, cgpa: 8.5, previousExperience: 'Summer Intern at fintech startup'
    },
    tags: ['Goldman Sachs', 'Finance', 'Technology', 'Professional Environment', 'Selected'],
    datePosted: '2024-02-10'
  },

  {
    companyName: 'Amazon',
    jobRole: 'Software Development Engineer',
    location: 'Chennai, India',
    jobType: 'Full-time',
    experienceType: 'Both',
    processStages: ['Resume Screening', 'Online Assessment', '4 Technical Rounds'],
    difficulty: 'Medium',
    duration: '7 weeks',
    oaExperience: {
      platform: 'Amazon Online Assessment',
      topics: ['Data Structures', 'Algorithms', 'Debugging'],
      questionsCount: 2,
      timeLimit: '105 minutes',
      difficulty: 'Medium',
      description: 'Two coding questions with debugging and work simulation.'
    },
    interviewExperience: {
      rounds: [
        {
          roundName: 'Technical Round 1',
          duration: '45 minutes',
          topics: ['Arrays', 'Strings', 'Amazon Leadership Principles'],
          questionsAsked: ['Two sum problem', 'Tell me about a time you failed'],
          difficulty: 'Easy',
          interviewerProfile: 'Software Development Engineer II'
        },
        {
          roundName: 'Technical Round 2',
          duration: '45 minutes',
          topics: ['Trees', 'Graphs', 'Leadership Principles'],
          questionsAsked: ['Binary tree level order traversal', 'Describe a challenging project'],
          difficulty: 'Medium',
          interviewerProfile: 'Senior Software Engineer'
        },
        {
          roundName: 'Technical Round 3',
          duration: '45 minutes',
          topics: ['Dynamic Programming', 'System Design'],
          questionsAsked: ['Edit distance problem', 'Design URL shortener'],
          difficulty: 'Medium',
          interviewerProfile: 'Principal Engineer'
        },
        {
          roundName: 'Bar Raiser Round',
          duration: '45 minutes',
          topics: ['Leadership Principles', 'Behavioral'],
          questionsAsked: ['Customer obsession examples', 'Dive deep scenarios'],
          difficulty: 'Medium',
          interviewerProfile: 'Bar Raiser'
        }
      ]
    },
    result: 'Rejected',
    reviewTitle: 'Amazon SDE - Leadership Principles Matter More Than Coding',
    overallExperience: 'Good technical questions but heavy focus on behavioral aspects and leadership principles.',
    preparationTips: 'Study Amazon Leadership Principles thoroughly. Practice STAR format for behavioral questions.',
    questionsAsked: ['Two sum', 'Level order traversal', 'Edit distance', 'Leadership scenarios'],
    adviceForFuture: 'Prepare stories for each leadership principle. Technical is just 50% of the battle.',
    rating: {
      overall: 3, processClarity: 4, interviewerBehavior: 4,
      difficultyRating: 3, wouldRecommend: 3
    },
    reviewerInfo: {
      college: 'NIT Hamirpur', degree: 'B.Tech CSE',
      passingYear: 2024, cgpa: 8.1, previousExperience: 'Fresher'
    },
    tags: ['Amazon', 'Leadership Principles', 'Behavioral Focus', 'Culture Fit', 'Rejected'],
    datePosted: '2024-01-30'
  },

  {
    companyName: 'Flipkart',
    jobRole: 'Software Development Engineer',
    location: 'Bangalore, India',
    jobType: 'Full-time',
    experienceType: 'Both',
    processStages: ['Resume Screening', 'Online Assessment', '3 Technical Rounds', 'HR Round'],
    difficulty: 'Medium',
    duration: '4 weeks',
    oaExperience: {
      platform: 'HackerEarth',
      topics: ['Arrays', 'Strings', 'Database', 'System Design'],
      questionsCount: 4,
      timeLimit: '150 minutes',
      difficulty: 'Medium',
      description: 'Mix of coding, SQL, and basic system design questions.'
    },
    interviewExperience: {
      rounds: [
        {
          roundName: 'Technical Round 1',
          duration: '60 minutes',
          topics: ['Data Structures', 'Problem Solving'],
          questionsAsked: ['Implement LRU cache', 'Find median in running stream'],
          difficulty: 'Medium',
          interviewerProfile: 'SDE II'
        },
        {
          roundName: 'Technical Round 2',
          duration: '45 minutes',
          topics: ['System Design', 'Database Design'],
          questionsAsked: ['Design e-commerce product catalog', 'Database indexing'],
          difficulty: 'Medium',
          interviewerProfile: 'Senior SDE'
        },
        {
          roundName: 'Technical Round 3',
          duration: '30 minutes',
          topics: ['Architecture', 'Scalability'],
          questionsAsked: ['How to handle 1M concurrent users', 'Microservices vs Monolith'],
          difficulty: 'Medium',
          interviewerProfile: 'Engineering Manager'
        }
      ]
    },
    result: 'Selected',
    salaryOffered: { amount: 2600000, currency: 'INR', period: 'yearly' },
    reviewTitle: 'Flipkart SDE - E-commerce Giant Experience',
    overallExperience: 'Great learning opportunity with focus on scalable systems and real-world applications.',
    preparationTips: 'Focus on system design, especially e-commerce related problems. Understand distributed systems.',
    questionsAsked: ['LRU cache', 'Running median', 'Product catalog design', 'Scalability questions'],
    adviceForFuture: 'Think from user perspective. Understand how e-commerce systems work at scale.',
    rating: {
      overall: 4, processClarity: 4, interviewerBehavior: 4,
      difficultyRating: 3, wouldRecommend: 4
    },
    reviewerInfo: {
      college: 'NIT Hamirpur', degree: 'B.Tech CSE',
      passingYear: 2024, cgpa: 8.4, previousExperience: 'Fresher'
    },
    tags: ['Flipkart', 'E-commerce', 'System Design', 'Scalability', 'Selected'],
    datePosted: '2024-02-05'
  },

  {
    companyName: 'Infosys',
    jobRole: 'Systems Engineer',
    location: 'Mysore, India',
    jobType: 'Full-time',
    experienceType: 'Interview',
    processStages: ['Resume Screening', 'Online Assessment', '1 Technical Round', '1 HR Round'],
    difficulty: 'Easy',
    duration: '3 weeks',
    oaExperience: {
      platform: 'Infosys Lex',
      topics: ['Logical Reasoning', 'Quantitative Aptitude', 'Verbal Ability'],
      questionsCount: 65,
      timeLimit: '95 minutes',
      difficulty: 'Easy',
      description: 'Aptitude test covering basic reasoning, math, and English skills.'
    },
    interviewExperience: {
      rounds: [
        {
          roundName: 'Technical Round',
          duration: '20 minutes',
          topics: ['Basic Programming', 'Computer Fundamentals'],
          questionsAsked: ['What is polymorphism?', 'Difference between array and linked list'],
          difficulty: 'Easy',
          interviewerProfile: 'Technical Lead'
        },
        {
          roundName: 'HR Round',
          duration: '15 minutes',
          topics: ['Personal Questions', 'Company Knowledge'],
          questionsAsked: ['Tell me about yourself', 'Why Infosys?'],
          difficulty: 'Easy',
          interviewerProfile: 'HR Manager'
        }
      ]
    },
    result: 'Selected',
    salaryOffered: { amount: 350000, currency: 'INR', period: 'yearly' },
    reviewTitle: 'Infosys Systems Engineer - Good Start for Freshers',
    overallExperience: 'Simple and straightforward process. Good training program for beginners.',
    preparationTips: 'Focus on aptitude, basic programming concepts, and be confident in HR round.',
    questionsAsked: ['Polymorphism', 'Array vs LinkedList', 'Personal introduction'],
    adviceForFuture: 'Don\'t stress too much. Be honest and show willingness to learn.',
    rating: {
      overall: 3, processClarity: 5, interviewerBehavior: 4,
      difficultyRating: 2, wouldRecommend: 3
    },
    reviewerInfo: {
      college: 'NIT Hamirpur', degree: 'B.Tech ECE',
      passingYear: 2024, cgpa: 7.8, previousExperience: 'Fresher'
    },
    tags: ['Infosys', 'Service Based', 'Training Program', 'Easy Process', 'Selected'],
    datePosted: '2024-01-25'
  },

  {
    companyName: 'TCS',
    jobRole: 'Assistant Systems Engineer',
    location: 'Multiple Locations',
    jobType: 'Full-time',
    experienceType: 'Interview',
    processStages: ['Resume Screening', 'Online Assessment', '1 Technical Round', '1 HR Round'],
    difficulty: 'Easy',
    duration: '2 weeks',
    oaExperience: {
      platform: 'TCS iON',
      topics: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Programming Logic'],
      questionsCount: 80,
      timeLimit: '90 minutes',
      difficulty: 'Easy',
      description: 'Standard aptitude test with some programming mcqs.'
    },
    interviewExperience: {
      rounds: [
        {
          roundName: 'Technical + HR Round',
          duration: '25 minutes',
          topics: ['Basic Programming', 'Projects', 'Personal Questions'],
          questionsAsked: ['Explain your project', 'What is inheritance?', 'Why TCS?'],
          difficulty: 'Easy',
          interviewerProfile: 'Assistant Manager'
        }
      ]
    },
    result: 'Selected',
    salaryOffered: { amount: 360000, currency: 'INR', period: 'yearly' },
    reviewTitle: 'TCS ASE - Reliable Mass Recruiter',
    overallExperience: 'Very basic process focusing more on communication skills than technical depth.',
    preparationTips: 'Practice aptitude, prepare your projects well, and communicate clearly.',
    questionsAsked: ['Project explanation', 'Inheritance concept', 'Motivation for TCS'],
    adviceForFuture: 'Be confident while explaining projects. Show enthusiasm for learning.',
    rating: {
      overall: 3, processClarity: 4, interviewerBehavior: 4,
      difficultyRating: 2, wouldRecommend: 3
    },
    reviewerInfo: {
      college: 'NIT Hamirpur', degree: 'B.Tech ME',
      passingYear: 2024, cgpa: 7.5, previousExperience: 'Fresher'
    },
    tags: ['TCS', 'Mass Recruiter', 'Service Based', 'Communication Focus', 'Selected'],
    datePosted: '2024-01-10'
  }
];

// Database connection and seeding logic
import mongoose from 'mongoose';
import Review from './models/Review.js';
import dotenv from 'dotenv';

dotenv.config();

const seedNITHamirpurDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studentspark');
    console.log('Connected to MongoDB');

    // Clear existing reviews (optional - remove this if you want to keep existing data)
    // await Review.deleteMany({});
    // console.log('Cleared existing reviews');

    // Insert NIT Hamirpur reviews
    const insertedReviews = await Review.insertMany(nitHamirpurReviews);
    console.log(`Successfully seeded ${insertedReviews.length} NIT Hamirpur reviews`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
if (process.argv[2] === 'seed') {
  seedNITHamirpurDatabase();
}

export default nitHamirpurReviews;