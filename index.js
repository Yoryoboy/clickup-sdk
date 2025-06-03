import dotenv from "dotenv";
import ClickUp from "./src/core/ClickUp.js";

dotenv.config();

const apiKey = process.env.CLICKUP_API_KEY;

const clickUp = new ClickUp(apiKey);

const tasks = await clickUp.tasks.getTasks({
  list_id: "901404730264",
});

console.log(tasks[1].reduceInfo());
