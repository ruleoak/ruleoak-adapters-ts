import { createVercelAiSdkToolWrapper } from "../../src/index.js";
const wrap=createVercelAiSdkToolWrapper({policy:{allowedActions:["weather.lookup"]}});
console.log(await wrap("weather","lookup",async()=>({temp:30}))({city:"Singapore"}));
