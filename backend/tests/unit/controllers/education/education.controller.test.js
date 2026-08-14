import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes } from "../../../helpers/testUtils.js";
import {
  getUniversities,
  getFaculties,
  getDegrees,
  getBatches,
} from "../../../../src/controllers/education/education.controller.js";
import { University, Faculty, Degree, Batch } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("getUniversities", () => {
  it("returns 200 with universities sorted by name", async () => {
    const findAll = mock.fn(async () => [{ id: 1, name: "UoM" }]);
    mock.method(University, "findAll", findAll);

    const res = createRes();
    await getUniversities({}, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.equal(res.getBody().data[0].name, "UoM");
    assert.deepEqual(findAll.mock.calls[0].arguments[0].order, [["name", "ASC"]]);
  });

  it("returns 500 when fetching universities fails", async () => {
    mock.method(University, "findAll", async () => {
      throw new Error("db down");
    });

    const res = createRes();
    await getUniversities({}, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().success, false);
    assert.equal(res.getBody().data, "db down");
  });
});

describe("getFaculties", () => {
  it("returns 200 with faculties filtered by university", async () => {
    const findAll = mock.fn(async () => [{ id: 1, name: "Engineering" }]);
    mock.method(Faculty, "findAll", findAll);

    const res = createRes();
    await getFaculties({ params: { universityId: "5" } }, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    const options = findAll.mock.calls[0].arguments[0];
    assert.deepEqual(options.where, { universityId: "5" });
    assert.deepEqual(options.order, [["name", "ASC"]]);
  });

  it("returns 500 when fetching faculties fails", async () => {
    mock.method(Faculty, "findAll", async () => {
      throw new Error("db down");
    });

    const res = createRes();
    await getFaculties({ params: { universityId: "5" } }, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().success, false);
  });
});

describe("getDegrees", () => {
  it("returns 200 with degrees filtered by faculty", async () => {
    const findAll = mock.fn(async () => [{ id: 1, name: "CS" }]);
    mock.method(Degree, "findAll", findAll);

    const res = createRes();
    await getDegrees({ params: { facultyId: "3" } }, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    const options = findAll.mock.calls[0].arguments[0];
    assert.deepEqual(options.where, { facultyId: "3" });
    assert.deepEqual(options.order, [["name", "ASC"]]);
  });

  it("returns 500 when fetching degrees fails", async () => {
    mock.method(Degree, "findAll", async () => {
      throw new Error("db down");
    });

    const res = createRes();
    await getDegrees({ params: { facultyId: "3" } }, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().success, false);
  });
});

describe("getBatches", () => {
  it("returns 200 with batches sorted newest first", async () => {
    const findAll = mock.fn(async () => [{ id: 1, name: "2026" }]);
    mock.method(Batch, "findAll", findAll);

    const res = createRes();
    await getBatches({}, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.deepEqual(findAll.mock.calls[0].arguments[0].order, [["name", "DESC"]]);
  });

  it("returns 500 when fetching batches fails", async () => {
    mock.method(Batch, "findAll", async () => {
      throw new Error("db down");
    });

    const res = createRes();
    await getBatches({}, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().success, false);
  });
});
