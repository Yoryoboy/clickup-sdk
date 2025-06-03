import Task from "./Task.js";
import buildQuery from "../utils/queryBuilder.js";

class TaskManager {
  constructor(client) {
    this.client = client;
  }

  async getTasks(params = {}) {
    const { list_id, page, ...query } = params;
    if (!list_id) throw new Error("Missing list_id");

    // Case 1: fetch all pages
    if (page === "all") {
      let currentPage = 0;
      let allTasks = [];
      let lastPage = false;

      do {
        const search = buildQuery({ ...query, page: currentPage });
        const url = `/list/${list_id}/task?${search}`;
        const res = await this.client.get(url);

        allTasks.push(...res.data.tasks);
        lastPage = res.data.last_page;
        currentPage++;
      } while (!lastPage);

      return allTasks.map((t) => new Task(t));
    }

    // Case 2: regular one-page fetch
    const search = buildQuery({ ...query, page });
    const url = `/list/${list_id}/task?${search}`;
    const res = await this.client.get(url);

    return res.data.tasks.map((t) => new Task(t));
  }
}

export default TaskManager;
