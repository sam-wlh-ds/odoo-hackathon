import React, { useState } from 'react';

const Tabs = ({ defaultValue, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div className={className}>
      <div className="flex space-x-2 border-b">
        {/* Pass activeTab and setActiveTab to children of Tabs (which will be TabsList) */}
        {React.Children.map(children, child =>
          React.cloneElement(child, { activeTab, setActiveTab })
        )}
      </div>
      <div className="py-4">
        {React.Children.map(children, child =>
          child.props.value === activeTab ? child.props.children : null
        )}
      </div>
    </div>
  );
};

const TabsList = ({ children, className = '', activeTab, setActiveTab }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

const TabsTrigger = ({ value, activeTab, setActiveTab, children, className = '' }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      activeTab === value ? 'bg-background text-foreground shadow-sm' : ''
    } ${className}`}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children }) => (
  <div data-state={value} className="mt-2">
    {children}
  </div>
);

export { Tabs, TabsList, TabsTrigger, TabsContent };