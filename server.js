import express from "express";
import dotenv from "dotenv";
import videoRoutes from "./routes/videoRoutes.js";

dotenv.config({ path: "./config.env" });
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/video/process", videoRoutes);

if (process.env.NODE_ENV === "production") {
  app.listen(port, () => {
    console.log(`Server running in production at http://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Server running in development at http://localhost:${port}`);
  });
}
