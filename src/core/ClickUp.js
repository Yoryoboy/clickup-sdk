import { createAxiosClient } from "../api/axiosClient.js";
import TaskManager from "./TaskManager.js";
import CustomFieldManager from "./CustomFieldManager.js";

class ClickUp {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.client = createAxiosClient(apiKey);
    this.tasks = new TaskManager(this.client);
    this.customFields = new CustomFieldManager(this.client);
  }
}

export default ClickUp;
