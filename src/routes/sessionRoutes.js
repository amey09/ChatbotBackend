import express from "express";
import {
  bookSession,
  createSession,
  deleteSession,
  getSessions,
} from "../controllers/sessionController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isWarden } from "../middlewares/isWardenMiddleware.js";

const router = express.Router();

router.post("/set", protect, isWarden, createSession);
router.patch("/update", protect, bookSession);
router.get("/", protect, protect, getSessions);
router.delete("/delete", protect, isWarden, deleteSession);

export default router;
