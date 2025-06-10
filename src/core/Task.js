class Task {
  /**
   * Static method to reduce task information for either a single task or an array of tasks
   * @param {Task|Array<Task>} tasks - Single Task instance or array of Task instances
   * @returns {Object|Array<Object>} - Reduced task info object or array of reduced task info objects
   */
  static reduceInfo(tasks) {
    // Handle array of tasks
    if (Array.isArray(tasks)) {
      return tasks.map(task => task.reduceInfo());
    }
    
    // Handle single task (if it's a Task instance)
    if (tasks instanceof Task) {
      return tasks.reduceInfo();
    }
    
    // Handle invalid input
    throw new Error('Input must be a Task instance or an array of Task instances');
  }
  
  constructor(data) {
    Object.assign(this, data);
  }

  getAssigneeNames() {
    return this.assignees?.map((a) => a.username) || [];
  }

  isCompleted() {
    return this.status?.status === "done";
  }

  reduceInfo() {
    return {
      id: this.id,
      custom_id: this.custom_id,
      name: this.name,
      status: this.status?.status || null,
      status_color: this.status?.color || null,
      date_created: this.date_created,
      date_updated: this.date_updated,
      date_closed: this.date_closed,
      date_done: this.date_done,
      archived: this.archived,
      creator: this.creator?.username || null,
      creator_email: this.creator?.email || null,
      assignees: this.getAssigneeNames(),
      watchers: this.watchers?.map((w) => w.username) || [],
      tags: this.tags || [],
      priority: this.priority,
      due_date: this.due_date,
      start_date: this.start_date,
      time_estimate: this.time_estimate,
      list_name: this.list?.name || null,
      project_name: this.project?.name || null,
      folder_name: this.folder?.name || null,
      url: this.url,
      is_completed: this.isCompleted(),
      locations: this.locations?.map((loc) => loc.name) || [],
      custom_fields:
        this.custom_fields
          ?.map((cf) => {
            // Handle dropdown type fields by getting the option name instead of the index
            if (
              cf.type === "drop_down" &&
              cf.type_config?.options &&
              cf.value !== undefined &&
              cf.value !== null
            ) {
              const selectedOption = cf.type_config.options[cf.value];
              return {
                id: cf.id,
                name: cf.name,
                value: selectedOption?.name || cf.value,
              };
            }

            // Regular handling for other field types
            return {
              id: cf.id,
              name: cf.name,
              value: cf.value,
            };
          })
          .filter((cf) => cf.value !== undefined && cf.value !== null) || [],

      description: this.description,
    };
  }
}

export default Task;
