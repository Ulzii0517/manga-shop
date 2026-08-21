import MyError from "../../utils/myError";

describe("MyError", () => {
  it("message statusCode зөв оноогдоно", () => {
    const err = new MyError("Хэрэглэгч олдсонгүй", 404);

    expect(err.message).toBe("Хэрэглэгч олдсонгүй");
    expect(err.statusCode).toBe(404);
  });

  it("Error class-с удамшсан байх ёстой", () => {
    const err = new MyError("Алдаа", 500);

    expect(err instanceof Error).toBe(true);
  });
});
