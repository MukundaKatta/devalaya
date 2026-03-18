import { describe, it, expect } from "vitest";
import { Devalaya } from "../src/core.js";

describe("Devalaya integration", () => {
  it("handles concurrent ops", async () => {
    const c = new Devalaya();
    await Promise.all([c.process({a:1}), c.process({b:2}), c.process({c:3})]);
    expect(c.getStats().ops).toBe(3);
  });
  it("returns service name", async () => {
    const c = new Devalaya();
    const r = await c.process();
    expect(r.service).toBe("devalaya");
  });
  it("handles 100 ops", async () => {
    const c = new Devalaya();
    for (let i = 0; i < 100; i++) await c.process({i});
    expect(c.getStats().ops).toBe(100);
  });
});
