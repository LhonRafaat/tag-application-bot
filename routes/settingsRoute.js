import express from "express";
import { getSetting } from "../controllers/settingController.js";

const router = express.Router();

router.route("/api/settings").get(getSetting);

export default router;
