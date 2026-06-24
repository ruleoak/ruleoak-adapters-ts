import { createOpenAIAgentsJsToolWrapper } from "../../src/index.js";
const wrap=createOpenAIAgentsJsToolWrapper({policy:{allowedActions:["calculator.run"]}});
console.log(await wrap("calculator","run",async input=>({value:2}))({expr:"1+1"}));
