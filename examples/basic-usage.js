/**
 * Example usage of the ClickUp SDK
 *
 * This file demonstrates basic usage of the SDK.
 * To run this example:
 * 1. Create a .env file with your CLICKUP_API_KEY
 * 2. Replace the team_id and list_id with your own values
 */
import ClickUp from "../src/core/ClickUp.js";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.CLICKUP_API_KEY;
const listId = "901407157574"; // Replace with your list ID

async function runExample() {
  try {
    // Initialize the ClickUp client
    const clickUp = new ClickUp(apiKey);

    // Example 1: Get tasks from a list
    console.log("Fetching tasks from list...");
    const tasks = await clickUp.tasks.getTasks({
      list_id: listId,
      page: "all",
      include_closed: true,
    });

    console.log(JSON.stringify(tasks[0].reduceInfo(), null, 2));

    console.log(`Found ${tasks.length} tasks`);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
  }
}

runExample();
