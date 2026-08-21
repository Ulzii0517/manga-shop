import errorHandler from "../../middleware/error";

const createFakeRes = () => {
  const res = {};
  res.statusCode = null;
  res.body = null;
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.json = function (data) {
    res.body = data;
    return res;
  };
  return res;
};

describe("errorHandler middleware", () => {
  it("statusCode өгсөн err-ийг зөв өгнө", () => {
    const err = new Error("Ном олдсонгүй");
    err.statusCode = 404;
    const res = createFakeRes();

    errorHandler(err, {}, res, () => {});

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Ном олдсонгүй");
  });

  it("statusCode өгөгдөөгүй err бол 500 болно", () => {
    const err = new Error("Тодорхойгүй алдаа");
    const res = createFakeRes();

    errorHandler(err, {}, res, () => {});

    expect(res.statusCode).toBe(500);
  });

  it("Утга нь давхардсан бол 400 тусгай мсж өгнө", () => {
    const err = new Error("duplicate key");
    err.code = 11000;
    const res = createFakeRes();

    errorHandler(err, {}, res, () => {});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Энэ талбарын утгыг давхардуулж өгч болохгүй!");
  });
});
