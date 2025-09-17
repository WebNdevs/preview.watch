-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 02, 2025 at 06:41 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `preview_watch`
--

-- --------------------------------------------------------

--
-- Table structure for table `analytics`
--

CREATE TABLE `analytics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `video_id` bigint(20) UNSIGNED DEFAULT NULL,
  `campaign_id` bigint(20) UNSIGNED DEFAULT NULL,
  `event_type` enum('video_play','video_view','video_complete','cta_click','page_view') NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `device_type` varchar(255) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `referrer` varchar(255) DEFAULT NULL,
  `additional_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_data`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

CREATE TABLE `campaigns` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cta_text` varchar(255) DEFAULT NULL,
  `cta_url` varchar(255) DEFAULT NULL,
  `thumbnail_path` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `campaigns`
--

INSERT INTO `campaigns` (`id`, `user_id`, `name`, `slug`, `description`, `cta_text`, `cta_url`, `thumbnail_path`, `is_active`, `settings`, `created_at`, `updated_at`) VALUES
(1, 4, 'Summer Sale 2024', 'summer-sale-2024', 'Our biggest summer sale campaign with amazing discounts', 'Shop Now', 'https://example.com/shop', 'campaigns/test-user/thumb/i4jsRpL1hfy7vk2aiuWfYuh6PdEv3GcFZQy3p0BR.jpg', 1, '{\"autoplay\":\"1\",\"loop\":\"1\",\"controls\":\"0\",\"muted\":\"1\"}', '2025-08-31 18:12:00', '2025-09-01 15:08:36'),
(4, 7, 'Eco-Friendly Initiative', 'eco-friendly-initiative', 'Showcasing our commitment to environmental sustainability', 'Go Green', 'https://example.com/eco', 'campaigns/system-administrator/thumb/OdGCvUBD1i4AB61GqOSpTmTnvR71lDmqxnGPz6Bb.jpg', 1, '{\"autoplay\":\"1\",\"loop\":\"0\",\"controls\":\"1\",\"muted\":\"1\"}', '2025-08-31 18:12:00', '2025-09-01 16:23:48'),
(6, 1, 'General', 'general', 'Information', 'Action Text', 'https://localhost:3000', 'campaigns/system-administrator/thumb/zYyRrsqEHOELGDG4CMiskNwWqTUtOcUKshmpgemo.png', 1, '{\"autoplay\":\"1\",\"loop\":\"0\",\"controls\":\"0\",\"muted\":\"0\"}', '2025-09-01 19:02:35', '2025-09-01 19:02:35');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(8, '0001_01_01_000000_create_users_table', 1),
(9, '0001_01_01_000001_create_cache_table', 1),
(10, '0001_01_01_000002_create_jobs_table', 1),
(11, '2025_08_31_113403_create_campaigns_table', 1),
(12, '2025_08_31_113420_create_videos_table', 1),
(13, '2025_08_31_113438_create_analytics_table', 1),
(14, '2025_08_31_205344_create_personal_access_tokens_table', 1),
(15, '2023_09_15_000000_add_settings_to_campaigns_table', 2),
(16, '2023_09_16_000000_update_analytics_event_types', 3),
(17, '2025_09_02_update_videos_slug_unique_constraint', 4);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 9, 'auth_token', '38c28ce03cdc7c1075717441b5d5d5b8303573f738d52ccfa48b69eeb8139218', '[\"*\"]', '2025-08-31 19:05:23', NULL, '2025-08-31 18:12:48', '2025-08-31 19:05:23'),
(2, 'App\\Models\\User', 1, 'test', '29de66f75b0245c7d07980996dbda83c9c6e9502c65126ba8f467b6a742133b7', '[\"*\"]', NULL, NULL, '2025-08-31 18:53:39', '2025-08-31 18:53:39'),
(3, 'App\\Models\\User', 9, 'auth_token', '53d55e9bb668f0b23170aaec853ecceda6196ea9947c72d87158091587e18bc3', '[\"*\"]', '2025-08-31 19:05:31', NULL, '2025-08-31 19:05:30', '2025-08-31 19:05:31'),
(4, 'App\\Models\\User', 1, 'auth_token', '51cfc58a575696dfe7908d2b3afb7ef5d6a277d65dabe5752d558e8f468423c5', '[\"*\"]', '2025-09-01 10:23:45', NULL, '2025-08-31 19:09:10', '2025-09-01 10:23:45'),
(5, 'App\\Models\\User', 1, 'auth_token', '93cd3507f42f25199090397ee554165930b1dfab2b2a91f57b8e728241870ecc', '[\"*\"]', NULL, NULL, '2025-08-31 21:39:48', '2025-08-31 21:39:48'),
(6, 'App\\Models\\User', 1, 'auth_token', 'df092015af867a30368432f6b565cfa00cb8b2e0e675c82a44e14c4df9a26ee1', '[\"*\"]', '2025-09-01 15:05:47', NULL, '2025-09-01 10:23:57', '2025-09-01 15:05:47'),
(7, 'App\\Models\\User', 1, 'auth_token', '4528b01d81e2957dbf769f2b54104772dddba526cb955da5326e8aab2b19f31d', '[\"*\"]', '2025-09-01 20:05:59', NULL, '2025-09-01 15:07:58', '2025-09-01 20:05:59'),
(8, 'App\\Models\\User', 1, 'auth_token', 'ac8f631a13ab60bf41ffbe76fa323e76200a6b5b07b40a7f6117a400f811a469', '[\"*\"]', '2025-09-01 18:52:18', NULL, '2025-09-01 15:08:03', '2025-09-01 18:52:18'),
(9, 'App\\Models\\User', 1, 'auth_token', '98d2a727d58adaff45caece92e7af7b61bcd737b4933d0c262fb4836ed862c65', '[\"*\"]', '2025-09-01 17:23:35', NULL, '2025-09-01 17:15:37', '2025-09-01 17:23:35'),
(10, 'App\\Models\\User', 1, 'auth_token', '5bac50b1734bb292dcccebce71feb2aa5119291ecdd046646155f9613a8192c0', '[\"*\"]', '2025-09-01 17:44:14', NULL, '2025-09-01 17:24:11', '2025-09-01 17:44:14'),
(11, 'App\\Models\\User', 1, 'auth_token', '9e7b4e23c00c9bd904dba3d440ef22c0cee579624c6456024fdcf09f993329cd', '[\"*\"]', '2025-09-01 17:29:45', NULL, '2025-09-01 17:25:11', '2025-09-01 17:29:45'),
(12, 'App\\Models\\User', 1, 'auth_token', '03186b90e45f2d1d4351ddbbc997fcfe1e7ba94979674c861021180c1f9944f1', '[\"*\"]', '2025-09-01 19:45:29', NULL, '2025-09-01 17:27:25', '2025-09-01 19:45:29'),
(13, 'App\\Models\\User', 1, 'auth_token', '0c9c7cff5120813fb6d0a9ec79157377c9cbdf5d477ef7c87c64832bac5e7697', '[\"*\"]', '2025-09-01 20:52:45', NULL, '2025-09-01 18:52:36', '2025-09-01 20:52:45');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','agency','brand') NOT NULL DEFAULT 'brand',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `email_verified_at`, `password`, `role`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'System Administrator', 'admin', 'admin@example.com', '2025-08-31 18:12:00', '$2y$12$8sM88oZRSZlmz1FZtActv.yDE/dz/ceXP4MiSiPGCJl0.9vK2U2ZW', 'admin', 1, 'xZYssVlcKR', '2025-08-31 18:12:00', '2025-08-31 18:12:00'),
(2, 'Creative Agency Pro', 'agency1', 'agency1@example.com', '2025-08-31 18:12:00', '$2y$12$8sM88oZRSZlmz1FZtActv.yDE/dz/ceXP4MiSiPGCJl0.9vK2U2ZW', 'agency', 1, 'RBkIl8SH3P', '2025-08-31 18:12:00', '2025-08-31 18:12:00'),
(3, 'Digital Marketing Hub', 'agency2', 'agency2@example.com', '2025-08-31 18:12:00', '$2y$12$8sM88oZRSZlmz1FZtActv.yDE/dz/ceXP4MiSiPGCJl0.9vK2U2ZW', 'agency', 1, '9h2R4YRIFk', '2025-08-31 18:12:00', '2025-08-31 18:12:00'),
(4, 'TechCorp Solutions', 'techcorp', 'brand1@example.com', '2025-08-31 18:12:00', '$2y$12$8sM88oZRSZlmz1FZtActv.yDE/dz/ceXP4MiSiPGCJl0.9vK2U2ZW', 'brand', 1, 'n4o4ppggOQ', '2025-08-31 18:12:00', '2025-08-31 18:12:00'),
(5, 'Fashion Forward Inc', 'fashionforward', 'brand2@example.com', '2025-08-31 18:12:00', '$2y$12$8sM88oZRSZlmz1FZtActv.yDE/dz/ceXP4MiSiPGCJl0.9vK2U2ZW', 'brand', 1, 'FxdY9VBs16', '2025-08-31 18:12:00', '2025-08-31 18:12:00'),
(6, 'Healthy Living Co', 'healthyliving', 'brand3@example.com', '2025-08-31 18:12:00', '$2y$12$8sM88oZRSZlmz1FZtActv.yDE/dz/ceXP4MiSiPGCJl0.9vK2U2ZW', 'brand', 1, 'HoxjSD2jvm', '2025-08-31 18:12:00', '2025-08-31 18:12:00'),
(7, 'Eco Green Products', 'ecogreen', 'brand4@example.com', '2025-08-31 18:12:00', '$2y$12$8sM88oZRSZlmz1FZtActv.yDE/dz/ceXP4MiSiPGCJl0.9vK2U2ZW', 'brand', 1, 'Dwk9HILe87', '2025-08-31 18:12:00', '2025-08-31 18:12:00'),
(8, 'Urban Lifestyle Brand', 'urbanlifestyle', 'brand5@example.com', '2025-08-31 18:12:00', '$2y$12$8sM88oZRSZlmz1FZtActv.yDE/dz/ceXP4MiSiPGCJl0.9vK2U2ZW', 'brand', 1, '72qOJML9hI', '2025-08-31 18:12:00', '2025-08-31 18:12:00'),
(9, 'Test User', 'testuser', 'test@example.com', '2025-08-31 18:12:00', '$2y$12$8sM88oZRSZlmz1FZtActv.yDE/dz/ceXP4MiSiPGCJl0.9vK2U2ZW', 'admin', 1, 'QTVKSHNOe7', '2025-08-31 18:12:00', '2025-08-31 18:12:00');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `campaign_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `thumbnail_path` varchar(255) DEFAULT NULL,
  `cta_text` varchar(255) DEFAULT NULL,
  `cta_url` varchar(255) DEFAULT NULL,
  `weight` int(11) NOT NULL DEFAULT 1,
  `mime_type` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `views` bigint(20) NOT NULL DEFAULT 0,
  `status` enum('active','inactive','draft') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `campaign_id`, `title`, `description`, `slug`, `file_path`, `thumbnail_path`, `cta_text`, `cta_url`, `weight`, `mime_type`, `file_size`, `duration`, `views`, `status`, `created_at`, `updated_at`) VALUES
(5, 4, 'Sustainable Living', 'Learn how to live more sustainably', 'sustainable-living', 'videos/system-administrator/videos/sustainable-living-4-5.mp4', 'videos/system-administrator/thumb/sustainable-living-4-5.jpg', 'Go Green', 'https://example.com/eco', 1, 'video/mp4', 3673169, NULL, 920, 'active', '2025-08-31 18:12:00', '2025-08-31 19:20:43'),
(7, 1, 'Video 3', 'Description 3', 'video-3', 'videos/system-administrator/videos/video-1-7.mp4', 'videos/test-user/thumb/video-1-7.png', 'Action', 'http://localhost:3000', 50, 'video/mp4', 3673169, NULL, 0, 'draft', '2025-08-31 18:14:16', '2025-09-01 18:33:53'),
(12, 1, 'Video 1', 'Description 1', 'video-1-1', 'videos/system-administrator/videos/video-1-1-12.mp4', 'videos/system-administrator/thumb/video-1-1-12.png', NULL, NULL, 50, 'video/mp4', 52160078, NULL, 0, 'draft', '2025-09-01 16:40:01', '2025-09-01 16:40:07'),
(13, 1, 'Video 2', 'Description2', 'video-2', 'videos/system-administrator/videos/video-2-1-13.mp4', 'videos/system-administrator/thumb/video-2-1-13.png', NULL, NULL, 50, 'video/mp4', 52160078, NULL, 0, 'draft', '2025-09-01 17:00:16', '2025-09-01 17:00:17'),
(15, 6, 'Video 1', 'Description 1', 'video-1-6', 'videos/system-administrator/videos/video-1-6-15.mp4', 'videos/system-administrator/thumb/video-1-6-15.png', NULL, NULL, 50, 'video/mp4', 3673169, NULL, 0, 'draft', '2025-09-01 19:08:11', '2025-09-01 19:08:11'),
(16, 6, 'Video 2', 'Description 2', 'video-2-6', 'videos/system-administrator/videos/video-2-6-16.mp4', 'videos/system-administrator/thumb/video-2-6-16.png', NULL, NULL, 50, 'video/mp4', 1614234, NULL, 0, 'draft', '2025-09-01 19:08:59', '2025-09-01 19:08:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `analytics`
--
ALTER TABLE `analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `analytics_video_id_event_type_index` (`video_id`,`event_type`),
  ADD KEY `analytics_campaign_id_event_type_index` (`campaign_id`,`event_type`),
  ADD KEY `analytics_created_at_index` (`created_at`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `campaigns_slug_unique` (`slug`),
  ADD KEY `campaigns_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `videos_slug_campaign_id_unique` (`slug`,`campaign_id`),
  ADD KEY `videos_campaign_id_foreign` (`campaign_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `analytics`
--
ALTER TABLE `analytics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `campaigns`
--
ALTER TABLE `campaigns`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `analytics`
--
ALTER TABLE `analytics`
  ADD CONSTRAINT `analytics_campaign_id_foreign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `analytics_video_id_foreign` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD CONSTRAINT `campaigns_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_campaign_id_foreign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
