import { createCodingAgentCommandWrapper } from "../../src/index.js";
const wrap=createCodingAgentCommandWrapper({policy:{approvalRequired:["git.push"]}});
console.log(await wrap("git","push",async()=>({pushed:true}))({branch:"main"}));
