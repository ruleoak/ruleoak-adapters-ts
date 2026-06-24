import assert from "node:assert/strict";
import { createGenericToolWrapper } from "../src/index.js"; const r=await createGenericToolWrapper({policy:{blockedActions:["filesystem.delete"]}})("filesystem","delete",async()=>({bad:true}))({target:"protected"}); assert.equal(r.executed,false); assert.equal(r.decision.decision,"deny"); console.log("file-delete-blocked.test.js passed");
