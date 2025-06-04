import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getUserCohorts } from "../controllers/user.controller";

const router = Router();

router.use(authenticate);

router.get("/cohorts", getUserCohorts);

export default router;
