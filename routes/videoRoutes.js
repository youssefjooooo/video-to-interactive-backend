import express from "express";
import processVideo from "../controllers/videoController.js";

const router = express.Router();

// Define routes
router.post("/process", processVideo);

export default router;
