import express from "express";
import { signup, login, logout,updateProfile,checkAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/signup", signup); // POST route for signup
router.post("/login", login);   // POST route for login
router.post("/logout", logout); // POST route for logout
router.put("/update-profile",protectRoute,updateProfile) //to edit profile and after authenucation
router.get("/check",protectRoute,checkAuth)


export default router;
