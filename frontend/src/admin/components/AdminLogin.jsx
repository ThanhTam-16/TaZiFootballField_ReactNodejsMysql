// frontend/src/admin/components/AdminLogin.jsx
import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-app">
      <div className="admin-login-container">
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <div className="admin-logo">
                <i className="fas fa-futbol"></i>
                <h1>FootballField Admin</h1>
              </div>
              <p>Đăng nhập vào hệ thống quản trị</p>
            </div>

            <form className="admin-login-form" onSubmit={handleSubmit}>
              {error && (
                <div className="admin-error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              <div className="admin-form-group">
                <label htmlFor="email">Email</label>
                <div className="admin-input-wrapper">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="password">Mật khẩu</label>
                <div className="admin-input-wrapper">
                  <i className="fas fa-lock"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`admin-login-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Đăng nhập
                  </>
                )}
              </button>
            </form>

            <div className="admin-login-footer">
              <p>
                <i className="fas fa-shield-alt"></i>
                Hệ thống quản trị an toàn
              </p>
            </div>
          </div>

          <div className="admin-login-info">
            <div className="info-card">
              <i className="fas fa-info-circle"></i>
              <h3>Thông tin đăng nhập</h3>
              <div className="demo-accounts">
                <div className="demo-account">
                  <strong>Super Admin:</strong>
                  <div>Email: admin@footballfield.com</div>
                  <div>Password: admin123</div>
                </div>
                <div className="demo-account">
                  <strong>Manager:</strong>
                  <div>Email: manager@footballfield.com</div>
                  <div>Password: admin123</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .admin-login-info {
            display: none;
          }

          @media (min-width: 1024px) {
            .admin-login-wrapper {
              grid-template-columns: 1fr 1fr;
              align-items: center;
            }

            .admin-login-info {
              display: block;
            }

            .info-card {
              background: rgba(26, 26, 46, 0.6);
              backdrop-filter: blur(10px);
              border-radius: 20px;
              padding: 40px;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .info-card i {
              font-size: 3rem;
              color: #74b9ff;
              margin-bottom: 20px;
              display: block;
            }

            .info-card h3 {
              color: #ffffff;
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 25px;
            }

            .demo-accounts {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            .demo-account {
              background: rgba(15, 15, 35, 0.4);
              padding: 20px;
              border-radius: 12px;
              border: 1px solid rgba(255, 255, 255, 0.05);
            }

            .demo-account strong {
              color: #e94560;
              display: block;
              margin-bottom: 10px;
              font-size: 1rem;
            }

            .demo-account div {
              color: #b2b2b2;
              font-size: 0.9rem;
              margin-bottom: 5px;
              font-family: 'Courier New', monospace;
            }
          }

          @media (max-width: 480px) {
            .admin-login-card {
              padding: 30px 20px;
            }

            .admin-logo h1 {
              font-size: 1.5rem;
            }

            .admin-logo i {
              font-size: 2.5rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdminLogin;