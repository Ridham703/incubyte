import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import healthRouter from "./routes/health.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use("/api/v1", healthRouter);

app.use(errorHandler);

export default app;
