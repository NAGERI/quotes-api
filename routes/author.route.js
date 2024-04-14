import express from "express";

import { authors } from "../controllers/author.controller.js";
import { checkReqForAuthToken } from "../utils/jwt-auth.js";
import {
  validateReqAuthor,
  validateUpdateReqAuthor,
} from "../utils/data-valdation.js";

const authorRouter = express.Router();

authorRouter
  .route("/")
  .get(authors.getAllAuthors)
  .post([validateReqAuthor], authors.createAuthor);

authorRouter
  .route("/:id")
  .get(checkReqForAuthToken, authors.getAuthor)
  .patch([checkReqForAuthToken, validateUpdateReqAuthor], authors.updateAuthor)
  .delete([checkReqForAuthToken], authors.deleteAuthor);
export default authorRouter;
