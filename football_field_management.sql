-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 27, 2025 lúc 05:07 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `football_field_management`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `time_slot_id` int(11) NOT NULL,
  `status` enum('pending','approved','cancelled','completed') DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','online') DEFAULT 'cash',
  `payment_status` enum('pending','paid','refunded') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `start_time` time NOT NULL DEFAULT '00:00:00',
  `end_time` time NOT NULL DEFAULT '00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `field_id`, `booking_date`, `time_slot_id`, `status`, `total_amount`, `payment_method`, `payment_status`, `notes`, `created_at`, `updated_at`, `start_time`, `end_time`) VALUES
(1, 1, 1, '2025-06-30', 5, 'pending', 200000.00, 'cash', 'pending', NULL, '2025-06-30 15:19:43', '2025-06-30 15:19:43', '00:00:00', '00:00:00'),
(2, 1, 3, '2025-07-20', 1, 'completed', 200000.00, 'cash', 'pending', NULL, '2025-07-20 06:57:17', '2025-07-20 06:57:17', '00:00:00', '00:00:00'),
(3, 1, 1, '2025-07-26', 0, 'completed', 200000.00, 'cash', 'pending', 'nhận sân sớm ', '2025-07-26 04:37:09', '2025-07-26 05:12:32', '06:00:00', '07:30:00'),
(4, 1, 3, '2025-07-26', 0, 'pending', 600000.00, 'cash', 'pending', NULL, '2025-07-26 10:37:33', '2025-07-26 10:37:33', '06:00:00', '08:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking_services`
--

CREATE TABLE `booking_services` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fields`
--

CREATE TABLE `fields` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('5vs5','7vs7','11vs11') NOT NULL,
  `price_per_hour` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `facilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`facilities`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `fields`
--

INSERT INTO `fields` (`id`, `name`, `type`, `price_per_hour`, `description`, `images`, `facilities`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Sân A1', '5vs5', 200000.00, 'Sân 5 người có đèn chiếu sáng', NULL, '[\"Đèn chiếu sáng\", \"Thảm cỏ nhân tạo\", \"Khung thành mini\"]', 1, '2025-05-29 09:19:20', '2025-05-29 09:19:20'),
(2, 'Sân A2', '5vs5', 200000.00, 'Sân 5 người tiêu chuẩn', NULL, '[\"Đèn chiếu sáng\", \"Thảm cỏ nhân tạo\"]', 1, '2025-05-29 09:19:20', '2025-05-29 09:19:20'),
(3, 'Sân B1', '7vs7', 300000.00, 'Sân 7 người rộng rãi', NULL, '[\"Đèn chiếu sáng\", \"Thảm cỏ nhân tạo\", \"Phòng thay đồ\"]', 1, '2025-05-29 09:19:20', '2025-05-29 09:19:20'),
(4, 'Sân C1', '11vs11', 500000.00, 'Sân 11 người tiêu chuẩn FIFA', NULL, '[\"Đèn chiếu sáng\", \"Cỏ tự nhiên\", \"Phòng thay đồ\", \"Bảng điện tử\"]', 1, '2025-05-29 09:19:20', '2025-05-29 09:19:20'),
(5, 'Sân A3', '5vs5', 200000.00, NULL, NULL, NULL, 1, '2025-07-20 10:07:13', '2025-07-26 03:23:42');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `maintenance_schedules`
--

CREATE TABLE `maintenance_schedules` (
  `id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `maintenance_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `reason` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `maintenance_schedules`
--

INSERT INTO `maintenance_schedules` (`id`, `field_id`, `maintenance_date`, `start_time`, `end_time`, `reason`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 2, '2025-07-03', '14:00:00', '16:00:00', 'Bảo trì hệ thống chiếu sáng', 'Thay đèn LED sân', 1, '2025-06-30 16:05:41', '2025-06-30 16:05:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `matches`
--

CREATE TABLE `matches` (
  `id` int(11) NOT NULL,
  `creator_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `match_date` date NOT NULL,
  `current_players` int(11) DEFAULT 1,
  `max_players` int(11) NOT NULL,
  `level` enum('beginner','intermediate','advanced') DEFAULT 'intermediate',
  `age_min` int(11) DEFAULT NULL,
  `age_max` int(11) DEFAULT NULL,
  `price_per_person` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `contact_name` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(15) DEFAULT NULL,
  `allow_join` tinyint(1) DEFAULT 1,
  `status` enum('open','full','closed','completed') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `position_needed` enum('goalkeeper','defender','midfielder','forward','any') DEFAULT 'any',
  `players_needed` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `matches`
--

INSERT INTO `matches` (`id`, `creator_id`, `field_id`, `match_date`, `current_players`, `max_players`, `level`, `age_min`, `age_max`, `price_per_person`, `description`, `contact_name`, `contact_phone`, `allow_join`, `status`, `created_at`, `updated_at`, `position_needed`, `players_needed`) VALUES
(1, 1, 2, '2025-07-02', 1, 10, 'intermediate', NULL, NULL, 20000.00, 'Giao lưu nhẹ', 'Trâm Anh', '0123456789', 1, 'open', '2025-06-30 15:39:05', '2025-06-30 15:39:05', 'forward', 2),
(7, 4, 1, '2025-07-28', 1, 0, 'intermediate', 18, 25, 20000.00, 'giao lưu vv', 'Thành', '0979993920', 1, 'open', '2025-07-27 03:06:13', '2025-07-27 03:06:13', 'any', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `match_participants`
--

CREATE TABLE `match_participants` (
  `id` int(11) NOT NULL,
  `match_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` int(11) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `otp_codes`
--

INSERT INTO `otp_codes` (`id`, `phone_number`, `otp_code`, `expires_at`, `is_used`, `created_at`) VALUES
(4, '0868713558', '677590', '2025-06-26 14:36:25', 1, '2025-06-26 14:36:16'),
(5, '0868713558', '670993', '2025-06-30 16:04:10', 0, '2025-06-30 16:01:10'),
(6, '0868713558', '598714', '2025-07-25 04:23:53', 1, '2025-07-25 04:23:42'),
(7, '0123467895', '156650', '2025-07-25 04:27:35', 1, '2025-07-25 04:27:29'),
(8, '0868713558', '538973', '2025-07-25 04:27:57', 1, '2025-07-25 04:27:50'),
(9, '0868713558', '511365', '2025-07-25 08:00:18', 1, '2025-07-25 08:00:03'),
(10, '1234567890', '103666', '2025-07-25 08:06:34', 1, '2025-07-25 08:06:28'),
(11, '0868713558', '219819', '2025-07-25 08:12:49', 0, '2025-07-25 08:09:49'),
(12, '0868713558', '579553', '2025-07-25 08:10:02', 1, '2025-07-25 08:09:56'),
(13, '0979993920', '344054', '2025-07-25 08:12:30', 1, '2025-07-25 08:12:22'),
(14, '0868713558', '976339', '2025-07-25 14:37:23', 1, '2025-07-25 14:37:14'),
(15, '0979993920', '477036', '2025-07-25 14:50:42', 1, '2025-07-25 14:50:35'),
(16, '0979993920', '867787', '2025-07-25 14:53:54', 1, '2025-07-25 14:53:46'),
(17, '0123456789', '924712', '2025-07-25 15:09:47', 1, '2025-07-25 15:09:39'),
(18, '0868713558', '523383', '2025-07-25 15:12:24', 1, '2025-07-25 15:12:17'),
(19, '0868713558', '128501', '2025-07-25 15:17:28', 0, '2025-07-25 15:14:28'),
(20, '0868713558', '819413', '2025-07-25 15:14:50', 1, '2025-07-25 15:14:44'),
(21, '0868713558', '518831', '2025-07-26 05:33:42', 1, '2025-07-26 05:33:35'),
(22, '0385868251', '801461', '2025-07-26 05:34:19', 1, '2025-07-26 05:34:14'),
(23, '0979993920', '648174', '2025-07-26 05:37:19', 1, '2025-07-26 05:37:13'),
(24, '0385868251', '524421', '2025-07-26 05:39:18', 1, '2025-07-26 05:39:12'),
(25, '0385868251', '395670', '2025-07-26 05:39:47', 1, '2025-07-26 05:39:42'),
(26, '0868713558', '805428', '2025-07-26 05:40:05', 1, '2025-07-26 05:40:01'),
(27, '0385868251', '766588', '2025-07-26 05:42:44', 1, '2025-07-26 05:42:39'),
(28, '0385868251', '272453', '2025-07-26 05:44:10', 1, '2025-07-26 05:44:05'),
(29, '0987654321', '979940', '2025-07-26 05:44:31', 1, '2025-07-26 05:44:27'),
(30, '0385868251', '836296', '2025-07-26 05:48:42', 1, '2025-07-26 05:48:36'),
(31, '0385868251', '395620', '2025-07-26 05:55:21', 1, '2025-07-26 05:55:17'),
(32, '0123456789', '837955', '2025-07-26 10:11:38', 1, '2025-07-26 10:11:30'),
(33, '0123456789', '648668', '2025-07-26 10:13:10', 1, '2025-07-26 10:13:05'),
(34, '0987654321', '114603', '2025-07-26 10:14:49', 1, '2025-07-26 10:14:42'),
(35, '012345', '561887', '2025-07-26 10:20:39', 1, '2025-07-26 10:20:33'),
(36, '123', '938722', '2025-07-26 10:37:00', 1, '2025-07-26 10:36:54'),
(37, '0979993920', '564623', '2025-07-26 15:30:54', 1, '2025-07-26 15:28:01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `pricing_rules`
--

CREATE TABLE `pricing_rules` (
  `id` int(11) NOT NULL,
  `field_type` enum('5vs5','7vs7','11vs11') NOT NULL,
  `start_hour` tinyint(4) NOT NULL,
  `end_hour` tinyint(4) NOT NULL,
  `price_per_hour` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `pricing_rules`
--

INSERT INTO `pricing_rules` (`id`, `field_type`, `start_hour`, `end_hour`, `price_per_hour`) VALUES
(1, '5vs5', 6, 18, 200000.00),
(2, '7vs7', 6, 18, 300000.00),
(3, '11vs11', 6, 18, 400000.00),
(4, '5vs5', 18, 22, 250000.00),
(5, '7vs7', 18, 22, 350000.00),
(6, '11vs11', 18, 22, 500000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` enum('drink','food','equipment') NOT NULL,
  `stock` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `services`
--

INSERT INTO `services` (`id`, `name`, `price`, `category`, `stock`, `image`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Nước suối', 10000.00, 'drink', 100, NULL, 1, '2025-05-29 09:19:20', '2025-05-29 09:19:20'),
(2, 'Coca Cola', 15000.00, 'drink', 50, NULL, 1, '2025-05-29 09:19:20', '2025-05-29 09:19:20'),
(3, 'Sting', 15000.00, 'drink', 50, NULL, 1, '2025-05-29 09:19:20', '2025-05-29 09:19:20'),
(4, 'Bánh mì', 25000.00, 'food', 20, NULL, 1, '2025-05-29 09:19:20', '2025-05-29 09:19:20'),
(5, 'Áo đấu', 50000.00, 'equipment', 10, NULL, 1, '2025-05-29 09:19:20', '2025-05-29 09:19:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `is_active` tinyint(1) DEFAULT 1,
  `total_bookings` int(11) DEFAULT 0,
  `cancelled_bookings` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `phone_number`, `name`, `email`, `role`, `is_active`, `total_bookings`, `cancelled_bookings`, `created_at`, `updated_at`) VALUES
(1, '0868713558', 'Admin', 'adminthanhtam@bookstore.com.vn', 'admin', 1, 0, 0, '2025-05-29 09:19:20', '2025-07-25 15:12:33'),
(4, '0979993920', 'Thành', 'thanh@gmail.com', 'customer', 1, 0, 0, '2025-07-25 08:12:30', '2025-07-25 15:01:17'),
(11, '012345', 'Người dùng mới', NULL, 'customer', 1, 0, 0, '2025-07-26 10:20:39', '2025-07-26 10:20:39'),
(12, '123', 'Abc123', NULL, 'customer', 1, 0, 0, '2025-07-26 10:37:00', '2025-07-26 10:37:13');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_booking` (`field_id`,`booking_date`,`time_slot_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `time_slot_id` (`time_slot_id`),
  ADD KEY `idx_bookings_date` (`booking_date`),
  ADD KEY `idx_bookings_status` (`status`);

--
-- Chỉ mục cho bảng `booking_services`
--
ALTER TABLE `booking_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Chỉ mục cho bảng `fields`
--
ALTER TABLE `fields`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `maintenance_schedules`
--
ALTER TABLE `maintenance_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_id` (`field_id`);

--
-- Chỉ mục cho bảng `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator_id` (`creator_id`),
  ADD KEY `field_id` (`field_id`),
  ADD KEY `idx_matches_date` (`match_date`),
  ADD KEY `idx_matches_status` (`status`);

--
-- Chỉ mục cho bảng `match_participants`
--
ALTER TABLE `match_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_participant` (`match_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_otp_phone` (`phone_number`);

--
-- Chỉ mục cho bảng `pricing_rules`
--
ALTER TABLE `pricing_rules`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD KEY `idx_users_phone` (`phone_number`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `booking_services`
--
ALTER TABLE `booking_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `fields`
--
ALTER TABLE `fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `maintenance_schedules`
--
ALTER TABLE `maintenance_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `matches`
--
ALTER TABLE `matches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `match_participants`
--
ALTER TABLE `match_participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT cho bảng `pricing_rules`
--
ALTER TABLE `pricing_rules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `booking_services`
--
ALTER TABLE `booking_services`
  ADD CONSTRAINT `booking_services_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `maintenance_schedules`
--
ALTER TABLE `maintenance_schedules`
  ADD CONSTRAINT `maintenance_schedules_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `match_participants`
--
ALTER TABLE `match_participants`
  ADD CONSTRAINT `match_participants_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `match_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
