# ClickUp SDK for TypeScript

A modular TypeScript SDK for interacting with the ClickUp API, built with ES modules and object-oriented programming principles.

## 🧠 Project Overview

This SDK provides a clean, object-oriented interface to the ClickUp API, making it easier to:
- Fetch and manage tasks
- Handle pagination automatically
- Work with ClickUp data in a structured way

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/clickup-sdk.git

# Navigate to the project directory
cd clickup-sdk

# Install dependencies
pnpm install
```

## 🔑 Authentication

You'll need a ClickUp API key to use this SDK. You can get one from your ClickUp workspace settings.

Create a `.env` file in the root directory with your API key:

```
CLICKUP_API_KEY=your_api_key_here
```

## 🚀 Usage

### Importing the SDK

This package ships dual modules: ESM and CommonJS. Use either style:

- ESM/TypeScript
```ts
import ClickUp, { Task, TaskManager, TeamManager } from '@yoryoboy/clickup-sdk';
```

- CommonJS
```js
const sdk = require('@yoryoboy/clickup-sdk');
const ClickUp = sdk.default; // default export
const { Task, TaskManager, TeamManager } = sdk; // named exports
```

### Basic Example

```typescript
import dotenv from 'dotenv';
import ClickUp from '@yoryoboy/clickup-sdk';

// Load environment variables
dotenv.config();

// Initialize the ClickUp client
const clickUp = new ClickUp(process.env.CLICKUP_API_KEY as string);

// Get tasks from a list
const tasks = await clickUp.tasks.getTasks({
  list_id: '123456789',
});

console.log(`Found ${tasks.length} tasks`);
```

### Pagination

The SDK supports automatic pagination when fetching tasks:

```javascript
// Get ALL tasks from a list (handles pagination automatically)
const allTasks = await clickUp.tasks.getTasks({
  list_id: '123456789',
  page: 'all',
  include_closed: true,
});

console.log(`Found ${allTasks.length} tasks across all pages`);

// Get only the first page of tasks
const firstPageTasks = await clickUp.tasks.getTasks({
  list_id: '123456789',
  page: 0,
});
```

### Filtering Tasks Across a Workspace

Use `getFilteredTasks()` to search for tasks across an entire workspace with powerful filtering options:

```javascript
// Get tasks with specific filters across the workspace
const filteredTasks = await clickUp.tasks.getFilteredTasks({
  team_id: '1234567', // Required workspace ID
  page: 'all',         // Get all pages
  statuses: ['in progress', 'review'],
  assignees: ['12345'], // User IDs
  tags: ['important'],
  due_date_gt: Date.now(), // Due date in the future
  include_closed: false
});

console.log(`Found ${filteredTasks.length} matching tasks`);
```

### Filtering by Custom Fields

The SDK supports advanced filtering using custom fields:

```javascript
// Filter tasks by custom fields
const tasksWithCustomFields = await clickUp.tasks.getFilteredTasks({
  team_id: '1234567',
  custom_fields: [
    {
      field_id: 'abc123def456',
      operator: '>',
      value: 5
    },
    {
      field_id: 'xyz789',
      operator: 'RANGE',
      value: [1671246000000, 1671505200000] // Date range
    }
  ]
});
```

### Working with Tasks

Each task is returned as a `Task` instance with helpful methods:

```javascript
const tasks = await clickUp.tasks.getTasks({ list_id: '123456789' });

// Check if a task is completed
const completedTasks = tasks.filter(task => task.isCompleted());

// Get assignee names for a task
const taskWithAssignees = tasks[0];
const assigneeNames = taskWithAssignees.getAssigneeNames();
console.log(`Task assigned to: ${assigneeNames.join(', ')}`);

// Get simplified task data
const simplifiedTask = tasks[0].reduceInfo();
console.log(simplifiedTask);
// Output: { id: '123', name: 'Task Name', status: 'in progress', ... }
```

### Updating Tasks

You can update tasks using the `updateTask` method:

```javascript
// Update a task's status and due date
const updatedTask = await clickUp.tasks.updateTask('task123', {
  status: 'in progress',
  due_date: Date.now() + 7 * 24 * 60 * 60 * 1000, // One week from now
  due_date_time: true
});

console.log(`Task updated: ${updatedTask.name} is now ${updatedTask.status.status}`);

// Update a task's name and description
const renamedTask = await clickUp.tasks.updateTask('task456', {
  name: 'New task name',
  description: 'Updated description with more details'
});
```

### Simplified Task Data

The `reduceInfo()` method provides a simplified view of task data with a flattened structure:

```javascript
const task = tasks[0];
const info = task.reduceInfo();
```

The simplified object includes:
- Basic task properties (id, name, description, etc.)
- Flattened nested objects (status, creator, etc.)
- Simplified arrays (assignees, watchers as usernames)
- Special handling for dropdown custom fields (shows option names instead of indices)
- Only includes custom fields with defined values

## 📚 API Reference

### ClickUp Class

The main entry point for the SDK.

```javascript
const clickUp = new ClickUp(apiKey);
```

Properties:
- `apiKey`: Your ClickUp API key
- `client`: The configured Axios instance
- `tasks`: TaskManager instance for task operations

### TaskManager Class

Handles all task-related operations.

#### getTasks(params)

Fetches tasks from a ClickUp list.

Parameters:
- `params.list_id` (required): The ClickUp list ID
- `params.page`: Page number or "all" to fetch all pages
- `params.include_closed`: Whether to include closed tasks
- `params.reverse`: Whether to reverse the order of tasks
- ...other ClickUp API parameters

Returns: Promise<Task[]> - Array of Task instances

#### getTask(task_id)

Fetches a single task by its ID and returns its reduced information object.

Parameters:
- `task_id` (required): The ID of the task to retrieve

Returns: Promise<ReducedTask> - Reduced task info

Example:
```javascript
// Get a single task's reduced info
const taskInfo = await clickUp.tasks.getTask('abc123def456');
console.log(taskInfo.id, taskInfo.name, taskInfo.status);
```

#### getFilteredTasks(params)

Fetches filtered tasks across an entire workspace.

Parameters:
- `params.team_id` (required): The ClickUp workspace ID
- `params.page`: Page number or "all" to fetch all pages
- `params.space_ids`: Array of space IDs to filter by
- `params.project_ids`: Array of folder IDs to filter by
- `params.list_ids`: Array of list IDs to filter by
- `params.statuses`: Array of status names to filter by
- `params.assignees`: Array of user IDs to filter by
- `params.tags`: Array of tags to filter by
- `params.due_date_gt/lt`: Filter by due date (Unix timestamp in ms)
- `params.date_created_gt/lt`: Filter by creation date
- `params.date_updated_gt/lt`: Filter by update date
- `params.custom_fields`: Array of custom field filter objects
- ...other ClickUp API parameters

Returns: Promise<Task[]> - Array of Task instances

#### updateTask(task_id, data)

Updates a task with new values.

Parameters:
- `task_id` (required): The ID of the task to update
- `data`: Object containing the fields to update
  - `name`: New name for the task
  - `description`: New description for the task
  - `status`: New status for the task
  - `due_date`: New due date (Unix timestamp in ms)
  - `due_date_time`: Whether the due date includes a specific time
  - `start_date`: New start date (Unix timestamp in ms)
  - `time_estimate`: Time estimate in milliseconds
  - `archived`: Whether the task is archived
  - ...other ClickUp API task fields

Returns: Promise<Task> - The updated Task instance

#### createTask(list_id, taskData)

Creates a new task in a specific list.

Parameters:
- `list_id` (required): The ID of the list to create the task in
- `taskData`: Object containing the task data
  - `name` (required): Task name
  - `description`: Task description
  - `assignees`: Array of assignee user IDs
  - `tags`: Array of tags
  - `status`: Task status
  - `priority`: Task priority (null, 1, 2, 3, or 4)
  - `due_date`: Due date (Unix timestamp in ms)
  - `start_date`: Start date (Unix timestamp in ms)
  - `custom_fields`: Array of custom field objects
  - ...other ClickUp API task fields

Returns: Promise<Task> - The created Task instance

#### createTasks(list_id, tasks, options)

Creates multiple tasks with rate limiting to handle ClickUp's API limits.

Parameters:
- `list_id` (required): The ID of the list to create tasks in
- `tasks`: Single task object or array of task objects (see createTask for object structure)
- `options`: Options for batch processing
  - `batchSize`: Number of tasks to process per batch (default: 100)
  - `delayBetweenBatches`: Delay between batches in milliseconds (default: 60000ms = 1 minute)
  - `verbose`: Whether to log progress to console (default: false)
  - `onProgress`: Callback function for progress updates

The `onProgress` callback receives a progress object with the following properties:
- For `type: 'batchStart'`:
  - `batchNumber`: Current batch number (1-based)
  - `totalBatches`: Total number of batches
  - `batchSize`: Number of tasks in the current batch
  - `tasksProcessed`: Number of tasks processed so far
  - `totalTasks`: Total number of tasks to process
- For `type: 'batchComplete'`:
  - All of the above, plus:
  - `batchDuration`: Time taken to process the batch in milliseconds
- For `type: 'waiting'`:
  - `waitTime`: Time to wait before next batch in milliseconds
  - `nextBatch`: Next batch number
  - `totalBatches`: Total number of batches
- For `type: 'complete'`:
  - `totalTasks`: Total number of tasks created
  - `totalBatches`: Total number of batches processed

Returns: Promise<Array<Task>> - Array of created Task instances

Example:
```javascript
// Create a single task
const newTask = await clickUp.tasks.createTask("123456789", {
  name: "New Task",
  description: "Task description",
  status: "to do",
  due_date: 1735603200000 // Unix timestamp in ms
});

// Create multiple tasks with batching
const tasksToCreate = [
  { name: "Task 1", status: "to do" },
  { name: "Task 2", status: "in progress" },
  // ... more tasks
];

const createdTasks = await clickUp.tasks.createTasks("123456789", tasksToCreate, {
  batchSize: 50, // Process 50 tasks at a time
  delayBetweenBatches: 65000 // Wait 65 seconds between batches
});
```

### ListManager Class

Manages operations related to ClickUp lists.

#### addTaskToList(list_id, task_id)

Adds a task to an additional list. Note that this requires the "Tasks in Multiple Lists" ClickApp to be enabled in your workspace.

Parameters:
- `list_id` (required): The ID of the list to add the task to
- `task_id` (required): The ID of the task to add to the list

Returns: Promise<Object> - The API response

Example:
```javascript
// Add a task to another list
await clickUp.lists.addTaskToList('123456789', 'abc123def456');
```

#### getList(list_id)

Retrieves a list by its ID.

Parameters:
- `list_id` (required): The ID of the list to retrieve

Returns: Promise<Object> - The list data

Example:
```javascript
// Get list details
const list = await clickUp.lists.getList('123456789');
console.log(list.name);
```

### CustomFieldManager Class

Manages operations related to ClickUp custom fields.

Methods:
- `getListCustomFields(list_id)`: Returns all custom fields for a specific list
- `setCustomFieldValue(params)`: Sets a custom field value for a specific task

#### getListCustomFields(list_id)

Fetches all custom fields available in a specific list.

Parameters:
- `list_id` (required): The ClickUp list ID

Returns: Promise<Array> - Array of custom field objects

Example:
```javascript
// Get custom fields for a list
const customFields = await clickUp.customFields.getListCustomFields('123456789');
console.log(customFields);
```

#### setCustomFieldValue(params)

Sets a custom field value for a specific task.

Parameters:
- `params.task_id` (required): The ID of the task to update
- `params.field_id` (required): The universal unique identifier (UUID) of the custom field
- `params.value` (required): The value to set for the custom field (as a string)

Returns: Promise<Record<string, unknown>> - The API response

Example:
```javascript
// Set a custom field value
const result = await clickUp.customFields.setCustomFieldValue({
  task_id: '86b5jqha9',
  field_id: 'df45878b-b48e-415d-9561-f8d0392e9f46',
  value: 'New Value'
});
```

### TeamManager Class

Manages operations related to ClickUp Teams (workspaces).

#### getTeams()

Fetches all teams the API key has access to using `GET /team`.

Parameters:
- None

Returns: `Promise<Teams>` — where `Teams` is `{ teams: Team[] }` as defined in `src/types/index.ts`.

Example:
```javascript
// Retrieve teams (workspaces)
const { teams } = await clickUp.teams.getTeams();

// List team names
console.log(teams.map(t => t.name));

// Safely access members (may be empty or undefined depending on permissions)
for (const team of teams) {
  console.log(`Team: ${team.name} (members: ${team.members?.length ?? 0})`);
}
```

### Task Class

Wrapper for individual task objects with helpful methods.

#### Instance Methods

- `getAssigneeNames()`: Returns an array of assignee usernames
- `isCompleted()`: Returns true if the task status is "done"
- `reduceInfo()`: Returns a simplified object with flattened task data
  - Converts nested properties into flat key-value pairs
  - Transforms dropdown custom fields to show option names instead of indices
  - Filters out custom fields with undefined values

#### Static Methods

- `Task.reduceInfo(tasks)`: Utility method that handles both single tasks and arrays of tasks
  - If given a single Task instance, returns its reduced info object
  - If given an array of Task instances, returns an array of reduced info objects
  - Eliminates the need for `tasks.map(task => task.reduceInfo())`

Example:
```javascript
// For a single task
const reducedTask = Task.reduceInfo(task);

// For an array of tasks - no need for .map() anymore!
const reducedTasks = Task.reduceInfo(tasks);
```

## 🧱 Project Structure

```
clickup-sdk/
├── src/
│   ├── api/
│   │   └── axiosClient.ts    # Axios client configuration
│   ├── core/
│   │   ├── ClickUp.ts        # Main SDK class
│   │   ├── TaskManager.ts    # Task operations
│   │   ├── ListManager.ts    # List operations
│   │   ├── CustomFieldManager.ts # Custom fields operations
│   │   └── Task.ts           # Task wrapper class
│   ├── utils/
│   │   └── queryBuilder.ts   # Query string builder
│   └── index.ts              # Package entry point
├── examples/
│   └── basic-usage.ts        # Example usage
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Development

### Adding New Features

To add new features or API endpoints:

1. Create a new manager class in the `src/core` directory
2. Add the manager to the ClickUp class
3. Implement the API methods in the manager class

### Testing

You can test the SDK by modifying the `index.ts` file and running:

```bash
node index.ts
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
