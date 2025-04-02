# Task Management Module

## Overview

This is a micro-frontend module for task management functionality. It provides a complete interface for creating, viewing, editing, and managing tasks within the main Task Management application.

## Features

- Task creation and editing
- Task listing with filtering and sorting
- Task assignment to users
- Task status tracking
- Task priority management
- Role-based task management capabilities

## Project Structure

```
task-module/
├── public/
│   ├── index.html
├── src/
│   ├── components/
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskFilter.tsx
│   ├── services/
│   │   └── taskService.ts
│   ├── types/
│   │   └── task.types.ts
│   ├── TaskManagement.tsx
│   ├── index.tsx
│   ├── bootstrap.tsx
│   └── react-app-env.d.ts
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## Installation

1. Clone the repository
2. Navigate to the task-module directory:
   ```bash
   cd task-management-frontend/task-module
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://your-api-url
   ```

## Running the Module Standalone

Start the development server:
```bash
npm start
```

The module will be available at http://localhost:3001

## Building for Production

```bash
npm run build
```

This will create a production-ready build in the `build` directory.

## Testing

Run tests:
```bash
npm test
```

Generate test coverage report:
```bash
npm run test:coverage
```

## Integration with Host Application

This module is designed to be integrated into the host application using Module Federation. It exposes the following components:

- `TaskManagement`: The main component that should be mounted in the host application

### Configuration

The webpack.config.js file is configured to expose the necessary components and share dependencies with the host application:

```javascript
// webpack.config.js excerpt
new ModuleFederationPlugin({
  name: 'taskModule',
  filename: 'remoteEntry.js',
  exposes: {
    './TaskManagement': './src/TaskManagement',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    // other shared dependencies
  },
})
```

## Component API

### TaskManagement Component

The main component exposed by this module:

```typescript
interface TaskManagementProps {
  userRole: string;        // 'admin' or 'user'
  userId: string;          // ID of the current user
  theme?: 'light' | 'dark'; // Optional theme
}

const TaskManagement: React.FC<TaskManagementProps> = (props) => {
  // Implementation
}
```

### Task Data Types

```typescript
interface Task {
  _id: string;
  name: string;
  description?: string;
  isCompleted: boolean;
  isActive: boolean;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## Functionality by User Role

### Admin Users
- Create new tasks
- Assign tasks to any user
- Edit any task
- Delete tasks
- View all tasks in the system
- Filter and sort tasks by various criteria

### Regular Users
- View tasks assigned to them
- Mark their tasks as complete
- Filter and sort their own tasks
- Cannot create or edit task details (only status)

## Service API

The module uses the following services to communicate with the backend:

```typescript
// Core task management functions
getTasks(filters?: FilterParams): Promise<ApiResponse<Task[]>>
createTask(task: CreateTaskParams): Promise<ApiResponse<Task>>
updateTask(id: string, updates: UpdateTaskParams): Promise<ApiResponse<Task>>
deleteTask(id: string): Promise<ApiResponse<void>>
updateTaskCompletion(id: string, updates: TaskCompletionParams): Promise<ApiResponse<Task>>

// Supporting functions
getUsers(): Promise<ApiResponse<User[]>>
```

