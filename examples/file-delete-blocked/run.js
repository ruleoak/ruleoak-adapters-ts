import { createGenericToolWrapper } from "../../src/index.js";
const wrap=createGenericToolWrapper({policy:{blockedActions:["filesystem.delete"]}});
console.log(await wrap("filesystem","delete",async()=>({deleted:true}))({target:"protected"}));
