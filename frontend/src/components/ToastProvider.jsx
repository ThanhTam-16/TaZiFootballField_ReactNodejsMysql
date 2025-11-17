// ====== frontend/src/components/ToastProvider.jsx ======
import React from 'react';

export const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      {/* Toast container will be automatically created by useToast hook */}
    </>
  );
};

export default ToastProvider;