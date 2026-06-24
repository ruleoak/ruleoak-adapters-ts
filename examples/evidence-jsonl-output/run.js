import { createGenericToolWrapper, createJsonlEvidenceSink } from "../../src/index.js";
const sink=createJsonlEvidenceSink(".ruleoak/example-evidence.jsonl");
const wrap=createGenericToolWrapper({policy:{allowedActions:["search.read"]}, evidenceSink:sink});
await wrap("search","read",async()=>({ok:true}))({q:"demo"});
console.log(sink.path);
