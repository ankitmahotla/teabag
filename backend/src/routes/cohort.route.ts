import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getUserCohorts } from "../controllers/cohort.controller";

const router = Router();

router.use(authenticate);

router.get("/getUserCohorts", getUserCohorts);

export default router;
