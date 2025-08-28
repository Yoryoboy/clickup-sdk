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
const clickUp = new ClickUp(apiKey);

// Define fields to filter
const FIELDS_TO_FILTER = [
  "ACTUAL COMPLETION DATE",
  "REDESIGN ACTUAL COMPLETION DATE",
];

async function run() {
  // Get custom fields
  const customFields = await clickUp.customFields.getListCustomFields(
    "900200859937"
  );

  // Filter custom fields
  const filteredCustomFields = customFields.filter((field) =>
    FIELDS_TO_FILTER.includes(field?.name as string)
  );

  const tasks = await clickUp.tasks.getTasks({
    list_id: "900200859937",
    page: "all",
    include_closed: true,
    statuses: ["sent", "approved"],
    custom_fields: [
      {
        field_id:
          filteredCustomFields.find(
            (field) => field?.name === "ACTUAL COMPLETION DATE"
          )?.id || "",
        operator: "RANGE",
        value: [1748746800000, 1749956400000],
      },
    ],
  });

  const reducedTasks = Task.reduceInfo(tasks);
  console.dir(reducedTasks, { depth: null });
}

run();
