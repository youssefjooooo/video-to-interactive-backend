import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import videoRoutes from "./routes/videoRoutes.js";

dotenv.config({ path: "./config.env" });
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // ✅ enable CORS for all origins

app.use("/api/video/process", videoRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
