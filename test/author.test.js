import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import app from "../server.js"; // Assuming your server is exported as 'app'

const prisma = new PrismaClient();
let TOKEN;

beforeAll(async () => {
  // clear table
  await prisma.author.deleteMany();
  // Create multiple authors in the database
  const quotes = [
    { text: "Advanced JavaScript is the best" },
    { text: "Lither Man said it" },
  ];
  const authors = [
    { name: "1Author1", age: 25, quoteId: 1, role: "USER" },
    { name: "Author2", age: 35, quoteId: 2, role: "USER" },
  ];

  for (let quote of quotes) {
    await prisma.quote.create({
      data: {
        ...quote,
      },
    });
  }

  for (let author of authors) {
    const password = "password123"; // You should generate a secure password here
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.author.create({
      data: {
        ...author,
        password: hashedPassword,
      },
    });
  }
  const resp = await request(app)
    .post("/api/auth/register")
    .send({ name: "test", age: 25, password: "password" });
  TOKEN = resp.body.token;
});

describe("authorRegister", () => {
  it("should return 201 with token and newAuthor if registration is successful", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "test_user", age: 25, password: "password" });

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.message).toBe("Author Created");
    expect(response.body.token).toBeDefined();
    expect(response.body.newAuthor).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: "test_user",
        age: 25,
        role: "USER",
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

describe("GET /api/authors", () => {
  it("should return all authors", async () => {
    const response = await request(app)
      .get("/api/authors")
      .set("authorization", `Bearer ${TOKEN}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          age: expect.any(Number),
          id: expect.any(Number),
          name: expect.any(String),
          quoteId: expect.any(Number),
          role: expect.any(String),
        },
      ])
    );
  });
});

describe("GET /api/authors/:id", () => {
  it("should return the author with the given ID", async () => {
    const author = await prisma.author.findFirst();
    const response = await request(app)
      .get(`/api/authors/${author.id}`)
      .set("authorization", `Bearer ${TOKEN}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toBeDefined();
  });

  it("should return 404 if author with given ID does not exist", async () => {
    // Assuming author with id 999999 does not exist in the database
    const response = await request(app)
      .get("/api/authors/999999")
      .set("authorization", `Bearer ${TOKEN}`);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});

describe("POST /api/authors", () => {
  it("should create a new author", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAuthorData = {
      name: "Test Author",
      age: 30,
      password: hashedPassword,
    };

    const response = await request(app)
      .post("/api/authors")
      .send(newAuthorData)
      .set("authorization", `Bearer ${TOKEN}`);

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: newAuthorData.name,
        age: newAuthorData.age,
        quoteId: null,
        role: "USER",
      })
    );
  });
});

describe("PATCH /api/authors/:id", () => {
  it("should update the author with the given ID", async () => {
    const author = await prisma.author.findFirst();
    const updatedAuthorData = {
      name: "Updated Name",
      age: 40,
    };

    const response = await request(app)
      .patch(`/api/authors/${author.id}`)
      .send(updatedAuthorData)
      .set("Authorization", `Bearer ${TOKEN}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: author.id,
        name: updatedAuthorData.name,
        age: updatedAuthorData.age,
        quoteId: author.quoteId,
        role: author.role,
      })
    );
  });

  it("should return 404 if author with given ID does not exist", async () => {
    const response = await request(app)
      .patch("/api/authors/999999")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send({ name: "Updated Name", age: 40 });

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});

describe("DELETE /api/authors/:id", () => {
  it("should delete the author with the given ID", async () => {
    const author = await prisma.author.findFirst();
    const response = await request(app)
      .delete(`/api/authors/${author.id}`)
      .set("authorization", `Bearer ${TOKEN}`);

    expect(response.status).toBe(StatusCodes.NO_CONTENT);

    // Verify that the author has been deleted
    const deletedAuthor = await prisma.author.findUnique({
      where: { id: author.id },
    });
    expect(deletedAuthor).toBeNull();
  });

  it("should return 404 if author with given ID does not exist", async () => {
    const response = await request(app)
      .delete("/api/authors/999999")
      .set("authorization", `Bearer ${TOKEN}`);

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});

afterAll(async () => {
  // Clean up database after all tests are done
  await prisma.author.deleteMany();
  await prisma.$disconnect();
});
