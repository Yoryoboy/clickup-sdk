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

  /**
   * Get filtered tasks across an entire workspace
   * @param {Object} params - Filter parameters
   * @param {string} params.team_id - Required workspace ID
   * @param {number} [params.page] - Page to fetch (starts at 0) or "all" to fetch all pages
   * @param {string} [params.order_by] - Order by field (id, created, updated, due_date)
   * @param {boolean} [params.reverse] - Reverse order
   * @param {boolean} [params.subtasks] - Include subtasks
   * @param {string[]} [params.space_ids] - Filter by space IDs
   * @param {string[]} [params.project_ids] - Filter by folder IDs
   * @param {string[]} [params.list_ids] - Filter by list IDs
   * @param {string[]} [params.statuses] - Filter by status names
   * @param {boolean} [params.include_closed] - Include closed tasks
   * @param {string[]} [params.assignees] - Filter by assignee user IDs
   * @param {string[]} [params.tags] - Filter by tags
   * @param {number} [params.due_date_gt] - Due date greater than (Unix time ms)
   * @param {number} [params.due_date_lt] - Due date less than (Unix time ms)
   * @param {number} [params.date_created_gt] - Date created greater than (Unix time ms)
   * @param {number} [params.date_created_lt] - Date created less than (Unix time ms)
   * @param {number} [params.date_updated_gt] - Date updated greater than (Unix time ms)
   * @param {number} [params.date_updated_lt] - Date updated less than (Unix time ms)
   * @param {number} [params.date_done_gt] - Date done greater than (Unix time ms)
   * @param {number} [params.date_done_lt] - Date done less than (Unix time ms)
   * @param {Array<Object>} [params.custom_fields] - Filter by custom fields
   * @param {boolean} [params.custom_task_ids] - Reference tasks by custom task ID
   * @param {string} [params.parent] - Parent task ID to return subtasks
   * @param {boolean} [params.include_markdown_description] - Return descriptions in Markdown
   * @param {number[]} [params.custom_items] - Filter by custom task types
   * @returns {Promise<Task[]>} Array of Task instances
   */
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
}

export default TaskManager;
