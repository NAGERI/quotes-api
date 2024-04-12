import express from 'express'

import {getQuotes} from "../controllers/quote.controller.js"

const quoteRouter = express.Router()

quoteRouter.get("/", getQuotes)

export default quoteRouter;