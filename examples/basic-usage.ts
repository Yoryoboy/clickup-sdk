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
  GetFilteredTasksParams,
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

    const team = await clickUp.teams.getTeams();
    const members = team.teams[0].members;

    const membersToFind = [
      "agustina rojas",
      "carlos",
      "elias veron",
      "julieta martinotti",
      "sara bolivar",
    ];

    const memberIds = membersToFind.map((member) => {
      const user = members.find(
        (m) => m?.user?.username?.toLowerCase() === member.toLowerCase()
      );
      return { member, id: user?.user.id };
    });

    const params: GetFilteredTasksParams = {
      page: "all",
      team_id: team.teams[0].id,
      assignees: memberIds.map((m) => m.id?.toString().trim() || ""),
      include_closed: true,
      custom_fields: [
        {
          field_id: "ed83fc7c-baeb-4fdc-8e59-7ccbb4587cd5",
          operator: "RANGE",
          value: [
            new Date("2025-08-01").getTime(),
            new Date("2025-09-01").getTime(),
          ],
        },
      ],
    };

    const filteredMembersTasks = await clickUp.tasks.getFilteredTasks(params);

    const reducedTasks = (
      Task.reduceInfo(filteredMembersTasks) as ReducedTask[]
    ).map((t) => {
      return {
        id: t.id,
        name: t.name,
        assignees: t.assignees.map((a) => a.name),
        listName: t.list_name,
      };
    });

    console.dir(reducedTasks, { depth: null });
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
  }
}

runExample();
