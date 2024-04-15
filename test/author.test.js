import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import app from "../server.js"; // Assuming your server is exported as 'app'

const prisma = new PrismaClient();

beforeAll(async () => {
  // clear table
  await prisma.author.deleteMany();
  // Create multiple authors in the database
  const authors = [
    { name: "1Author1", age: 25, quoteId: 1, role: "USER" },
    { name: "2Author2", age: 30, quoteId: 2, role: "ADMIN" },
    { name: "3Author3", age: 35, quoteId: 3, role: "USER" },
  ];

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
});
describe("GET /api/authors", () => {
  it("should return all authors", async () => {
    const response = await request(app).get("/api/authors");
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          age: expect.any(Number),
          id: expect.any(Number),
          name: expect.any(String),
          quoteId: expect.any(Number),
          role: expect.any(String),
        }),
      ])
    );
  });
});

describe("GET /api/authors/:id", () => {
  it("should return the author with the given ID", async () => {
    const author = await prisma.author.findFirst();
    const response = await request(app).get(`/api/authors/${author.id}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: author.id,
        name: author.name,
        age: author.age,
        quoteId: author.quoteId,
        role: author.role,
      })
    );
  });

  it("should return 404 if author with given ID does not exist", async () => {
    // Assuming author with id 999999 does not exist in the database
    const response = await request(app).get("/api/authors/999999");
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
      .send(newAuthorData);

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
      .send(updatedAuthorData);

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
      .send({ name: "Updated Name", age: 40 });

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});

describe("DELETE /api/authors/:id", () => {
  it("should delete the author with the given ID", async () => {
    const author = await prisma.author.findFirst();
    const response = await request(app).delete(`/api/authors/${author.id}`);

    expect(response.status).toBe(StatusCodes.NO_CONTENT);

    // Verify that the author has been deleted
    const deletedAuthor = await prisma.author.findUnique({
      where: { id: author.id },
    });
    expect(deletedAuthor).toBeNull();
  });

  it("should return 404 if author with given ID does not exist", async () => {
    const response = await request(app).delete("/api/authors/999999");
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});

afterAll(async () => {
  // Clean up database after all tests are done
  await prisma.author.deleteMany();
  await prisma.$disconnect();
});
