import express from "express";
import { deleteMember, getMembers } from "../controllers/membersController.js";

const router = express.Router();

router.route("/api/members").get(getMembers);
router.route("/api/members/:id").delete(deleteMember);

export default router;
