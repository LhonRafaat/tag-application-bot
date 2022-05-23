import express from "express";
import { loginCont, signupCont } from "../controllers/adminController.js";

const router = express.Router();

router.route("/api/auth/login").post(loginCont);
router.route("/api/auth/register").post(signupCont);

export default router;
