import { describe, it, expect } from "vitest";
import { Devalaya } from "../src/core.js";
describe("Devalaya", () => {
  it("init", () => { expect(new Devalaya().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Devalaya(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Devalaya(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
