import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => res.send({ message: "GET all subscriptions" }));
subscriptionRouter.get("/:id", (req, res) => res.send({ message: "GET subscription details" }));
subscriptionRouter.post("/", (req, res) => res.send({ message: "CREATE a subscription" }));
subscriptionRouter.put("/:id", (req, res) => res.send({ message: "UPDATE a subscription" }));
subscriptionRouter.delete("/:id", (req, res) => res.send({ message: "DELETE a subscription" }));
subscriptionRouter.get("/user/:id", (req, res) => res.send({ message: "GET all user subscriptions" }));
subscriptionRouter.put("/:id/cancel", (req, res) => res.send({ message: "CANCEL a subscription" }));
subscriptionRouter.get("/upcoming-renewals", (req, res) => res.send({ message: "GET upcoming renewals" }));

export default subscriptionRouter;