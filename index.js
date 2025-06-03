import dotenv from "dotenv";
import ClickUp from "./src/core/ClickUp.js";

dotenv.config();

const apiKey = process.env.CLICKUP_API_KEY;
const teamId = "3051792";
const listId = "901404730264";

const clickUp = new ClickUp(apiKey);

// Example 1: Get tasks from a specific list
// const tasks = await clickUp.tasks.getTasks({
//   list_id: listId,
// });

// Example 2: Get filtered tasks across the workspace
// Uncomment and modify with your team_id to test

const filteredTasks = await clickUp.tasks.getFilteredTasks({
  team_id: teamId,
  list_ids: [listId],
  include_closed: true,
  page: 0,
  custom_fields: [
    {
      field_id: "dbfeb583-6f7f-4819-94fc-86f1e6bcaa2f",
      operator: "=",
      value: 0,
    },
  ],
});

console.log(filteredTasks.map((t) => t.reduceInfo()));
