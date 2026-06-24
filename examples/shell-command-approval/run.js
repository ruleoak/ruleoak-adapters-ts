import { createGenericToolWrapper, createApprovalCallback } from "../../src/index.js";
const wrap=createGenericToolWrapper({policy:{approvalRequired:["shell.run"]}, approvalCallback:createApprovalCallback("deny")});
console.log(await wrap("shell","run",async()=>({ran:true}))({command:"rm -rf /tmp/demo"}));
