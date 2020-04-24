const server = require("./server");

const request = require("supertest");
const db = require("./data/db-config");

describe("server", () => {
  beforeEach(async () => {
    await db("users").truncate(); //empty the table and reset the id back to 1
  });

  describe("GET /", () => {
    it("responds with 200 OK", () => {
      return request(server)
        .get("/")
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });

    it('returns { hello: "world" }', () => {
      return request(server)
        .get("/")
        .then((res) => {
          expect(res.body).toEqual(expect.objectContaining({ hello: "world" }));
        });
    });
  });

  describe("GET /api/users", () => {
    it("responds with 200 OK", () => {
      return request(server)
        .get("/api/users")
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });

    it("returns an array", () => {
      return request(server)
        .get("/api/users")
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it("user object have id, username and password", async () => {
      const inserted = await db("users").insert({
        username: "sametweb",
        password: "!234",
      });
      return request(server)
        .get("/api/users")
        .then((res) => {
          expect(res.body[0]).toHaveProperty("id");
          expect(res.body[0]).toHaveProperty("username");
          expect(res.body[0]).toHaveProperty("password");
        });
    });
  });

  describe("POST /api/users", () => {
    // check if sametweb exists, make sure it doesn't
    it("Adds a user to the database", async () => {
      const existing = await db("users").where({ username: "sametweb" });
      expect(existing).toHaveLength(0);

      //Add sametweb user
      await request(server)
        .post("/api/users")
        .send({ username: "sametweb", password: "123" })
        .then((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("username");
          expect(res.body).toHaveProperty("password");
        });

      // Add samet user
      await request(server)
        .post("/api/users")
        .send({ username: "samet", password: "123" })
        .then((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("username");
          expect(res.body).toHaveProperty("password");
        });

      // check if sametweb exists, make sure it does
      const sametweb = await db("users").where({ username: "sametweb" });
      expect(sametweb).toHaveLength(1);

      // check if all added users exist, make sure it does
      const all = await db("users");
      expect(all).toHaveLength(2);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("Deletes a user from the database", async () => {
      const existing = await db("users").where({ username: "sametweb" });
      expect(existing).toHaveLength(0);

      const inserted = await db("users").insert({
        username: "sametweb",
        password: "123",
      });
      expect(inserted).toHaveLength(1);

      await request(server)
        .delete(`/api/users/${inserted[0].id}`)
        .then((res) => {
          expect(res.status).toBe(204);
          expect(res.body).toEqual({});
        });
    });
  });
});
