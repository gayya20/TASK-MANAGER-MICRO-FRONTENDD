import React, { useState } from 'react';
import { Form, Row, Col, Select, DatePicker, Button, Card } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { TaskFilter as FilterType } from '../types/task.types';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface TaskFilterProps {
  onFilterChange: (filters: FilterType) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);

  const handleFinish = (values: any) => {
    const filters: FilterType = {};
    
    if (values.isActive !== undefined) {
      filters.isActive = values.isActive;
    }
    
    if (values.dateRange && values.dateRange.length === 2) {
      filters.startDate = values.dateRange[0].toISOString();
      filters.endDate = values.dateRange[1].toISOString();
    }
    
    if (values.sort) {
      filters.sort = values.sort;
    }
    
    onFilterChange(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onFilterChange({});
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  if (!expanded) {
    return (
      <Button 
        icon={<FilterOutlined />} 
        onClick={toggleExpand}
        style={{ marginBottom: 16 }}
      >
        Show Filters
      </Button>
    );
  }

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="horizontal"
        onFinish={handleFinish}
        initialValues={{ isActive: true }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="isActive" label="Status">
              <Select placeholder="Select status">
                <Option value={true}>Active</Option>
                <Option value={false}>Inactive</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="dateRange" label="Date Range">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="sort" label="Sort By">
              <Select placeholder="Sort by">
                <Option value="name">Name (A-Z)</Option>
                <Option value="-name">Name (Z-A)</Option>
                <Option value="startDate">Start Date (Asc)</Option>
                <Option value="-startDate">Start Date (Desc)</Option>
                <Option value="endDate">End Date (Asc)</Option>
                <Option value="-endDate">End Date (Desc)</Option>
                <Option value="-createdAt">Newest First</Option>
                <Option value="createdAt">Oldest First</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<FilterOutlined />} style={{ marginRight: 8 }}>
                Apply
              </Button>
              <Button onClick={handleReset} icon={<ClearOutlined />} style={{ marginRight: 8 }}>
                Reset
              </Button>
              <Button onClick={toggleExpand}>
                Hide
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default TaskFilter;