import { paginate } from "../../utils/paginate";

describe("paginate", () => {
  it("1-р хуудсанд start end гарч ирнэ", async () => {
    const fakeModel = {
      countDocuments: async () => 25,
    };

    const result = await paginate(1, 10, fakeModel);

    expect(result.total).toBe(25);
    expect(result.pageCount).toBe(3);
    expect(result.start).toBe(1);
    expect(result.end).toBe(10);
  });

  it("Сүүлийн хуудсанд end нь total-с илүү гарахгүй", async () => {
    const fakeModel = {
      countDocuments: async () => 22,
    };

    const result = await paginate(3, 10, fakeModel);

    expect(result.start).toBe(21);
    expect(result.end).toBe(22);
    expect(result.nextPage).toBeUndefined();
  });

  it("1-р хуудаснаас илүү бол prevPage утга өгөгдөнө", async () => {
    const fakeModel = {
      countDocuments: async () => 50,
    };

    const result = await paginate(2, 10, fakeModel);

    expect(result.prevPage).toBe(1);
    expect(result.nextPage).toBe(3);
  });
});
