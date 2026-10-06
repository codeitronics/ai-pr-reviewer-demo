import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

describe("orders api", () => {
  let server, base;
  before(async () => {
    server = createApp().listen(0);
    await new Promise((r) => server.once("listening", r));
    base = `http://127.0.0.1:${server.address().port}`;
  });
  after(() => server.close());

  it("returns an order by id", async () => {
    const res = await fetch(`${base}/orders/3`);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).id, 3);
  });

  it("404s for a missing order", async () => {
    assert.equal((await fetch(`${base}/orders/999`)).status, 404);
  });
});
