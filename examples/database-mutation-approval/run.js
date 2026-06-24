import { createGenericToolWrapper, createApprovalCallback } from "../../src/index.js";
const wrap=createGenericToolWrapper({policy:{approvalRequired:["database.mutate"]}, approvalCallback:createApprovalCallback("allow")});
console.log(await wrap("database","mutate",async()=>({rows:1}))({sql:"update accounts set flag=1"}));
