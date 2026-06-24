import { createGenericToolWrapper } from "../../src/index.js";
const wrap=createGenericToolWrapper({policy:{allowedActions:["search.read"]}});
console.log(await wrap("search","read",async input=>({results:[input.q]}))({q:"ruleoak"}));
