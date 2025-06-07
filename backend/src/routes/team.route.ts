import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createTeam,
  getAllTeams,
  getPendingTeamJoinRequests,
  getTeamById,
  getTeamRequestStatus,
  requestToJoinTeam,
  togglePublishTeam,
  withdrawTeamJoiningRequest,
} from "../controllers/team.controller";

const router = Router();

router.use(authenticate);

router.get("/", getAllTeams);

router.get("/:teamId/request-status", getTeamRequestStatus);
router.post("/:teamId/request-join", requestToJoinTeam);
router.delete("/:teamId/request-join", withdrawTeamJoiningRequest);
router.put("/:teamId/toggle-publish", togglePublishTeam);
router.get("/:teamId/pending-requests", getPendingTeamJoinRequests);

router.get("/:id", getTeamById);
router.post("/", createTeam);

export default router;
