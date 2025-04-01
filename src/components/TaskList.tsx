import React from 'react';
import { Table, Tag, Space, Button, Tooltip, Switch, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Task } from '../types/task.types';
import TaskItem from './TaskItem';
import { deleteTask, updateTaskCompletion } from '../services/taskService';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  userRole: 'admin' | 'user';
  onEdit?: (task: Task) => void;
  onStatusChange: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  loading, 
  userRole, 
  onEdit,
  onStatusChange 
}) => {
  const isAdmin = userRole === 'admin';
  
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteTask(id);
      if (response.success) {
        message.success('Task deleted successfully');
        onStatusChange();
      } else {
        message.error(response.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Failed to delete task. Please try again.');
    }
  };
  
  const handleCompletionChange = async (id: string, isCompleted: boolean) => {
    try {
      const response = await updateTaskCompletion(id, { 
        isCompleted, 
        completionDate: isCompleted ? new Date().toISOString() : undefined 
      });
      
      if (response.success) {
        message.success(`Task marked as ${isCompleted ? 'completed' : 'pending'}`);
        onStatusChange();
      } else {
        message.error(response.message || 'Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      message.error('Failed to update task status. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Task) => <TaskItem task={record} />,
    },
    {
      title: 'Status',
      key: 'status',
      render: (text: string, record: Task) => (
        <Space size="middle">
          <Tag color={record.isActive ? 'blue' : 'default'}>
            {record.isActive ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
          <Tag color={record.isCompleted ? 'success' : 'processing'}>
            {record.isCompleted ? 'COMPLETED' : 'PENDING'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo: any) => {
        // Handle null case
        if (!assignedTo) return 'Unassigned';
        
        // Handle both string ID and populated user object
        if (typeof assignedTo === 'string') {
          return assignedTo;
        }
        
        // Handle the case where the user object exists but might be missing properties
        return `${assignedTo.firstName || ''} ${assignedTo.lastName || ''}`;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: Task) => (
        <Space size="middle">
          {isAdmin ? (
            <>
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => onEdit && onEdit(record)}
              />
              <Popconfirm
                title="Are you sure you want to delete this task?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                />
              </Popconfirm>
            </>
          ) : (
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              checked={record.isCompleted}
              onChange={(checked) => handleCompletionChange(record._id, checked)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={tasks} 
      rowKey="_id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default TaskList;