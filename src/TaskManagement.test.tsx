// Add this to your TaskManagement.test.tsx file
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskManagement from './TaskManagement';
import * as taskService from './services/taskService';


// Add this test case to the describe block
test('shows add task button for admin users', () => {
  render(<TaskManagement userRole="admin" userId="test-user-123" />);
  const addButton = screen.getByText(/Add Task/i);
  expect(addButton).toBeInTheDocument();
});

test('does not show add task button for regular users', () => {
  render(<TaskManagement userRole="user" userId="test-user-123" />);
  const addButton = screen.queryByText(/Add Task/i);
  expect(addButton).not.toBeInTheDocument();

});

test('admin can open task form when add button is clicked', async () => {
  // Set up mock
  (taskService.getTasks as jest.Mock).mockResolvedValue({
    success: true,
    data: []
  });
  
  // Render with admin role
  render(<TaskManagement userRole="admin" userId="test-user-123" />);
  
  // Find and click the add button
  const addButton = screen.getByText(/Add Task/i);
  userEvent.click(addButton);
  
  // Check if the form appears
  const formTitle = await screen.findByText(/Create New Task/i);
  expect(formTitle).toBeInTheDocument();
});
// Add this to your test file
test('admin can create a new task', async () => {
    // Mock getTasks and createTask
    (taskService.getTasks as jest.Mock).mockResolvedValue({
      success: true,
      data: []
    });
    
    (taskService.createTask as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Task created successfully',
      data: {
        _id: 'task-123',
        name: 'Test Task',
        description: 'This is a test task',
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-02-01T00:00:00.000Z',
        isActive: true,
        isCompleted: false,
        assignedTo: 'user-123'
      }
    });
    
    // Render with admin role
    render(<TaskManagement userRole="admin" userId="test-user-123" />);
    
    // Click add button
    const addButton = screen.getByText(/Add Task/i);
    userEvent.click(addButton);
    
    // Wait for form modal to appear
    const nameInput = await screen.findByLabelText(/Task Name/i);
    
    // Fill out the form (Note: you may need to adapt selectors based on your actual implementation)
    userEvent.type(nameInput, 'Test Task');
    
    // Find and click submit button
    const submitButton = screen.getByText(/Create/i);
    userEvent.click(submitButton);
    
    // Verify the service was called with the right data
    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Task'
      }));
    });
    
    // Verify getTasks was called to refresh the list
    expect(taskService.getTasks).toHaveBeenCalledTimes(2); // Once on initial render, once after creation
  });