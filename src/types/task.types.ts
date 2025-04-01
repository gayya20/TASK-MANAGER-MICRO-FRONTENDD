export interface Task {
    _id: string;
    name: string;
    description?: string;
    startDate: Date | string;
    endDate: Date | string;
    completionDate?: Date | string;
    isActive: boolean;
    isCompleted: boolean;
    assignedTo: string | User;
    createdBy: string | User;
    createdAt: Date | string;
    updatedAt: Date | string;
  }
  
  export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
  
  export interface CreateTaskRequest {
    name: string;
    description?: string;
    startDate: Date | string;
    endDate: Date | string;
    assignedTo: string;
    isActive?: boolean;
  }
  
  export interface UpdateTaskRequest {
    name?: string;
    description?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    assignedTo?: string;
    isActive?: boolean;
  }
  
  export interface UpdateTaskCompletionRequest {
    isCompleted: boolean;
    completionDate?: Date | string;
  }
  
  export interface TaskResponse {
    success: boolean;
    message?: string;
    data: Task;
  }
  
  export interface TasksResponse {
    success: boolean;
    count: number;
    pagination?: {
      next?: {
        page: number;
        limit: number;
      };
      prev?: {
        page: number;
        limit: number;
      };
    };
    data: Task[];
  }
  
  export interface TaskFilter {
    isCompleted?: boolean;
    isActive?: boolean;
    startDate?: Date | string;
    endDate?: Date | string;
    assignedTo?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }