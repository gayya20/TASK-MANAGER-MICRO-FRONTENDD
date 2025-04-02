import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import TaskManagement from './TaskManagement';
// import 'antd/dist/antd.css';

const mount = (rootElement: HTMLElement) => {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <ConfigProvider>
        <TaskManagement />
      </ConfigProvider>
    </React.StrictMode>
  );
};

if (process.env.NODE_ENV === 'development') {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    mount(rootElement);
  }
}

export { TaskManagement };