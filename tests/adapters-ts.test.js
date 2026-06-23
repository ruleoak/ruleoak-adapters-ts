import { strict as assert } from "node:assert";
import { createGenericToolWrapper } from "../src/index.js";
const wrap = createGenericToolWrapper({ policy: { allowedActions: ["search.read"] } });
const search = wrap("search", "read", async () => ({ ok: true }));
const result = await search({ q: "demo" });
assert.equal(result.executed, true);
console.log("adapters-ts.test.js passed");
