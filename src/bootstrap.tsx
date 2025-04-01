import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import TaskManagement from './TaskManagement';
// import 'antd/dist/antd.css';

// Mount function to render the app in development mode
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

// If we are in development and running in isolation
if (process.env.NODE_ENV === 'development') {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    mount(rootElement);
  }
}

// We are running in a container (host) app
export { TaskManagement };