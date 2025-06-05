import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getUserById,
  getUserCohorts,
  getUserTeamByCohort,
} from "../controllers/user.controller";

const router = Router();

router.use(authenticate);

router.get("/cohorts", getUserCohorts);
router.get("/:id", getUserById);
router.get("/team/:cohortId", getUserTeamByCohort);

export default router;
