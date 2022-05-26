import express from "express";
import { deleteMember, getMembers } from "../controllers/membersController.js";
import { updateUser } from "../services/memberService.js";

const router = express.Router();

router.route("/api/members").get(getMembers).patch(updateUser);
router.route("/api/members/:id").delete(deleteMember);

export default router;
