import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createTeam,
  disbandTeam,
  getAllTeams,
  getPendingTeamJoinRequests,
  getTeamById,
  getTeamRequestStatus,
  requestToJoinTeam,
  togglePublishTeam,
  updateTeamJoinRequestStatus,
  withdrawTeamJoiningRequest,
} from "../controllers/team.controller";

const router = Router();

router.use(authenticate);

router.get("/", getAllTeams);

router.get("/:teamId/request-status", getTeamRequestStatus);
router.post("/:teamId/request-join", requestToJoinTeam);
router.put("/:teamId/request-join", withdrawTeamJoiningRequest);
router.put("/:teamId/toggle-publish", togglePublishTeam);
router.get("/:teamId/pending-requests", getPendingTeamJoinRequests);
router.put("/:teamId/requests/:requestId/status", updateTeamJoinRequestStatus);
router.post("/:teamId/disband", disbandTeam);

router.get("/:id", getTeamById);
router.post("/", createTeam);

export default router;
