import express from 'express'

import { getAuthors } from "../controllers/author.controller.js"

const authorRouter = express.Router()

authorRouter.get("/", getAuthors)

export default authorRouter;