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

  async getFilteredTasks(params = {}) {
    const { team_id, page, custom_fields, ...query } = params;

    if (!team_id) throw new Error("Missing team_id");

    // Handle custom_fields array by stringifying it if it's an array
    if (custom_fields && Array.isArray(custom_fields)) {
      query.custom_fields = JSON.stringify(custom_fields);
    }

    // Case 1: fetch all pages
    if (page === "all") {
      let currentPage = 0;
      let allTasks = [];
      let hasMore = true;

      do {
        const search = buildQuery({ ...query, page: currentPage });
        const url = `/team/${team_id}/task?${search}`;
        const res = await this.client.get(url);

        if (!res.data.tasks || res.data.tasks.length === 0) {
          hasMore = false;
        } else {
          allTasks.push(...res.data.tasks);
          currentPage++;
        }
      } while (hasMore);

      return allTasks.map((t) => new Task(t));
    }

    // Case 2: regular one-page fetch
    const search = buildQuery({ ...query, page });
    const url = `/team/${team_id}/task?${search}`;
    const res = await this.client.get(url);

    return (res.data.tasks || []).map((t) => new Task(t));
  }

  async updateTask(task_id, data = {}) {
    if (!task_id) throw new Error("Missing task_id");

    const url = `/task/${task_id}`;
    const res = await this.client.put(url, data);

    return new Task(res.data);
  }
}

export default TaskManager;
