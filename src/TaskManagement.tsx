import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import { getTasks } from './services/taskService';
import { Task, TaskFilter as FilterType } from './types/task.types';

const { TabPane } = Tabs;

interface TaskManagementProps {
  userRole?: 'admin' | 'user';
  userId?: string;
}

const TaskManagement: React.FC<TaskManagementProps> = ({ 
  userRole = 'user',
  userId 
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterType>({
    isCompleted: undefined,
    isActive: true
  });

  const isAdmin = userRole === 'admin';

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getTasks(filters);
      if (response.success) {
        setTasks(response.data);
        setFilteredTasks(response.data);
      } else {
        message.error('Failed to load tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Error loading tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
    message.success(`Task ${editingTask ? 'updated' : 'created'} successfully`);
  };

  const handleTaskStatusChange = () => {
    fetchTasks();
  };

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleTabChange = (key: string) => {
    setFilters({
      ...filters,
      isCompleted: key === 'completed' ? true : key === 'pending' ? false : undefined
    });
  };

  return (
    <div>
      <Card
        title="Task Management"
        extra={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchTasks}
              loading={loading}
            >
              Refresh
            </Button>
            
            {isAdmin && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddTask}
              >
                Add Task
              </Button>
            )}
          </div>
        }
      >
        <TaskFilter onFilterChange={handleFilterChange} />
        
        <Tabs defaultActiveKey="all" onChange={handleTabChange}>
          <TabPane tab="All Tasks" key="all">
            <TaskList
              tasks={filteredTasks}
              loading={loading}
              userRole={userRole}
              onEdit={isAdmin ? handleEditTask : undefined}
              onStatusChange={handleTaskStatusChange}
            />
          </TabPane>
          <TabPane tab="Pending" key="pending">
            <TaskList
              tasks={filteredTasks.filter(task => !task.isCompleted)}
              loading={loading}
              userRole={userRole}
              onEdit={isAdmin ? handleEditTask : undefined}
              onStatusChange={handleTaskStatusChange}
            />
          </TabPane>
          <TabPane tab="Completed" key="completed">
            <TaskList
              tasks={filteredTasks.filter(task => task.isCompleted)}
              loading={loading}
              userRole={userRole}
              onEdit={isAdmin ? handleEditTask : undefined}
              onStatusChange={handleTaskStatusChange}
            />
          </TabPane>
        </Tabs>
      </Card>

      {showForm && (
        <TaskForm
          visible={showForm}
          task={editingTask}
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default TaskManagement;