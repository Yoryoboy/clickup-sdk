# ClickUp SDK for JavaScript

A modular JavaScript SDK for interacting with the ClickUp API, built with ES modules and object-oriented programming principles.

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
npm install
```

## 🔑 Authentication

You'll need a ClickUp API key to use this SDK. You can get one from your ClickUp workspace settings.

Create a `.env` file in the root directory with your API key:

```
CLICKUP_API_KEY=your_api_key_here
```

## 🚀 Usage

### Basic Example

```javascript
import dotenv from 'dotenv';
import ClickUp from './src/core/ClickUp.js';

// Load environment variables
dotenv.config();

// Initialize the ClickUp client
const clickUp = new ClickUp(process.env.CLICKUP_API_KEY);

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

### Task Class

Wrapper for individual task objects with helpful methods.

Methods:
- `getAssigneeNames()`: Returns an array of assignee usernames
- `isCompleted()`: Returns true if the task status is "done"
- `reduceInfo()`: Returns a simplified object with flattened task data
  - Converts nested properties into flat key-value pairs
  - Transforms dropdown custom fields to show option names instead of indices
  - Filters out custom fields with undefined values

## 🧱 Project Structure

```
clickup-sdk/
├── src/
│   ├── api/
│   │   └── axiosClient.js    # Axios client configuration
│   ├── core/
│   │   ├── ClickUp.js        # Main SDK class
│   │   ├── TaskManager.js    # Task operations
│   │   └── Task.js           # Task wrapper class
│   ├── utils/
│   │   └── queryBuilder.js   # Query string builder
│   └── index.js              # Example usage
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

You can test the SDK by modifying the `index.js` file and running:

```bash
node index.js
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
