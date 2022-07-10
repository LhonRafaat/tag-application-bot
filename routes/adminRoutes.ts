import express from "express";
import { loginCont, signupCont } from "../controllers/adminController";

const router = express.Router();

router.route("/api/auth/register").post(signupCont);

export default router;
