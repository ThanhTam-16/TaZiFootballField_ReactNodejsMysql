# ⚽ Football Field Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

**Hệ thống quản lý sân bóng và đặt sân trực tuyến** - Giải pháp toàn diện cho việc vận hành và quản lý các sân bóng đá mini.

---

## 🎯 Tổng quan dự án

Hệ thống được thiết kế với 2 giao diện chính:
- **Khách hàng**: Đặt sân, tìm kèo, ghép đội trực tuyến
- **Quản trị**: Quản lý sân, duyệt booking, thống kê doanh thu

### 🎪 Tính năng đặc biệt
- **Pricing Engine**: Hệ thống tính giá động theo giờ và loại sân
- **Real-time Booking**: Kiểm tra sân trống theo thời gian thực
- **Match Making**: Hệ thống tìm kèo và ghép đội thông minh
- **OTP Authentication**: Xác thực qua SMS/Email
- **Inventory Management**: Quản lý kho thiết bị chuyên nghiệp

---

## 🚀 Tính năng chính

### 👥 Dành cho khách hàng
- **Xác thực OTP**: Đăng nhập nhanh qua phone/email
- **Đặt sân thông minh**: Tìm sân trống với giá động theo thời gian
- **Tìm kèo**: Tạo và tham gia các trận đấu
- **Ghép đội**: Đăng tin tuyển người, tìm đội thiếu người
- **Theo dõi booking**: Lịch sử đặt sân và trạng thái
- **Liên hệ**: Form liên hệ tích hợp Google Maps

### 🛠 Dành cho quản trị viên
- **Dashboard**: Thống kê doanh thu, booking real-time
- **Quản lý sân**: CRUD sân, lịch bảo trì, trạng thái
- **Duyệt booking**: Xác nhận, hủy, chỉnh sửa đặt sân
- **Quản lý khách hàng**: Database khách hàng, lịch sử
- **Inventory**: Quản lý thiết bị, nhập xuất kho
- **Báo cáo**: Analytics doanh thu, occupancy rate
- **Phân quyền**: Super admin/Admin/Manager roles

---

## ⚙️ Công nghệ sử dụng

### Backend
- **Framework**: Node.js + Express.js
- **Database**: MySQL 8.0+
- **Authentication**: JWT + OTP (Twilio/NodeMailer)
- **File Upload**: Multer
- **Validation**: Express-validator

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Font Awesome

### Tools & Libraries
- **Development**: Nodemon, Concurrently
- **Database**: MySQL2
- **Email**: Nodemailer
- **SMS**: (Tích hợp sẵn cho Twilio/SMS providers)

---

## 📁 Cấu trúc dự án

```
football-field-management/
├── 📂 backend/                    # Node.js API Server
│   ├── 📂 config/                 # Database & environment config
│   ├── 📂 controllers/            # Business logic controllers
│   │   ├── authController.js      # OTP & admin authentication
│   │   ├── bookingController.js   # Booking management
│   │   ├── fieldController.js     # Field operations
│   │   ├── matchController.js     # Match & team features
│   │   ├── dashboardController.js # Admin dashboard stats
│   │   └── ...
│   ├── 📂 models/                 # Database models
│   ├── 📂 routes/                 # API routes
│   ├── 📂 middleware/             # Auth & validation
│   └── 📂 utils/                  # Helper functions
│
├── 📂 frontend/                   # React Application
│   └── 📂 src/
│       ├── 📂 admin/              # Admin interface
│       │   ├── 📂 components/     # Admin components
│       │   ├── 📂 pages/          # Admin pages
│       │   └── 📂 services/       # Admin API services
│       ├── 📂 components/         # Customer components
│       ├── 📂 pages/              # Customer pages
│       ├── 📂 services/           # Customer API services
│       └── 📂 context/            # State management
│
└── 📂 database/                   # SQL schema & migrations
```

---

## 🚀 Hướng dẫn cài đặt

### 🧰 Yêu cầu hệ thống
- Node.js >= 18.x
- MySQL >= 8.0
- npm hoặc yarn

### ⚙️ Cài đặt development

#### 1. Clone và setup project
```bash
git clone [private-repository]
cd football-field-management
```

#### 2. Cài đặt dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### 3. Cấu hình database
```bash
# Tạo database
mysql -u root -p -e "CREATE DATABASE football_field_management;"

# Import schema
mysql -u root -p football_field_management < database/football_field_management.sql
```

#### 4. Cấu hình environment variables

**Backend (.env):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=football_field_management
JWT_SECRET=your_jwt_secret
PORT=5000

# OTP Configuration
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=nguyenthanhtam10062004@gmail.com
EMAIL_PASS=lbgcyigvbevqkvyr
MAIL_RECEIVER=2200000922@nttu.edu.vn
```

#### 5. Khởi chạy ứng dụng

**Development mode (parallel):**
```bash
# Từ root directory
npm run dev
```

**Hoặc khởi chạy riêng biệt:**
```bash
# Backend (Port 5000)
cd backend && npm start

# Frontend (Port 3000)
cd frontend && npm run dev
```

---

## 🎮 Sử dụng hệ thống

### 💻 Truy cập ứng dụng
- **Customer Interface**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### 👤 Tài khoản mặc định

**Super Admin:**
- Username: `admin@footballfield.com`
- Password: `admin123`

**Demo Customer:**
- Phone: `0xxxxxxxxx` (OTP: `xxxxxx` gửi về mail hoặc điện thoại)

---

## 📊 Tính năng nổi bật

### 🎯 Dynamic Pricing System
```javascript
// Ví dụ logic tính giá
Peak Hours (17:00-21:00): Base price × 1.5
Weekend: Base price × 1.2
Field Type Premium: Base price × 1.3
```

### 📱 Real-time Field Status
- Timeline view với overlap checking
- Auto-refresh field availability
- Booking conflict prevention

### 🔐 Advanced Authentication
- OTP qua SMS (Twilio integration)
- OTP qua Email (NodeMailer)
- JWT session management
- Role-based permissions

### 📈 Business Analytics
- Revenue tracking
- Field utilization rates
- Customer behavior analysis
- Peak hour statistics

---

## 🎨 Screenshots

### Customer Interface
- **Homepage**: Hero section + quick booking
- **Booking Page**: Field selection với pricing
- **Match Finder**: Tìm kèo + ghép đội interface
- **Profile**: Booking history + stats

### Admin Dashboard
- **Overview**: Revenue + booking statistics
- **Field Management**: Timeline view + CRUD
- **Booking Management**: Advanced filtering + bulk actions
- **Customer Management**: User database + analytics

---

## 🔧 API Documentation

### Customer Endpoints
```
GET  /api/fields              # Danh sách sân + giá
POST /api/bookings            # Tạo booking mới
GET  /api/matches             # Tìm kèo available
POST /api/team-joins          # Đăng tin ghép đội
POST /api/auth/send-otp       # Gửi OTP
POST /api/auth/verify-otp     # Xác thực OTP
```

### Admin Endpoints
```
GET  /api/admin/dashboard     # Dashboard stats
GET  /api/admin/bookings      # Quản lý booking
PUT  /api/admin/fields/:id    # Cập nhật sân
GET  /api/admin/revenue       # Báo cáo doanh thu
GET  /api/admin/inventory     # Quản lý kho
```

---



### Manual Testing Checklist
- [ ] OTP authentication flow
- [ ] Booking creation + pricing calculation
- [ ] Admin dashboard functionality
- [ ] Real-time field status updates
- [ ] Mobile responsive design

---

## 📦 Deployment

### Production Setup
```bash
# Build frontend
cd frontend && npm run build

# Start production server
cd backend && npm start
```

### Environment Requirements
- **Server**: Ubuntu 20.04+ hoặc CentOS 8+
- **Memory**: Minimum 2GB RAM
- **Storage**: 20GB+ SSD
- **Domain**: SSL certificate required

---

### Deployment
- **Database**: railway.com
- **Backend**: Render.com
- **Frontend**: Vercel.com

---

## 🔐 Security Features

- **SQL Injection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CORS**: Configured origins
- **Rate Limiting**: API request limits
- **JWT Expiration**: Token lifecycle management
- **Password Hashing**: bcrypt implementation

---

## 📈 Performance Optimization

- **Database Indexing**: Optimized queries
- **Image Compression**: Auto-resize uploads
- **Caching**: Redis integration ready
- **CDN Ready**: Static asset optimization
- **Bundle Splitting**: Code splitting implemented

---

## 🛠 Maintenance

### Database Backup
```bash
# Daily backup script
mysqldump -u root -p football_field_management > backup_$(date +%Y%m%d).sql
```

### Log Monitoring
- Error logs: `backend/logs/`
- Access logs: Server logs
- Performance monitoring ready

---

## 📞 Hỗ trợ

### Development Issues
- Check console logs cho debugging
- Verify database connection
- Confirm environment variables

### Business Logic Questions
- Pricing configuration: `backend/models/PricingRule.js`
- Booking workflow: `backend/controllers/bookingController.js`
- User authentication: `backend/middleware/authMiddleware.js`

---

## 📄 License

**Proprietary Software** - All rights reserved.

**Bản quyền © 2024 Nguyễn Thành Tâm**

Phần mềm này được phát triển cho mục đích thương mại. Nghiêm cấm sao chép, phân phối hoặc sử dụng mà không có sự cho phép bằng văn bản.

---

## 📧 Liên hệ

**Nhà phát triển**: Nguyễn Thành Tâm  
**Email**: nguyenthanhtam10062004@gmail.com  
**Dự án**: Football Field Management System  

---

*README này dành cho môi trường development. Production deployment sẽ có hướng dẫn riêng biệt.*
