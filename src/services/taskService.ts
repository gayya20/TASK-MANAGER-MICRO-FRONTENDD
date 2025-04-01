
import axios from 'axios';
import { TaskFilter, TasksResponse, Task, TaskResponse, CreateTaskRequest, UpdateTaskRequest, UpdateTaskCompletionRequest } from '../types/task.types';

// Configure axios
const API_URL = 'http://localhost:5000/api';

// Create a function to get the axios instance with current token
const getAxiosInstance = () => {
  const token = localStorage.getItem('token');
  
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
};

// Task Management API
export const getTasks = async (filters?: TaskFilter): Promise<TasksResponse> => {
  const instance = getAxiosInstance();
  
  let apiUrl = '/tasks';
  
  if (filters) {
    const queryParams = new URLSearchParams();
    
    if (filters.isCompleted !== undefined) {
      queryParams.append('isCompleted', String(filters.isCompleted));
    }
    
    if (filters.isActive !== undefined) {
      queryParams.append('isActive', String(filters.isActive));
    }
    
    if (filters.assignedTo) {
      queryParams.append('assignedTo', filters.assignedTo);
    }
    
    if (filters.sort) {
      queryParams.append('sort', filters.sort);
    }
    
    if (queryParams.toString()) {
      apiUrl += `?${queryParams.toString()}`;
    }
  }
  
  try {
    const response = await instance.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { success: false, count: 0, data: [] };
  }
};

export const getTask = async (id: string): Promise<TaskResponse> => {
  const instance = getAxiosInstance();
  try {
    const response = await instance.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task:', error);
    return { success: false, data: {} as Task };
  }
};

export const createTask = async (taskData: CreateTaskRequest): Promise<TaskResponse> => {
  const instance = getAxiosInstance();
  try {
    const response = await instance.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, data: {} as Task };
  }
};

export const updateTask = async (id: string, taskData: UpdateTaskRequest): Promise<TaskResponse> => {
  const instance = getAxiosInstance();
  try {
    const response = await instance.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, data: {} as Task };
  }
};

export const deleteTask = async (id: string): Promise<{ success: boolean; message: string }> => {
  const instance = getAxiosInstance();
  try {
    const response = await instance.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, message: 'Failed to delete task' };
  }
};

export const updateTaskCompletion = async (id: string, data: UpdateTaskCompletionRequest): Promise<TaskResponse> => {
  const instance = getAxiosInstance();
  try {
    const response = await instance.put(`/tasks/${id}/completion`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating task completion:', error);
    return { success: false, data: {} as Task };
  }
};