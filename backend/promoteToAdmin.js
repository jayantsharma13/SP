import mongoose from 'mongoose';
import User from './models/UserModel.js';
import dotenv from 'dotenv';

dotenv.config();

const promoteUserToAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studentspark');
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      return;
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully promoted ${user.name} (${user.email}) to admin`);
    console.log(`User Details:`);
    console.log(`- Name: ${user.name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- College: ${user.college}`);
    console.log(`- Branch: ${user.branch}`);
    console.log(`- Role: ${user.role}`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Usage: node promoteToAdmin.js <user-email>');
  console.log('Example: node promoteToAdmin.js admin@nith.ac.in');
  process.exit(1);
}

promoteUserToAdmin(email);