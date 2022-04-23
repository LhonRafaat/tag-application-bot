import express from "express";
import { getMembers } from "../controllers/membersController.js";

const router = express.Router();

router.route("/api/members").get(getMembers);

export default router;
