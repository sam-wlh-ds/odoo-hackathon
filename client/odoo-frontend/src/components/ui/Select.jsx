import React from 'react';

const Select = ({ value, onValueChange, children, className = '' }) => (
  <select
    value={value}
    onChange={e => onValueChange(e.target.value)}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </select>
);

const SelectTrigger = ({ children }) => <>{children}</>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

export { Select, SelectTrigger, SelectContent, SelectItem };