import express from "express";
import { getSetting, postSettings } from "../controllers/settingController.js";

const router = express.Router();

router.route("/api/settings").get(getSetting).post(postSettings);

export default router;
