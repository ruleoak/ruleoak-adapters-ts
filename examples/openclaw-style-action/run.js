import { createOpenClawStyleWrapper } from "../../src/index.js";
const wrap=createOpenClawStyleWrapper({policy:{blockedActions:["skill.install"]}});
console.log(await wrap("skill","install",async()=>({installed:true}))({name:"risky"}));
