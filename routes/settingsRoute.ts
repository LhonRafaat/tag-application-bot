import express from "express";
import {
  getSetting,
  patchSettings,
  postSettings,
} from "../controllers/settingController";

const router = express.Router();

router
  .route("/api/settings")
  .get(getSetting)
  .post(postSettings)
  .patch(patchSettings);

export default router;
