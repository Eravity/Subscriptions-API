import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getSubscriptionDetails, getSubscriptions, getUpcomingRenewals, getUserSubscriptions } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorize, getSubscriptions);
subscriptionRouter.get("/upcoming-renewals", authorize, getUpcomingRenewals);
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);
subscriptionRouter.get("/:id", authorize, getSubscriptionDetails);
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.put("/:id", (req, res) => res.send({ message: "UPDATE a subscription" }));
subscriptionRouter.delete("/:id", (req, res) => res.send({ message: "DELETE a subscription" }));
subscriptionRouter.put("/:id/cancel", (req, res) => res.send({ message: "CANCEL a subscription" }));

export default subscriptionRouter;