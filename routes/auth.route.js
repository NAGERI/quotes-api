import express from "express";

import { authors } from "../controllers/author.controller.js";
import { isUser } from "../utils/middleware.js";

const authRouter = express.Router();

authRouter.post("/login", isUser, authors.authorLogin);
authRouter.post("/register", authors.authorRegister);

export default authRouter;
