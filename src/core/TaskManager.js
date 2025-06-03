import Task from "./Task.js";
import buildQuery from "../utils/queryBuilder.js";

class TaskManager {
  constructor(client) {
    this.client = client;
  }

  async getTasks(params = {}) {
    const { list_id, ...query } = params;
    if (!list_id) throw new Error("Missing list_id");

    const url = `/list/${list_id}/task?${buildQuery(query)}`;
    const res = await this.client.get(url);
    return res.data.tasks.map((t) => new Task(t));
  }
}

export default TaskManager;
