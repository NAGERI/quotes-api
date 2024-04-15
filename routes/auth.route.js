import express from "express";

import { authors } from "../controllers/author.controller.js";

const authRouter = express.Router();

authRouter.post("/login", authors.authorLogin);
authRouter.post("/register", authors.authorRegister);

export default authRouter;
