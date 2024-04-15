import express from "express";

import { quotes } from "../controllers/quote.controller.js";
import { checkReqForAuthToken } from "../utils/jwt-auth.js";
import { validateReqQuotes } from "../utils/data-valdation.js";
import { isAdmin, isUser } from "../utils/middleware.js";

const quotesRouter = express.Router();

quotesRouter
  .route("/")
  .get([checkReqForAuthToken, isUser], quotes.getAllQuotes)
  .post([validateReqQuotes, isAdmin], quotes.createQuote);

quotesRouter
  .route("/:id")
  .get([checkReqForAuthToken, isUser], quotes.getQuote)
  .patch([checkReqForAuthToken, validateReqQuotes, isAdmin], quotes.updateQuote)
  .delete([checkReqForAuthToken, isAdmin], quotes.deleteQuote);

export default quotesRouter;
