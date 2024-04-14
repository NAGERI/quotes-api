import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

/**
 * @param null
 * @returns array of quotes.
 */
const getAllQuotes = async (req, res) => {
  try {
    const quotesData = await prisma.quote.findMany();
    return res.status(StatusCodes.OK).json(quotesData);
  } catch (error) {
    await prisma.$disconnect();
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Error getting quotes", error });
  }
};

/**
 * @route GET /quotes/:id
 * @desc Get quote with ID number
 * @returns a quote given ID.
 */
const getQuote = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide Quote ID!" });
    return;
  }
  try {
    // Query the database.
    const quote = await prisma.quote.findUnique({
      where: { id: Number(id) },
    });
    res.status(StatusCodes.OK).json(quote);
  } catch (error) {
    await prisma.$disconnect();
    res.status(StatusCodes.NOT_FOUND).json({ msg: "Quote not Found!" });
  }
};

/**
 * @route PUT /quotes
 * @desc Update a quote
 * @returns String
 */
const updateQuote = async (req, res) => {
  const { id } = req.params;
  const { ...vals } = req.body;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide Quote ID!" });
  }
  try {
    const quote = await prisma.quote.update({
      where: { id: Number(id) },
      data: {
        text: vals.text,
      },
    });
    return res.status(StatusCodes.OK).json(quote);
  } catch (error) {
    await prisma.$disconnect();
    return res.status(StatusCodes.NOT_MODIFIED).json({ error });
  }
};

/**
 * @route POST /quotes
 * @desc Create a quote
 * @returns String
 */
const createQuote = async (req, res) => {
  if (!req.body) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: " Quote Data not provided!" });
  }
  try {
    const newQuote = await prisma.quote.create({
      data: req.body,
    });
    return res.status(StatusCodes.CREATED).json(newQuote);
  } catch (error) {
    await prisma.$disconnect();
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const deleteQuote = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide Quote ID!" });
  }
  const quote = await prisma.quote.delete({
    where: { id: Number(id) },
  });
  return res.status(StatusCodes.NO_CONTENT).json(quote);
};

export const quotes = {
  getAllQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
};
