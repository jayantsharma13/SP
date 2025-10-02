import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
export default async function authentication(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }
    const val = jwt.verify(token, process.env.JWT_SECRET);
    if (!val) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    const id = val.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(" Error:", err);
  }
}
