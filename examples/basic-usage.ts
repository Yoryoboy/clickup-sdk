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

    console.log(memberIds);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
  }
}

runExample();
