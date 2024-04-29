import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

/**
 * @param
 * @returns array of authors.
 */
const getAllAuthors = async (req, res) => {
  try {
    const authors = await prisma.author.findMany({
      select: {
        id: true,
        name: true,
        age: true,
        quoteId: true,
        role: true,
      },
    });
    return res.status(StatusCodes.OK).json(authors);
  } catch (error) {
    await prisma.$disconnect();
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Error getting Authors", error });
  }
};

/**
 * @route GET /author/:id
 * @desc Get Author with ID number
 * @returns a author given ID.
 */
const getAuthor = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide Author ID!" });
  }
  try {
    // Query the database.
    const author = await prisma.author.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        age: true,
        quoteId: true,
        role: true,
      },
    });

    if (!author) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Author not Found!" });
    }
    return res.status(StatusCodes.OK).json(author);
  } catch (error) {
    await prisma.$disconnect();
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error getting Author", error });
  }
};

/**
 * TODO: Return error if name is not unique.
 * @route PATCH /authors
 * @description Update a author
 * @returns String
 */
const updateAuthor = async (req, res) => {
  const { id } = req.params;
  const { name, age, role } = req.body;
  if (!id) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "Please provide Author ID!" });
  }
  try {
    const existingAuthor = await prisma.author.findUnique({
      where: { id: Number(id) },
    });

    if (!existingAuthor) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Author not Found." });
    }

    const updatedAuthor = await prisma.author.update({
      where: { id: Number(id) },
      data: {
        name,
        age,
        role,
      },
    });

    return res.status(StatusCodes.OK).json(updatedAuthor);
  } catch (error) {
    await prisma.$disconnect();
    return res.status(StatusCodes.NOT_FOUND).json({ error });
  }
};

/**
 * TODO: Return error if name is not unique.
 * @route POST /authors
 * @description Create a author
 * @returns String
 */
const createAuthor = async (req, res) => {
  if (!req.body) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: " Author Data not provided!" });
  }
  try {
    let { name, password } = req.body;
    const author = await prisma.author.findUnique({
      where: { name: name },
    });

    if (author != null && author.name === name) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Author already exists." });
    }
    let saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    const data = {
      ...req.body,
      password: hashed,
    };

    const newAuthor = await prisma.author.create({
      data: data,
    });
    return res.status(StatusCodes.CREATED).json(newAuthor);
  } catch (error) {
    await prisma.$disconnect();
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const deleteAuthor = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "Please provide Author ID!" });
  }

  try {
    const author = await prisma.author.findUnique({
      where: { id: Number(id) },
    });

    if (!author) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Author not found" });
    }

    await prisma.author.delete({
      where: { id: Number(id) },
    });

    return res.status(StatusCodes.NO_CONTENT).end();
  } catch (error) {
    await prisma.$disconnect();
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const authorLogin = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send("Please provide Username & Password!");
  }
  try {
    const author = await prisma.author.findUnique({
      where: { name: name },
    });
    let authorDBPassword = await bcrypt.compare(password, author.password);

    if (authorDBPassword) {
      const payload = {
        name,
        password: author.password,
        author_role: author.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res
        .status(StatusCodes.OK)
        .json({ message: "Login Successful ✔", token });
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Access denied ✖ Password is incorrect!" });
    }
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json(error);
  }
};

const authorRegister = async (req, res) => {
  const { password, name, age } = req.body;
  let saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);

  const payload = {
    name: name,
    password: hashed,
    author_role: "USER",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const data = { name, age, password: hashed };
  try {
    const newAuthor = await prisma.author.create({
      data,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Author Created", token, newAuthor });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_GATEWAY)
      .json({ error, message: "Failed to create author" });
  }
};
export const authors = {
  getAllAuthors,
  createAuthor,
  getAuthor,
  deleteAuthor,
  updateAuthor,
  authorLogin,
  authorRegister,
};
