import { createLangChainJsToolWrapper } from "../../src/index.js";
const wrap=createLangChainJsToolWrapper({policy:{allowedActions:["tool.call"]}});
console.log(await wrap("tool","call",async()=>"answer")({input:"question"}));
