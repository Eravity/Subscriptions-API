import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import subscriptionRouter from "./routes/subscription.js";
import connectDB from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());

server.use("/api/v1/auth", authRouter);
server.use("/api/v1/users", userRouter);
server.use("/api/v1/subscriptions", subscriptionRouter);

server.use(errorMiddleware);

server.get("/", (req, res) => {
  res.send("Welcome to the Subscription Tracker API!");
});

server.listen(PORT, () => {
  console.log("Subscription Tracker API is running on http://localhost:3000");
  connectDB();
});

export default server;
