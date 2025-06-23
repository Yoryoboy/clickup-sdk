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
  color: string;
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
  id: string;
  name: string;
  type: CustomFieldType;
  type_config?: CustomFieldTypeConfig;
  date_created?: string;
  hide_from_guests?: boolean;
  required?: boolean;
  value?: any;
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
  default?: number | string | boolean;
  options?: CustomFieldOption[];
  [key: string]: any;
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

export interface GetTasksParams {
  list_id: string;
  page?: number | "all";
  include_closed?: boolean;
  reverse?: boolean;
  subtasks?: boolean;
  statuses?: string[];
  include_subtasks?: boolean;
  assignees?: string[];
  due_date_gt?: number;
  due_date_lt?: number;
  date_created_gt?: number;
  date_created_lt?: number;
  date_updated_gt?: number;
  date_updated_lt?: number;
}

export interface GetFilteredTasksParams {
  team_id: string;
  page?: number | "all";
  space_ids?: string[];
  project_ids?: string[];
  list_ids?: string[];
  statuses?: string[];
  assignees?: string[];
  tags?: string[];
  due_date_gt?: number;
  due_date_lt?: number;
  date_created_gt?: number;
  date_created_lt?: number;
  date_updated_gt?: number;
  date_updated_lt?: number;
  custom_fields?: CustomFieldFilter[];
  [key: string]: any;
}

export interface CustomFieldFilter {
  field_id: string;
  operator: string;
  value: any;
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
  custom_fields?: any[];
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
