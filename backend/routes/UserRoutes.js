import { Router } from "express";
import { login } from "../controllers/userController/loginController";
import { signup } from "../controllers/userController/signup";
const userRouter = Router();
userRouter.post("/login", login);
userRouter.post("/signup", signup);

export default userRouter;
