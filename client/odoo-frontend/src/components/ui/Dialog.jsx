import React from 'react';

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-white">
      <div className="relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};

const DialogHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left text-white ${className}`}>
    {children}
  </div>
);

const DialogTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight text-white ${className}`}>
    {children}
  </h3>
);

const DialogDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-muted-foreground text-white ${className}`}>
    {children}
  </p>
);

const DialogContent = ({ children, className = '' }) => (
  <div className={`grid gap-4 py-4 text-white ${className}`}>
    {children}
  </div>
);

const DialogFooter = ({ children, className = '' }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 text-white ${className}`}>
    {children}
  </div>
);

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter };