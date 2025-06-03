import { createAxiosClient } from "../api/axiosClient.js";
import TaskManager from "./TaskManager.js";

class ClickUp {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.client = createAxiosClient(apiKey);
    this.tasks = new TaskManager(this.client);
  }
}

export default ClickUp;
