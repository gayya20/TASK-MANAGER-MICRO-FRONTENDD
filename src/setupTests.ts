import '@testing-library/jest-dom';

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

jest.mock('antd', () => {
  const originalModule = jest.requireActual('antd');
  return {
    ...originalModule,
    message: {
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn()
    }
  };
});


const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes('act(...)') || 
      args[0]?.includes('Warning: [antd:') || 
      args[0]?.includes('React.jsx: type is invalid')) {
    return;
  }
  originalError(...args);
};