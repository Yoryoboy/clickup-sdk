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
const listId = "901407157574";
const TrueNetBAUListID = "901409412574";

async function runExample() {
  try {
    // Initialize the ClickUp client
    const clickUp = new ClickUp(apiKey);

    // Example 1: Get tasks from a list
    console.log("Fetching tasks from list...");
    const tasks = await clickUp.tasks.getTasks({
      list_id: listId,
      page: 0,
      include_closed: true,
    });

    console.log(JSON.stringify(tasks[0].reduceInfo(), null, 2));

    console.log(`Found ${tasks.length} tasks`);

    console.log("\nFetching custom fields for list...");

    // Example 2: Get custom fields for a list
    const customFields = await clickUp.customFields.getListCustomFields(
      TrueNetBAUListID
    );
    console.log(`Found ${customFields.length} custom fields:`);

    const newTasks = tasks.map((task) => {
      const STATUS_MAP = {
        unassigned: "to do",
        unstarted: "to do",
        "in progress": "in progress",
        qc: "internal qc",
        submitted: "sent",
        approved: "approved",
        cancelled: "cancelled",
        billed: "approved",
      };

      const customFieldValues = (name) =>
        task.custom_fields.find((cf) => cf.name === name);

      return {
        name: task.name,
        description: customFieldValues("JOB_NAME")?.value,
        status: STATUS_MAP[task.status?.status] || "to do",
        date_created: task.date_created,
        custom_fields: [
          {
            id: customFields.find((cf) => cf.name === "ACTUAL COMPLETION DATE")
              ?.id,
            value: customFieldValues("ACTUAL COMPLETION DATE")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "PROJECT TYPE")?.id,
            value: customFieldValues(
              "PROJECT TYPE"
            )?.type_config?.options?.find(
              (option) =>
                option.value === customFieldValues("DESIGN TYPE")?.value
            )?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "HUB")?.id,
            value: customFieldValues("HUB_HS")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "NODE")?.id,
            value: customFieldValues("NODE")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "POINTS_HS")?.id,
            value: customFieldValues("POINTS_HS")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "SECONDARY ID")?.id,
            value: customFieldValues("SECONDARY_ID")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "ACTUAL COMPLETION DATE")
              ?.id,
            value: customFieldValues("TRU Completed")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "SUBMITTED TO QC")?.id,
            value: customFieldValues("TRU_IN QC_INT")?.value,
          },
        ],
      };
    });

    console.log(newTasks);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
  }
}

runExample();
