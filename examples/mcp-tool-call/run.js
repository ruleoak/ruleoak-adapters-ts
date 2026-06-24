import { createMcpClientWrapper } from "../../src/index.js";
const wrap=createMcpClientWrapper({policy:{blockedActions:["mcp.tool_call"]}});
console.log(await wrap("mcp","tool_call",async()=>({ok:true}))({tool:"dangerous.delete"}));
