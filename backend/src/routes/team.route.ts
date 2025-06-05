import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createTeam,
  getAllTeams,
  getTeamById,
} from "../controllers/team.controller";

const router = Router();

router.use(authenticate);

router.get("/", getAllTeams);
router.get("/:id", getTeamById);

router.post("/", createTeam);

export default router;
