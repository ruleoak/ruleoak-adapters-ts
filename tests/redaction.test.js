import assert from "node:assert/strict";
import { redactInput } from "../src/index.js"; assert.equal(redactInput({apiKey:"x"}).apiKey,"[REDACTED]"); console.log("redaction.test.js passed");
