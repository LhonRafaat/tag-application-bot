import express from "express";
import env from "dotenv";
import cors from "cors";
import memberRoutes from "./routes/memberRoutes.js";
import settingsRoute from "./routes/settingsRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import jwt from "jsonwebtoken";
import { loginCont } from "./controllers/adminController.js";
import { client } from "./client.js";
import rateLimit from "express-rate-limit";

env.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

client();

app.use("/api/auth/login", loginCont);
app.use(authLimiter);
app.use((req, res, next) => {
  try {
    jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
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
