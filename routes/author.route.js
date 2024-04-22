import express from "express";

import { authors } from "../controllers/author.controller.js";
import { checkReqForAuthToken } from "../utils/jwt-auth.js";
import {
  validateReqAuthor,
  validateUpdateReqAuthor,
} from "../utils/data-valdation.js";
import { isAdmin, isUserOrAdmin } from "../utils/middleware.js";

const authorRouter = express.Router();

authorRouter
  .route("/")
  .get([checkReqForAuthToken, isUserOrAdmin], authors.getAllAuthors)
  .post(
    [checkReqForAuthToken, validateReqAuthor, isAdmin],
    authors.createAuthor
  );

authorRouter
  .route("/:id")
  .get([checkReqForAuthToken, isUserOrAdmin], authors.getAuthor)
  .patch(
    [checkReqForAuthToken, validateUpdateReqAuthor, isAdmin],
    authors.updateAuthor
  )
  .delete([checkReqForAuthToken, isAdmin], authors.deleteAuthor);
export default authorRouter;
