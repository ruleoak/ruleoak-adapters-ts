import assert from "node:assert/strict";
import { createGenericToolWrapper } from "../src/index.js"; const wrap=createGenericToolWrapper({policy:{allowedActions:["search.read"]}}); const r=await wrap("search","read",async()=>({ok:true}))({q:"x"}); assert.equal(r.executed,true); console.log("generic-tool.test.js passed");
