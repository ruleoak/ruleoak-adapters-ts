import assert from "node:assert/strict";
import { createMemoryEvidenceSink, createGenericToolWrapper } from "../src/index.js"; const sink=createMemoryEvidenceSink(); await createGenericToolWrapper({policy:{allowedActions:["x.y"]}, evidenceSink:sink})("x","y",async()=>({ok:true}))({}); assert(sink.list().length>=3); console.log("evidence-sink.test.js passed");
