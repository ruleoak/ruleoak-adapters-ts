import assert from "node:assert/strict";
import { evaluatePolicy } from "../src/index.js"; assert.equal(evaluatePolicy({toolName:"a",operation:"b"},{approvalRequired:["a.b"]}).decision,"needs_approval"); console.log("policy.test.js passed");
