import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'default', ...props }) => {
  let baseStyle = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';
  let variantStyle = '';

  switch (variant) {
    case 'default':
      variantStyle = 'bg-[#fca311] text-white hover:bg-[#f59e0b] hover:opacity-90';
      break;
    case 'outline':
      variantStyle = 'border border-gray-300 text-gray-700 hover:bg-gray-100';
      break;
    case 'secondary':
      variantStyle = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      break;
    case 'destructive':
      variantStyle = 'bg-red-600 text-white hover:bg-red-700';
      break;
    case 'ghost':
      variantStyle = 'bg-transparent text-gray-700 hover:bg-gray-100';
      break;
    default:
      variantStyle = 'bg-blue-600 text-white hover:bg-blue-700';
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };