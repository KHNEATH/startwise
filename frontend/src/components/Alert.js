import React from 'react';

const Alert = ({ type = 'info', title, message, onClose }) => {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`border-l-4 p-4 rounded-xl shadow-sm ${colors[type]}`} role="alert">
      <div className="flex justify-between items-start gap-4">
        <div>
          {title && <div className="font-bold mb-1">{title}</div>}
          <div className="text-sm">{message}</div>
        </div>
        {onClose && (
          <button aria-label="close" onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        )}
      </div>
    </div>
  );
};

export default Alert;
