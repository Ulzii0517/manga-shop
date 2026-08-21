import { authorize, protect } from "../../middleware/protect";
import User from "../../models/User";
import { clearTestDB, closeTestDB, connectTestDB } from "../testDb";
import jwt from "jsonwebtoken";

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret";
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("protect middleware", () => {
  it("token байхгүй бол next(err)-с MyError ирнэ", async () => {
    const req = { cookies: {}, headers: {} };
    const res = {};
    let catchErr;

    await protect(req, res, (err) => {
      catchErr = err;
    });

    expect(catchErr).toBeDefined();
    expect(catchErr.statusCode).toBe(401);
    expect(catchErr.message).toContain("Нэвтрэх шаардлагатай");
  });

  it("Зөв token-той бол req.user тохирно", async () => {
    const user = await User.create({
      name: "Bat",
      email: "bat@gmail.com",
      password: "123456",
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const req = { cookies: { "book-token": token }, headers: {} };
    const res = {};
    let nextCall = false;

    await protect(req, res, () => {
      nextCall = true;
    });

    expect(nextCall).toBe(true);
    expect(req.user.email).toBe("bat@gmail.com");
  });

  it("guest token бол req.user.role = user болно", async () => {
    const token = jwt.sign({ id: "guest" }, process.env.JWT_SECRET);
    const req = { cookies: { "book-token": token }, headers: {} };
    const res = {};

    await protect(req, res, () => {});

    expect(req.user._id).toBe("guest");
    expect(req.user.role).toBe("user");
  });
});

describe("authorize middleware", () => {
  it("зөв role-той бол next дуудагдана", () => {
    const middleware = authorize("admin");
    const req = { user: { role: "admin" } };
    let callNext = false;

    middleware(req, {}, () => {
      callNext = true;
    });
    expect(callNext).toBe(true);
  });

  it("Буруу role-той бол 403 алдаа өгнө", () => {
    const middleware = authorize("admin");
    const req = { user: { role: "user" } };

    expect(() => middleware(req, {}, () => {})).toThrow(
      "Танд энэ үйлдэл хийх эрх байхгүй",
    );
  });
});
