import express from "express";
import {
  deleteMember,
  getMembers,
  patchUser,
} from "../controllers/membersController";

const router = express.Router();

router.route("/api/members").get(getMembers).patch(patchUser);
router.route("/api/members/:id").delete(deleteMember);

export default router;
