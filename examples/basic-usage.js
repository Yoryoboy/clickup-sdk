/**
 * Example usage of the ClickUp SDK
 * 
 * This file demonstrates basic usage of the SDK.
 * To run this example:
 * 1. Create a .env file with your CLICKUP_API_KEY
 * 2. Replace the team_id and list_id with your own values
 */
import ClickUp from '../src/core/ClickUp.js';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.CLICKUP_API_KEY;
const teamId = "YOUR_TEAM_ID"; // Replace with your team ID
const listId = "YOUR_LIST_ID"; // Replace with your list ID

async function runExample() {
  try {
    // Initialize the ClickUp client
    const clickUp = new ClickUp(apiKey);
    
    // Example 1: Get tasks from a list
    console.log("Fetching tasks from list...");
    const tasks = await clickUp.tasks.getTasks({
      list_id: listId,
    });
    
    console.log(`Found ${tasks.length} tasks`);
    
    if (tasks.length > 0) {
      // Get simplified data for the first task
      console.log("\nFirst task simplified data:");
      console.log(tasks[0].reduceInfo());
    }
    
    // Example 2: Get filtered tasks across workspace
    console.log("\nFetching filtered tasks across workspace...");
    const filteredTasks = await clickUp.tasks.getFilteredTasks({
      team_id: teamId,
      statuses: ["in progress"],
      page: 0
    });
    
    console.log(`Found ${filteredTasks.length} tasks with status "in progress"`);
    
    // Example 3: Update a task (uncomment to use)
    /*
    if (tasks.length > 0) {
      const taskToUpdate = tasks[0];
      console.log(`\nUpdating task: ${taskToUpdate.id}`);
      
      const updatedTask = await clickUp.tasks.updateTask(taskToUpdate.id, {
        name: `${taskToUpdate.name} (Updated)`,
        description: "This task was updated using the ClickUp SDK"
      });
      
      console.log("Task updated successfully:", updatedTask.name);
    }
    */
    
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
  }
}

runExample();
