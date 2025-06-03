class Task {
  constructor(data) {
    Object.assign(this, data);
  }

  getAssigneeNames() {
    return this.assignees?.map((a) => a.username) || [];
  }

  isCompleted() {
    return this.status?.status === "done";
  }
}

export default Task;
