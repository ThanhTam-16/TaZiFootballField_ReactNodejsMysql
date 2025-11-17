import { useState, useCallback } from 'react';

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: 'Xác nhận',
    message: '',
    onConfirm: null,
    type: 'info',
    confirmText: 'Đồng ý',
    cancelText: 'Hủy',
    isLoading: false
  });

  const showConfirm = useCallback(({
    title = "Xác nhận",
    message = "",
    onConfirm,
    type = "info",
    confirmText = "Đồng ý",
    cancelText = "Hủy"
  }) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        onConfirm: async () => {
          setConfirmState(prev => ({ ...prev, isLoading: true }));
          try {
            await onConfirm();
            resolve(true);
          } catch (error) {
            resolve(false);
            throw error;
          } finally {
            setConfirmState(prev => ({ ...prev, isLoading: false, isOpen: false }));
          }
        },
        type,
        confirmText,
        cancelText,
        isLoading: false
      });
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirmState,
    showConfirm,
    hideConfirm
  };
};

export default useConfirm;