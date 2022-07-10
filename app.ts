import express from "express";
import env from "dotenv";
import cors from "cors";
import memberRoutes from "./routes/memberRoutes";
import settingsRoute from "./routes/settingsRoute";
import adminRoutes from "./routes/adminRoutes";
import jwt from "jsonwebtoken";
import { loginCont } from "./controllers/adminController";
import { client } from "./client";

env.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

client();

app.use("/api/auth/login", loginCont);
app.use((req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  try {
    if (token && process.env.JWT_SECRET)
      jwt.verify(token, process.env.JWT_SECRET);

    //check for token
  } catch (error) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  }

  next();
});

app.use(memberRoutes);
app.use(settingsRoute);
app.use(adminRoutes);
app.use("*", (req, res) => {
  return res.status(404).json({
    msg: "Not found",
  });
});

export default app;
