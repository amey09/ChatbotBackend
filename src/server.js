import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import connectDB from "./config/db.js";
import express from "express";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(port, () => console.log(`Server started on port ${port}`));
