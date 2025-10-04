import User from "../../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ------------------- SIGNUP -------------------
export const signup = async (req, res) => {
  try {
    const { name, email, pass, role, branch, year, rollNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(pass, salt);

    // Handle empty rollNumber - convert empty string to undefined for sparse index
    const processedRollNumber = rollNumber && rollNumber.trim() !== '' ? rollNumber.trim() : undefined;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      branch,
      year,
      rollNumber: processedRollNumber,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        branch: newUser.branch,
        year: newUser.year,
        rollNumber: newUser.rollNumber,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let message = "Duplicate entry found";
      
      if (field === 'email') {
        message = "Email already registered";
      } else if (field === 'rollNumber') {
        message = "Roll number already exists";
      }
      
      return res.status(400).json({ message });
    }
    
    res.status(500).json({ message: "Server error" });
  }
};
