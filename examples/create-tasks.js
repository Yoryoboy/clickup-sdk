/**
 * Example demonstrating task creation with the ClickUp SDK
 * 
 * This example shows how to:
 * 1. Create a single task
 * 2. Create multiple tasks with batch processing
 * 
 * To run this example:
 * 1. Create a .env file with your CLICKUP_API_KEY
 * 2. Replace the list_id with your own list ID
 */
import ClickUp from '../src/core/ClickUp.js';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.CLICKUP_API_KEY;
const listId = "YOUR_LIST_ID"; // Replace with your list ID

async function runExample() {
  try {
    // Initialize the ClickUp client
    const clickUp = new ClickUp(apiKey);
    
    // Example 1: Create a single task
    console.log("Creating a single task...");
    const singleTask = await clickUp.tasks.createTask(listId, {
      name: "Task created via SDK",
      description: "This task was created using the ClickUp SDK",
      status: "to do",
      priority: 3, // High priority
      due_date: Date.now() + 7 * 24 * 60 * 60 * 1000, // Due in 7 days
      tags: ["api", "sdk"]
    });
    
    console.log(`Task created successfully: ${singleTask.id} - ${singleTask.name}`);
    
    // Example 2: Create multiple tasks with batching
    console.log("\nCreating multiple tasks with batching...");
    
    // Generate 15 sample tasks
    const tasksToCreate = Array.from({ length: 15 }, (_, i) => ({
      name: `Batch Task ${i + 1}`,
      description: `This is task ${i + 1} created in a batch`,
      status: i % 3 === 0 ? "to do" : i % 3 === 1 ? "in progress" : "review",
      due_date: Date.now() + (i + 1) * 24 * 60 * 60 * 1000, // Due in i+1 days
      tags: ["batch", `task-${i + 1}`]
    }));
    
    console.log(`Preparing to create ${tasksToCreate.length} tasks in batches...`);
    
    // Create tasks with batching (5 tasks per batch, 5 second delay between batches)
    const createdTasks = await clickUp.tasks.createTasks(listId, tasksToCreate, {
      batchSize: 5,
      delayBetweenBatches: 5000 // 5 seconds between batches (for demo purposes)
    });
    
    console.log(`Successfully created ${createdTasks.length} tasks in batches`);
    
    // Print summary of created tasks
    console.log("\nCreated tasks summary:");
    createdTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.id} - ${task.name} (${task.status.status})`);
    });
    
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
  }
}

runExample();
