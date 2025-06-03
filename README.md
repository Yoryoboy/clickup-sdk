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
```

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

### Task Class

Wrapper for individual task objects with helpful methods.

Methods:
- `getAssigneeNames()`: Returns an array of assignee usernames
- `isCompleted()`: Returns true if the task status is "done"

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
