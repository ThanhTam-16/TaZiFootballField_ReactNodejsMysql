// frontend/src/admin/components/ProtectedAdminRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const ProtectedAdminRoute = ({ children, permission }) => {
  const { admin, loading } = useAdmin();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-app">
        <div className="admin-loading-container" style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)'
        }}>
          <div className="admin-loading-spinner">
            <i className="fas fa-spinner fa-spin" style={{
              fontSize: '3rem',
              color: '#e94560',
              animation: 'spin 1s linear infinite'
            }}></i>
            <span style={{
              fontSize: '1.1rem',
              color: '#b2b2b2',
              marginTop: '20px'
            }}>Đang xác thực...</span>
          </div>
          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền nếu được yêu cầu
  if (permission) {
    const hasPermission = admin.permissions.includes('all') || admin.permissions.includes(permission);
    if (!hasPermission) {
      return (
        <div className="admin-app">
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
            padding: '20px'
          }}>
            <div style={{
              background: 'rgba(22, 33, 62, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              maxWidth: '500px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <i className="fas fa-shield-alt" style={{
                fontSize: '4rem',
                color: '#e17055',
                marginBottom: '20px',
                display: 'block'
              }}></i>
              <h2 style={{
                color: '#ffffff',
                fontSize: '1.8rem',
                fontWeight: '600',
                marginBottom: '16px'
              }}>Không có quyền truy cập</h2>
              <p style={{
                color: '#b2b2b2',
                fontSize: '1rem',
                lineHeight: '1.5',
                marginBottom: '12px'
              }}>Bạn không có quyền truy cập vào trang này.</p>
              <p style={{
                color: '#b2b2b2',
                fontSize: '1rem',
                lineHeight: '1.5',
                marginBottom: '12px'
              }}>Liên hệ Super Admin để được cấp quyền <strong style={{
                color: '#e94560',
                fontWeight: '600'
              }}>{permission}</strong></p>
              <button onClick={() => window.history.back()} style={{
                background: 'linear-gradient(135deg, #e94560, #d63031)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '20px'
              }}>
                <i className="fas fa-arrow-left"></i>
                Quay lại
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedAdminRoute;