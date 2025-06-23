import { AxiosInstance } from "axios";
import { List } from "../types/index";

/**
 * ListManager class for handling ClickUp list operations
 */
class ListManager {
  client: AxiosInstance;
  /**
   * Create a new ListManager instance
   * @param {AxiosInstance} client - Axios client instance configured with auth headers
   */
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Add a task to an additional list
   * Note: This endpoint requires the Tasks in Multiple List ClickApp to be enabled
   *
   * @param {string} list_id - The ID of the list to add the task to
   * @param {string} task_id - The ID of the task to add to the list
   * @returns {Promise<List>} - The list data
   * @throws {Error} If list_id or task_id is missing
   */
  async addTaskToList(list_id: string, task_id: string): Promise<List> {
    if (!list_id) throw new Error("Missing list_id");
    if (!task_id) throw new Error("Missing task_id");

    const url = `/list/${list_id}/task/${task_id}`;
    const res = await this.client.post(url);

    return res.data;
  }

  /**
   * Get a list by its ID
   *
   * @param {string} list_id - The ID of the list to retrieve
   * @returns {Promise<List>} - The list data
   * @throws {Error} If list_id is missing
   */
  async getList(list_id: string): Promise<List> {
    if (!list_id) throw new Error("Missing list_id");

    const url = `/list/${list_id}`;
    const res = await this.client.get(url);

    return res.data;
  }
}

export default ListManager;
