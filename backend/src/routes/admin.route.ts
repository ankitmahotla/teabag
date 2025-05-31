import express from "express";
import multer from "multer";
import { uploadStudentCSV } from "../controllers/admin.controller";

const tempDir = "./tmp";
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = express.Router();

router.post("/upload-students", upload.single("file"), uploadStudentCSV);

export default router;
