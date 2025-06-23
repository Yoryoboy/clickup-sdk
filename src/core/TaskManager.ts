import Task from "./Task.js";
import buildQuery from "../utils/queryBuilder.js";
import { chunkArray, delay } from "../utils/helpers.js";
import {
  GetTasksParams,
  GetFilteredTasksParams,
  CreateTaskData,
  CreateTasksOptions,
  TaskCreationProgress,
  UpdateTaskData,
} from "../types/index.js";
import { AxiosInstance } from "axios";

class TaskManager {
  client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async getTasks(params: GetTasksParams) {
    const { list_id, page, ...query } = params;
    if (!list_id) throw new Error("Missing list_id");

    if (page === "all") {
      let currentPage = 0;
      let allTasks: Task[] = [];
      let lastPage = false;

      do {
        const search = buildQuery({ ...query, page: currentPage });
        const url = `/list/${list_id}/task?${search}`;
        const res = await this.client.get(url);

        allTasks.push(...res.data.tasks);
        lastPage = res.data.last_page;
        currentPage++;
      } while (!lastPage);

      return allTasks.map((t: Task) => new Task(t));
    }

    const search = buildQuery({ ...query, page });
    const url = `/list/${list_id}/task?${search}`;
    const res = await this.client.get(url);

    return res.data.tasks.map((t: Task) => new Task(t));
  }

  async getFilteredTasks(params: GetFilteredTasksParams) {
    const { team_id, page, custom_fields, ...query } = params;

    if (!team_id) throw new Error("Missing team_id");

    if (custom_fields && Array.isArray(custom_fields)) {
      query.custom_fields = JSON.stringify(custom_fields);
    }
    if (page === "all") {
      let currentPage = 0;
      let allTasks: Task[] = [];
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

      return allTasks.map((t: Task) => new Task(t));
    }

    const search = buildQuery({ ...query, page });
    const url = `/team/${team_id}/task?${search}`;
    const res = await this.client.get(url);

    return (res.data.tasks || []).map((t: Task) => new Task(t));
  }

  /**
   * Update a task by ID
   * @param {string} task_id - The ID of the task to update
   * @param {UpdateTaskData} data - The task data to update
   * @returns {Promise<Task>} The updated task
   * @throws {Error} If task_id is missing
   */
  async updateTask(task_id: string, data: UpdateTaskData = {}): Promise<Task> {
    if (!task_id) throw new Error("Missing task_id");

    const url = `/task/${task_id}`;
    const res = await this.client.put(url, data);

    return new Task(res.data);
  }

  /**
   * Create a new task in a specific list
   * @param {string} list_id - The ID of the list to create the task in
   * @param {Object} taskData - Task data object
   * @param {string} taskData.name - Task name (required)
   * @param {string} [taskData.description] - Task description
   * @param {Array<number>} [taskData.assignees] - Array of assignee user IDs
   * @param {boolean} [taskData.archived] - Whether the task is archived
   * @param {Array<string>} [taskData.tags] - Array of tags
   * @param {string} [taskData.status] - Task status
   * @param {number|null} [taskData.priority] - Task priority
   * @param {number} [taskData.due_date] - Due date (Unix timestamp in ms)
   * @param {boolean} [taskData.due_date_time] - Whether the due date includes time
   * @param {number} [taskData.time_estimate] - Time estimate in milliseconds
   * @param {number} [taskData.start_date] - Start date (Unix timestamp in ms)
   * @param {boolean} [taskData.start_date_time] - Whether the start date includes time
   * @param {number} [taskData.points] - Sprint points
   * @param {boolean} [taskData.notify_all] - Whether to notify all assignees
   * @param {string|null} [taskData.parent] - Parent task ID for subtasks
   * @param {string} [taskData.markdown_content] - Markdown formatted description
   * @param {string|null} [taskData.links_to] - Task ID to create a linked dependency
   * @param {boolean} [taskData.check_required_custom_fields] - Whether to enforce required custom fields
   * @param {Array<Object>} [taskData.custom_fields] - Custom fields array
   * @param {number} [taskData.custom_item_id] - Custom task type ID
   * @returns {Promise<Task>} The created task
   * @throws {Error} If list_id is missing or taskData.name is missing
   */
  async createTask(list_id: string, taskData: CreateTaskData): Promise<Task> {
    if (!list_id) throw new Error("Missing list_id");
    if (!taskData.name) throw new Error("Task name is required");

    const url = `/list/${list_id}/task`;
    const res = await this.client.post(url, taskData);

    return new Task(res.data);
  }

  /**
   * Create multiple tasks with rate limiting
   * @param {string} list_id - The ID of the list to create tasks in
   * @param {Array<Object>|Object} tasks - Single task object or array of task objects
   * @param {Object} options - Options for batch processing
   * @param {number} [options.batchSize=100] - Number of tasks to process per batch (max 100)
   * @param {number} [options.delayBetweenBatches=60000] - Delay between batches in milliseconds (default: 60000ms = 1 minute)
   * @param {Function} [options.onProgress] - Callback function for progress updates
   * @param {boolean} [options.verbose=false] - Whether to log progress to console
   * @returns {Promise<Array<Task>>} Array of created tasks
   * @throws {Error} If list_id is missing
   */
  async createTasks(
    list_id: string,
    tasks: CreateTaskData | CreateTaskData[],
    options: CreateTasksOptions = {}
  ): Promise<Task[]> {
    if (!list_id) throw new Error("Missing list_id");

    // Default options
    const batchSize = options.batchSize || 100;
    const delayBetweenBatches = options.delayBetweenBatches || 60000; // 1 minute default
    const onProgress =
      options.onProgress || ((progress: TaskCreationProgress) => {});
    const verbose = options.verbose || false;

    // Handle single task case
    if (!Array.isArray(tasks)) {
      if (verbose) console.log("Creating a single task...");
      const result = [await this.createTask(list_id, tasks)];
      if (verbose) console.log("Task created successfully.");
      return result;
    }

    // Split tasks into batches
    const batches = chunkArray(tasks, batchSize);
    const createdTasks = [];
    const totalTasks = tasks.length;

    // Log batch information
    if (verbose) {
      console.log(
        `Creating ${totalTasks} tasks in ${batches.length} batches (${batchSize} tasks per batch)`
      );
      console.log(
        `Delay between batches: ${delayBetweenBatches}ms (${
          delayBetweenBatches / 1000
        } seconds)`
      );
    }

    // Process each batch with rate limiting
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchNumber = i + 1;
      const tasksProcessed = i * batchSize;

      // Log batch start
      if (verbose) {
        console.log(
          `\nProcessing batch ${batchNumber}/${batches.length} (${batch.length} tasks)...`
        );
      }

      // Notify progress
      onProgress({
        type: "batchStart",
        batchNumber,
        totalBatches: batches.length,
        batchSize: batch.length,
        tasksProcessed,
        totalTasks,
      });

      // Create tasks in current batch (in parallel)
      const startTime = Date.now();
      const batchPromises = batch.map((taskData) =>
        this.createTask(list_id, taskData)
      );
      const batchResults = await Promise.all(batchPromises);
      const endTime = Date.now();
      createdTasks.push(...batchResults);

      // Log batch completion
      if (verbose) {
        console.log(
          `Batch ${batchNumber}/${batches.length} completed in ${
            (endTime - startTime) / 1000
          } seconds`
        );
        console.log(
          `Progress: ${
            tasksProcessed + batch.length
          }/${totalTasks} tasks created (${Math.round(
            ((tasksProcessed + batch.length) / totalTasks) * 100
          )}%)`
        );
      }

      // Notify progress
      onProgress({
        type: "batchComplete",
        batchNumber,
        totalBatches: batches.length,
        batchSize: batch.length,
        tasksProcessed: tasksProcessed + batch.length,
        totalTasks,
        batchDuration: endTime - startTime,
      });

      // Delay before processing next batch (except for the last batch)
      if (i < batches.length - 1) {
        if (verbose) {
          console.log(
            `Waiting ${delayBetweenBatches / 1000} seconds before next batch...`
          );
        }

        // Notify waiting
        onProgress({
          type: "waiting",
          waitTime: delayBetweenBatches,
          nextBatch: batchNumber + 1,
          totalBatches: batches.length,
        });

        await delay(delayBetweenBatches);
      }
    }

    // Log completion
    if (verbose) {
      console.log(
        `\nAll tasks created successfully! Created ${createdTasks.length} tasks in ${batches.length} batches.`
      );
    }

    // Notify completion
    onProgress({
      type: "complete",
      totalTasks: createdTasks.length,
      totalBatches: batches.length,
    });

    return createdTasks;
  }
}

export default TaskManager;
