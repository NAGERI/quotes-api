import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import app from "../server.js";

const prisma = new PrismaClient();

prisma.author.findUnique = jest.fn();

let token;
describe("authorRegister", () => {
  it("should return 201 with token and newAuthor if registration is successful", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "test", age: 25, password: "password" });
    token = response.body.token;

    expect(response.body.token).toBeDefined();
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.message).toBe("Author Created");
    expect(response.body.newAuthor).toEqual(
      expect.objectContaining({
        name: "test",
        age: 25,
      })
    );
  });

  it("should return 502 if registration fails", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "test01", age: "25", password: "password" });

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
    const response = await request(app)
      .post("/api/auth/login")
      .send({ name: "test", password: "incorrectPassword" });

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it("should return 200 with token if login is successful", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ name: "test", password: "password" });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.message).toBe("Login Successful ✔");
    expect(response.body.token).toBeDefined();
  });
});

afterAll(async () => {
  await prisma.author.deleteMany();
  await prisma.$disconnect();
});
