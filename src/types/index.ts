/**
 * Type definitions for the ClickUp SDK
 */

export interface Task {
  id: string;
  custom_id?: string | null;
  name: string;
  description?: string;
  status?: TaskStatus;
  date_created?: number;
  date_updated?: number;
  date_closed?: number;
  date_done?: number;
  archived?: boolean;
  creator?: User;
  assignees?: User[];
  watchers?: User[];
  tags?: string[];
  priority?: TaskPriority | null;
  due_date?: number | null;
  start_date?: number | null;
  time_estimate?: number | null;
  list?: List;
  project?: Project;
  folder?: Folder;
  url?: string;
  custom_fields?: CustomField[];
  locations?: Location[];
}

export interface ReducedTask {
  id: string;
  custom_id: null;
  name: string;
  status: string;
  status_color: string;
  date_created: string;
  date_updated: string;
  date_closed: string;
  date_done: string;
  archived: boolean;
  creator: string;
  creator_email: string;
  assignees: User[];
  watchers: string[];
  tags: any[];
  priority: null;
  due_date: null;
  start_date: string;
  time_estimate: null;
  list_name: string;
  project_name: string;
  folder_name: string;
  url: string;
  is_completed: boolean;
  locations: any[];
  custom_fields: ReducedCustomField[];
  description: string;
}

export interface ReducedCustomField {
  id: string;
  name: string;
  value: string;
}

export interface TaskStatus {
  status: string;
  color: string;
  orderindex: number;
  type: string;
}

export enum TaskPriority {
  Urgent = 1,
  High = 2,
  Normal = 3,
  Low = 4,
}

export interface User {
  id: number;
  username: string;
  email: string;
  color?: string;
  profilePicture?: string;
  initials?: string;
}

export interface List {
  id: string;
  name: string;
  access: boolean;
  orderindex: number;
}

export interface Project {
  id: string;
  name: string;
  hidden: boolean;
  access: boolean;
}

export interface Folder {
  id: string;
  name: string;
  hidden: boolean;
  access: boolean;
}

export interface CustomField {
  id?: string;
  name?: string;
  type?: CustomFieldType;
  type_config?: CustomFieldTypeConfig;
  date_created?: string;
  hide_from_guests?: boolean;
  required?: boolean;
  value?: string | number;
}

/**
 * Parameters for setting a custom field value on a task
 */
export interface SetCustomFieldValueParams {
  task_id: string;
  field_id: string;
  value: string;
}

export type CustomFieldType =
  | "text"
  | "drop_down"
  | "email"
  | "phone"
  | "date"
  | "checkbox"
  | "url"
  | "number"
  | "currency"
  | "labels"
  | "automatic_progress";

export interface CustomFieldTypeConfig {
  default?: number | string;
  options?: CustomFieldOption[];
  [key: string]: string | number | CustomFieldOption[];
}

export interface CustomFieldOption {
  id: string;
  name: string;
  orderindex: number;
  color?: string;
}

export interface Location {
  id: string;
  name: string;
}

/**
 * Base interface for task query parameters
 */
export interface BaseTaskParams {
  page?: number | "all";
  statuses?: string[];
  assignees?: string[];
  due_date_gt?: number;
  due_date_lt?: number;
  date_created_gt?: number;
  date_created_lt?: number;
  date_updated_gt?: number;
  date_updated_lt?: number;
  tags?: string[];
  include_closed?: boolean;
  reverse?: boolean;
  subtasks?: boolean;
  include_subtasks?: boolean;
  custom_fields?: CustomFieldFilter[];
  [key: string]: any;
}

/**
 * Parameters for getting tasks from a specific list
 */
export interface GetTasksParams extends BaseTaskParams {
  list_id: string;
}

/**
 * Parameters for getting filtered tasks across a team
 */
export interface GetFilteredTasksParams extends BaseTaskParams {
  team_id: string;
  space_ids?: string[];
  project_ids?: string[];
  list_ids?: string[];
}

export interface CustomFieldFilter {
  field_id: string;
  operator: string;
  value: number | string | string[] | number[] | boolean;
}

export interface UpdateTaskData {
  name?: string;
  description?: string;
  markdown_content?: string;
  status?: string;
  priority?: number | null;
  due_date?: number;
  due_date_time?: boolean;
  parent?: string;
  time_estimate?: number;
  start_date?: number;
  start_date_time?: boolean;
  points?: number;
  assignees?: {
    add?: string[];
    rem?: string[];
  };
  group_assignees?: {
    add?: string[];
    rem?: string[];
  };
  watchers?: {
    add?: string[];
    rem?: string[];
  };
  archived?: boolean;
  custom_item_id?: number | null;
}

export interface CreateTaskData {
  name: string;
  description?: string;
  assignees?: number[];
  tags?: string[];
  status?: string;
  priority?: number | null;
  due_date?: number;
  due_date_time?: boolean;
  time_estimate?: number;
  start_date?: number;
  start_date_time?: boolean;
  notify_all?: boolean;
  parent?: string | null;
  links_to?: string | null;
  check_required_custom_fields?: boolean;
  custom_fields?: CustomField[];
}

export interface CreateTasksOptions {
  batchSize?: number;
  delayBetweenBatches?: number;
  verbose?: boolean;
  onProgress?: (progress: TaskCreationProgress) => void;
}

export interface TaskCreationProgress {
  type: "batchStart" | "batchComplete" | "waiting" | "complete";
  batchNumber?: number;
  totalBatches?: number;
  batchSize?: number;
  tasksProcessed?: number;
  totalTasks?: number;
  batchDuration?: number;
  waitTime?: number;
  nextBatch?: number;
}

export interface AxiosClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}
