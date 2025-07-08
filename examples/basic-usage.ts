/**
 * Example usage of the ClickUp SDK
 *
 * This file demonstrates basic usage of the SDK.
 * To run this example:
 * 1. Create a .env file with your CLICKUP_API_KEY
 * 2. Replace the team_id and list_id with your own values
 */
import ClickUp from "../src/core/ClickUp";
import dotenv from "dotenv";
import Task from "../src/core/Task";
import {
  CreateTaskData,
  CustomField,
  ReducedTask,
  Task as TaskType,
} from "../src/types/index";
dotenv.config();

const apiKey = process.env.CLICKUP_API_KEY as string;

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
      page: "all",
      include_closed: true,
      reverse: false,
    });

    const reducedInfo = Task.reduceInfo(tasks) as ReducedTask[];

    console.dir(reducedInfo, { depth: null });

    console.log(`Found ${tasks.length} tasks`);

    console.log("\nFetching custom fields for list...");

    // Example 2: Get custom fields for a list
    const customFields = await clickUp.customFields.getListCustomFields(
      TrueNetBAUListID
    );
    console.log(`Found ${customFields.length} custom fields:`);

    const newTasks: CreateTaskData[] = reducedInfo.map((task: ReducedTask) => {
      const STATUS_MAP = {
        unassigned: "to do",
        unstarted: "to do",
        "in progress": "in progress",
        qc: "internal qc",
        submitted: "sent",
        approved: "approved",
        canceled: "cancelled",
        billed: "approved",
      };

      const customFieldValues = (name: string) =>
        task.custom_fields.find((cf: CustomField) => cf.name === name);

      const projectTypeValue = customFieldValues("DESIGN TYPE")?.value;

      const statusValue = task.status as keyof typeof STATUS_MAP;

      return {
        name: task.name,
        assignees: task.assignees.map((a) => a.id),
        description: customFieldValues("JOB_NAME")?.value,
        status: STATUS_MAP[statusValue] || "to do",
        date_created: task.date_created,
        notify_all: false,
        custom_fields: [
          {
            id: customFields.find((cf) => cf.name === "ACTUAL COMPLETION DATE")
              ?.id,
            value: customFieldValues("ACTUAL COMPLETION DATE")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "PROJECT TYPE")?.id,
            value:
              customFields
                .find((cf) => cf.name === "PROJECT TYPE")
                ?.type_config?.options?.find(
                  (option) => option.name === projectTypeValue
                )?.id || "null",
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
          {
            id: customFields.find((cf) => cf.name === "TASK ID")?.id,
            value: task.id,
          },
          {
            id: customFields.find((cf) => cf.name === "ESTIMATED DELIVERY DATE")
              ?.id,
            value: customFieldValues("TRU_IN QC_INT")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "RECEIVED DATE")?.id,
            value: task.date_created,
          },
          {
            id: customFields.find((cf) => cf.name === "JOB TYPE CCI")?.id,
            value: "81f785fe-7a17-4075-ad7b-29918a6f55ad",
          },
          {
            id: customFields.find((cf) => cf.name === "PROJECT API ID")?.id,
            value: customFieldValues("PROJECT API ID")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "WORK ORDER (API ID)")
              ?.id,
            value: customFieldValues("WORK ORDER (API ID)")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "E-ALL-CAP-103A")?.id,
            value: customFieldValues("E-ALL-CAP-103A")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "DE-ALL-CAP-103B")?.id,
            value: customFieldValues("DE-ALL-CAP-103B")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "DE-ALL-CAP-103C")?.id,
            value: customFieldValues("DE-ALL-CAP-103C")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "DE-BAU-CAP-100A")?.id,
            value: customFieldValues("DE-BAU-CAP-100A")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "DE-BAU-CAP-100B")?.id,
            value: customFieldValues("DE-BAU-CAP-100B")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "DE-BAU-CAP-100D")?.id,
            value: customFieldValues("DE-BAU-CAP-100D")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "DE-BAU-CAP-100C")?.id,
            value: customFieldValues("DE-BAU-CAP-100C")?.value,
          },
          {
            id: customFields.find((cf) => cf.name === "Customer Company")?.id,
            value: "fa594393-37b8-4d35-8add-75d3f7671910",
          },
        ],
      };
    });

    console.log(`Preparing to create ${newTasks.length} tasks in batches...`);

    const createdTasks = await clickUp.tasks.createTasks(
      TrueNetBAUListID,
      newTasks,
      {
        batchSize: 80,
        verbose: true,
        onProgress: (progress) => {
          switch (progress.type) {
            case "batchStart":
              console.log("Batch started");
              break;
            case "batchComplete":
              console.log("Batch completed");
              break;

            case "waiting":
              console.log("Waiting");
              break;

            case "complete":
              console.log("Complete");
              break;
          }
        },
      }
    );

    console.log(`Successfully created ${createdTasks.length} tasks in batches`);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
  }
}

runExample();
