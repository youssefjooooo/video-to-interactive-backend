import express from "express";
import dotenv from "dotenv";
import videoRoutes from "./routes/videoRoutes.js";

dotenv.config({ path: "./config.env" });
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/video", videoRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
