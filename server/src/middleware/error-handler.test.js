// A05 regression test: production responses must never leak internals.

import { jest } from "@jest/globals";
import { errorHandler } from "./error-handler.js";

function fakeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

afterEach(() => {
  delete process.env.NODE_ENV;
});

test("in production the client gets a generic message and no stack trace", () => {
  process.env.NODE_ENV = "production";
  const res = fakeRes();

  errorHandler(new Error("secret db detail"), {}, res, () => {});

  const body = res.json.mock.calls[0][0];
  expect(body.error.message).toBe("Something went wrong.");
  expect(JSON.stringify(body)).not.toContain("secret db detail");
  expect(JSON.stringify(body)).not.toContain("stack");
});
