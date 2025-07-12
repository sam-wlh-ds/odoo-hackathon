import React from 'react';

const Checkbox = ({ id, checked, onCheckedChange, children, className = '' }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={e => onCheckedChange(e.target.checked)}
      className={`h-4 w-4 rounded border border-gray-300 bg-white text-blue-600 focus:ring-blue-500 ${className}`}
    />
    {children && <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{children}</label>}
  </div>
);

export { Checkbox };