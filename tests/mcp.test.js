import assert from "node:assert/strict";
import { createMcpClientWrapper } from "../src/index.js"; const r=await createMcpClientWrapper({policy:{blockedActions:["mcp.tool_call"]}})("mcp","tool_call",async()=>({ok:true}))({tool:"danger"}); assert.equal(r.executed,false); console.log("mcp.test.js passed");
