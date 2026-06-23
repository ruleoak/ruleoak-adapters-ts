import { strict as assert } from "node:assert";
import { adapterReadinessReport, createGenericToolWrapper, createMcpClientWrapper, createCodingAgentCommandWrapper } from "../src/index.js";
assert.equal(adapterReadinessReport().version, "1.0.0");
assert.equal(typeof createGenericToolWrapper(), "function");
assert.equal(typeof createMcpClientWrapper(), "function");
assert.equal(typeof createCodingAgentCommandWrapper(), "function");
console.log("adapters-ts-v1.test.js passed");
