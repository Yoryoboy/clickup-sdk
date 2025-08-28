import { createAxiosClient } from "../api/axiosClient";
import TaskManager from "./TaskManager";
import CustomFieldManager from "./CustomFieldManager";
import ListManager from "./ListManager";
import { AxiosInstance } from "axios";
import TeamManager from "./TeamManager";

class ClickUp {
  apiKey: string;
  client: AxiosInstance;
  lists: ListManager;
  tasks: TaskManager;
  customFields: CustomFieldManager;
  teams: TeamManager;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = createAxiosClient(apiKey);
    this.lists = new ListManager(this.client);
    this.tasks = new TaskManager(this.client);
    this.customFields = new CustomFieldManager(this.client);
    // Expose Teams manager for workspace-level queries
    this.teams = new TeamManager(this.client);
  }
}

export default ClickUp;
