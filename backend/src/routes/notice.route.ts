import { Router } from "express";
import {
  createNotice,
  getNoticesByTeam,
  updateNotice,
  deleteNotice,
} from "../controllers/notice.controller";

const router = Router();

router.post("/", createNotice);

router.get("/:teamId", getNoticesByTeam);

router.put("/:id", updateNotice);

router.delete("/:id", deleteNotice);

export default router;
