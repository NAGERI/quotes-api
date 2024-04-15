import express from "express";

import { authors } from "../controllers/author.controller.js";
import { checkReqForAuthToken } from "../utils/jwt-auth.js";
import {
  validateReqAuthor,
  validateUpdateReqAuthor,
} from "../utils/data-valdation.js";
import { isAdmin, isUser } from "../utils/middleware.js";

const authorRouter = express.Router();

authorRouter
  .route("/")
  .get([checkReqForAuthToken, isUser], authors.getAllAuthors)
  .post([validateReqAuthor, isAdmin], authors.createAuthor);

authorRouter
  .route("/:id")
  .get([checkReqForAuthToken, isUser], authors.getAuthor)
  .patch(
    [checkReqForAuthToken, validateUpdateReqAuthor, isAdmin],
    authors.updateAuthor
  )
  .delete([checkReqForAuthToken, isAdmin], authors.deleteAuthor);
export default authorRouter;
