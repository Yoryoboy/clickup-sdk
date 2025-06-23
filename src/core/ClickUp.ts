import { createAxiosClient } from "../api/axiosClient";
import TaskManager from "./TaskManager";
import CustomFieldManager from "./CustomFieldManager";
import ListManager from "./ListManager";
import { AxiosInstance } from "axios";

class ClickUp {
  apiKey: string;
  client: AxiosInstance;
  lists: ListManager;
  tasks: TaskManager;
  customFields: CustomFieldManager;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = createAxiosClient(apiKey);
    this.lists = new ListManager(this.client);
    this.tasks = new TaskManager(this.client);
    this.customFields = new CustomFieldManager(this.client);
  }
}

export default ClickUp;
