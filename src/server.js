import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import express from "express";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import cors from "cors";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

const allowedOrigins = [
    process.env.ALLOWED_ORIGIN,
    process.env.ALLOWED_ORIGIN_MAIN,
    process.env.ALLOWED_ORIGIN_SECONDARY,
    process.env.ALLOWED_ORIGIN_TERTIARY,
    process.env.ALLOWED_ORIGIN_DEVELOPMENT,
]

app.use(
  cors({
    origin: allowedOrigins,
      withCredentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/session", sessionRoutes);

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

export default app