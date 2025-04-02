import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskManagement from './TaskManagement';
import * as taskService from './services/taskService';

jest.mock('./services/taskService', () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  updateTaskCompletion: jest.fn(),
  getUsers: jest.fn()
}));

jest.mock('antd', () => {
  const originalModule = jest.requireActual('antd');
  return {
    ...originalModule,
    message: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn()
    },
    Tabs: ({ onChange, defaultActiveKey, items }) => {
      return (
        <div data-testid="mock-tabs" data-default-key={defaultActiveKey}>
          {items && items.map(item => (
            <div key={item.key} data-tab-key={item.key} data-tab-label={item.label}>
              {item.children}
            </div>
          ))}
        </div>
      );
    }
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('TaskManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (taskService.getTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: []
    });
    
    (taskService.getUsers as jest.Mock).mockResolvedValue({
      success: true,
      data: [{ _id: 'user1', name: 'Test User' }]
    });
  });

  test('renders task management heading', async () => {
    render(<TaskManagement userRole="admin" userId="test-user-123" />);
    
    
    await waitFor(() => {
      expect(screen.getByText('Task Management')).toBeInTheDocument();
    });
  });
  
  test('shows add task button for admin users', async () => {
    render(<TaskManagement userRole="admin" userId="test-user-123" />);
    
    await waitFor(() => {
      expect(taskService.getTasks).toHaveBeenCalled();
    });
    
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });
  
  test('does not show add task button for regular users', async () => {
    render(<TaskManagement userRole="user" userId="test-user-123" />);
    
    await waitFor(() => {
      expect(taskService.getTasks).toHaveBeenCalled();
    });
    
    expect(screen.queryByText('Add Task')).not.toBeInTheDocument();
  });
  
  
  test('admin can add a new task', async () => {
    (taskService.createTask as jest.Mock).mockResolvedValue({
      success: true,
      data: { _id: 'new-task', name: 'New Task' }
    });
    
    render(<TaskManagement userRole="admin" userId="test-user-123" />);
    
    await waitFor(() => {
      expect(taskService.getTasks).toHaveBeenCalled();
    });
    
    const addButton = screen.getByText('Add Task');
    userEvent.click(addButton);
   
    await waitFor(() => {
      
      const formElement = screen.queryByText(/task name/i) || 
                        screen.queryByText(/create/i) ||
                        screen.queryByLabelText(/task name/i);
      expect(formElement).toBeInTheDocument();
    });
  });
});