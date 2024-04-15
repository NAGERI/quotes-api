import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import app from "../server.js"; // Assuming your server is exported as 'app'

const prisma = new PrismaClient();

// Mock the prisma.author.findUnique method
prisma.author.findUnique = jest.fn();

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fake_token"),
}));
describe("authorRegister", () => {
  it("should return 201 with token and newAuthor if registration is successful", async () => {
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
    jwt.sign = jest.fn().mockReturnValue("fakeToken");

    // prisma.author.create = jest.fn().mockResolvedValue({
    //   name: "test001",
    //   password: "password",
    //   age: 25,
    // });

    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "test", age: 25, password: "password" });

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.message).toBe("Author Created");
    expect(response.body.token).toBe("fakeToken");
    expect(response.body.newAuthor).toEqual(
      expect.objectContaining({
        name: "test",
        age: 25,
      })
    );
  });

  it("should return 502 if registration fails", async () => {
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
    jwt.sign = jest.fn().mockReturnValue("fakeToken");

    prisma.author.create = jest
      .fn()
      .mockRejectedValue(new Error("Failed to create author"));

    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "test01", age: 25, password: "password" });

    expect(response.status).toBe(StatusCodes.BAD_GATEWAY);
    expect(response.body.message).toBe("Failed to create author");
  });
});

describe("authorLogin", () => {
  it("should return 404 if name or password is missing", async () => {
    const response = await request(app).post("/api/auth/login").send({});
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it("should return 404 if user was not found", async () => {
    prisma.author.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ name: "test", password: "incorrectPassword" });

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it("should return 200 with token if login is successful", async () => {
    const hashedPassword = await bcrypt.hash("correctPassword", 10);
    prisma.author.findUnique.mockResolvedValue({
      name: "tester02",
      password: hashedPassword,
      role: "USER",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ name: "tester02", password: "correctPassword" });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.message).toBe("Login Successful ✔");
    expect(response.body.token).toBeDefined();
  });
});

afterAll(async () => {
  // Clean up database after all tests are done

  jest.clearAllMocks();

  await prisma.author.deleteMany();
  await prisma.$disconnect();
});
