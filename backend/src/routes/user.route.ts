import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getAllUserTeamJoiningRequestsByCohort,
  getUserById,
  getUserCohorts,
  getUserInteractions,
  getUsersInCohort,
  getUserTeamByCohort,
} from "../controllers/user.controller";

const router = Router();

router.use(authenticate);

router.get("/cohort/:cohortId", getUsersInCohort);
router.get("/:id/cohorts", getUserCohorts);
router.get("/:id", getUserById);
router.get("/:id/interactions", getUserInteractions);
router.get("/team/:cohortId", getUserTeamByCohort);
router.get("/requests/:cohortId", getAllUserTeamJoiningRequestsByCohort);

export default router;
