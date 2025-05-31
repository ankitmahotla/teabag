import { Router } from "express";
import { refreshTokens, signIn, signOut } from "../controllers/auth.controller";

const router = Router();

router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.post("/refresh-tokens", refreshTokens);

export default router;
