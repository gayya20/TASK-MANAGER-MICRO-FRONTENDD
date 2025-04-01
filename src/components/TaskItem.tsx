import React from 'react';
import { Typography, Tooltip } from 'antd';
import { Task } from '../types/task.types';

const { Text } = Typography;

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  // Calculate days remaining until the task due date
  const calculateDaysRemaining = (): number => {
    const today = new Date();
    const dueDate = new Date(task.endDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  // Get text color based on completion and days remaining
  const getTextStyle = () => {
    if (task.isCompleted) {
      return { color: '#52c41a', textDecoration: 'line-through' };
    }
    
    const daysRemaining = calculateDaysRemaining();
    
    if (daysRemaining < 0) {
      return { color: '#f5222d' }; // Overdue - red
    } else if (daysRemaining <= 2) {
      return { color: '#fa8c16' }; // Due soon - orange
    }
    
    return {}; // Default
  };

  return (
    <div>
      <Tooltip 
        title={
          <div>
            <p>{task.description || 'No description provided'}</p>
            <p>Start: {new Date(task.startDate).toLocaleDateString()}</p>
            <p>Due: {new Date(task.endDate).toLocaleDateString()}</p>
            {task.completionDate && (
              <p>Completed: {new Date(task.completionDate).toLocaleDateString()}</p>
            )}
          </div>
        }
      >
        <Text strong style={getTextStyle()}>
          {task.name}
        </Text>
      </Tooltip>
      
      {!task.isCompleted && calculateDaysRemaining() < 0 && (
        <Text type="danger" style={{ marginLeft: 8 }}>
          (Overdue)
        </Text>
      )}
      
      {!task.isCompleted && calculateDaysRemaining() >= 0 && calculateDaysRemaining() <= 2 && (
        <Text type="warning" style={{ marginLeft: 8 }}>
          (Due soon)
        </Text>
      )}
    </div>
  );
};

export default TaskItem;