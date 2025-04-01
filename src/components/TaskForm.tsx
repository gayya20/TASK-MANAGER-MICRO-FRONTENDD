import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Switch, Button, message } from 'antd';
import { createTask, updateTask } from '../services/taskService';
import { Task } from '../types/task.types';
import dayjs from 'dayjs';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

interface TaskFormProps {
  visible: boolean;
  task?: Task | null;
  onCancel: () => void;
  onSuccess: () => void;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  task,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const formattedUsers = response.data.data.map((user: any) => ({
            id: user._id || user.id || '',
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }));
          setUsers(formattedUsers);
        } else {
          message.error('Failed to load users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        message.error('Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        name: task.name,
        description: task.description,
        startDate: dayjs(task.startDate),
        endDate: dayjs(task.endDate),
        assignedTo: typeof task.assignedTo === 'string' 
          ? task.assignedTo 
          : task.assignedTo._id,
        isActive: task.isActive ?? true
      });
    } else {
      form.resetFields();
    }
  }, [form, task]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (!values.startDate || !values.endDate) {
        message.error('Please select valid dates');
        return;
      }

      const taskData = {
        name: values.name,
        description: values.description,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        assignedTo: values.assignedTo,
        isActive: values.isActive ?? true
      };

      const response = task 
        ? await updateTask(task._id, taskData)
        : await createTask(taskData);

      if (response.success) {
        message.success(`Task ${task ? 'updated' : 'created'} successfully`);
        onSuccess();
      } else {
        message.error(response.message || `Failed to ${task ? 'update' : 'create'} task`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      message.error(`Failed to ${task ? 'update' : 'create'} task`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={task ? 'Edit Task' : 'Create New Task'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>Cancel</Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {task ? 'Update' : 'Create'}
        </Button>
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Task Name"
          rules={[{ required: true, message: 'Please enter task name' }]}
        >
          <Input placeholder="Enter task name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ max: 1250, message: 'Description cannot exceed 1250 characters' }]}
        >
          <TextArea
            placeholder="Enter task description (optional)"
            rows={4}
            maxLength={1250}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select start date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: 'Please select end date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="assignedTo"
          label="Assign To"
          rules={[{ required: true, message: 'Please assign this task to a user' }]}
        >
          <Select
            placeholder="Select a user"
            loading={loadingUsers}
          >
            {users.length > 0 ? (
              users.map(user => (
                <Option 
                  key={user.id || user.email || 'user-' + Math.random()} 
                  value={user.id}
                >
                  {user.firstName} {user.lastName} ({user.email})
                </Option>
              ))
            ) : (
              <Option key="empty-users" value="">
                No users available
              </Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Active"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;