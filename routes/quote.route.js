import express from "express";

import { quotes } from "../controllers/quote.controller.js";
import { checkReqForAuthToken } from "../utils/jwt-auth.js";
import { validateReqQuotes } from "../utils/data-valdation.js";

const quotesRouter = express.Router();

quotesRouter
  .route("/")
  .get(checkReqForAuthToken, quotes.getAllQuotes)
  .post([validateReqQuotes], quotes.createQuote);

quotesRouter
  .route("/:id")
  .get(checkReqForAuthToken, quotes.getQuote)
  .patch([checkReqForAuthToken, validateReqQuotes], quotes.updateQuote)
  .delete([checkReqForAuthToken], quotes.deleteQuote);

export default quotesRouter;
