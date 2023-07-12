import app from "../src/app";
import supertest from "supertest";

const server = supertest(app);

describe("health tests", () => {
  it("should return 200 when ask /health", async () => {
    const { statusCode, text } = await server.get("/health");
    expect(statusCode).toBe(200);
    expect(text).toBe("ok!");
  });
});

describe("POST fruits tests", () => {
  it("should return 201 when inserting a fruit", async () => {
    const { statusCode } = await server.post("/fruits").send({
      name: "Banana",
      price: 1500,
    });
    expect(statusCode).toBe(201);
  });

  it("should return 409 when inserting a fruit that is already registered", async () => {
    const { statusCode } = await server.post("/fruits").send({
      name: "Banana",
      price: 1500,
    });
    expect(statusCode).toBe(409);
  });

  it("should return 409 when inserting a fruit that is already registered", async () => {
    const { statusCode } = await server.post("/fruits").send({});
    expect(statusCode).toBe(422);
  });
});

describe("GET fruits tests", () => {
  it("shoud return 404 when trying to get a fruit that doesn't exists", async () => {
    const { statusCode } = await server.get("/fruits/999");
    expect(statusCode).toBe(404);
  });

  it("should return 400 when id param is not valid", async () => {
    const { statusCode } = await server.get("/fruits/asdf");
    expect(statusCode).toBe(400);
  });

  it("should return a fruit given an id", async () => {
    const { statusCode, body } = await server.get("/fruits/1");
    expect(statusCode).toBe(200);
    expect(body).toMatchObject({
      name: "Banana",
      price: 1500,
    });
  });

  it("should return all fruits", async () => {
    const { statusCode, body } = await server.get("/fruits");
    expect(statusCode).toBe(200);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
        }),
      ])
    );
  });
});
