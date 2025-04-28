import express from "express";
import processVideo from "../controllers/videoController.js";

const router = express.Router();

// Define routes
router.post("/", processVideo);

export default router;
