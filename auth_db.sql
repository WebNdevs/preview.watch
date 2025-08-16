-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 16, 2025 at 07:18 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auth_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_14_092227_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'test_token', '4348cf05849f87f4d9a5a3b73ceb811cba0124cc7d38dfb113b6469dd7f951f9', '[\"*\"]', NULL, NULL, '2025-08-14 23:07:20', '2025-08-14 23:07:20'),
(2, 'App\\Models\\User', 1, 'auth_token', '35541a1d6197b44f3d482dce7bd744232deef6887a1cdcbfdc35a5a556c4595a', '[\"*\"]', NULL, NULL, '2025-08-14 23:07:21', '2025-08-14 23:07:21'),
(3, 'App\\Models\\User', 1, 'auth_token', 'f9535b0acb01be1b6d0e7218792d2e28a7266eaefb5377f48dec07be2101b0ea', '[\"*\"]', NULL, NULL, '2025-08-14 23:09:57', '2025-08-14 23:09:57'),
(4, 'App\\Models\\User', 1, 'auth_token', '22fe5a49cdae030e988a967fcf39f61b8be5c8641f056660bb328025983bdd0e', '[\"*\"]', NULL, NULL, '2025-08-14 23:13:18', '2025-08-14 23:13:18'),
(7, 'App\\Models\\User', 3, 'auth_token', '49bf78ea8a7511acc42a6c482fb659f8ad3ce59162d5ad2ec571bae7a03bec73', '[\"*\"]', '2025-08-14 23:26:34', NULL, '2025-08-14 23:23:45', '2025-08-14 23:26:34'),
(9, 'App\\Models\\User', 1, 'auth_token_remember', 'ea8431eba2058fc02c2b8e9ac944a04592d6acaffe90f1c6aaa0fac7f982624a', '[\"*\"]', NULL, NULL, '2025-08-14 23:36:29', '2025-08-14 23:36:29'),
(10, 'App\\Models\\User', 1, 'auth_token_remember', '31d9430c31c5973499ac22387a830dde66b46dfab13ccf9e7b6d82853b7d8690', '[\"*\"]', NULL, NULL, '2025-08-14 23:37:56', '2025-08-14 23:37:56'),
(11, 'App\\Models\\User', 1, 'auth_token', 'f75e21ba28c8036cbdd8e65be438a3f9bc2f9550ef15267bf0839cd3aa129ff4', '[\"*\"]', NULL, NULL, '2025-08-14 23:37:56', '2025-08-14 23:37:56'),
(12, 'App\\Models\\User', 1, 'auth_token_remember', '21fe0bffc4a4572cadac6b028209f411537aaa10001b170fae62ca59414e1ded', '[\"*\"]', NULL, NULL, '2025-08-14 23:39:34', '2025-08-14 23:39:34'),
(13, 'App\\Models\\User', 1, 'test_token', '640c826a89b3d93038693523de0c83e6dc6d233dc6231948877f09d0a65e14a9', '[\"*\"]', NULL, NULL, '2025-08-14 23:42:20', '2025-08-14 23:42:20'),
(14, 'App\\Models\\User', 1, 'test_token', '3856254c9aba7e23f92fba800135a7f91522b923f475462274fa7a0379311614', '[\"*\"]', NULL, NULL, '2025-08-14 23:43:18', '2025-08-14 23:43:18'),
(15, 'App\\Models\\User', 1, 'test_token', '266157cb516f4e404b2fa506090daa978dae8fadb46e718fb59ba2d1a6cbf14d', '[\"*\"]', NULL, NULL, '2025-08-14 23:45:31', '2025-08-14 23:45:31'),
(16, 'App\\Models\\User', 1, 'auth_token_remember', 'a23e1c538811c440cb1284d99539a37231ff55e26f674b2f74fbc855c8c547d8', '[\"*\"]', NULL, NULL, '2025-08-14 23:58:17', '2025-08-14 23:58:17'),
(18, 'App\\Models\\User', 1, 'test_user_token', 'afe11244e929a1b6804ff6bd742d521dbdbe1f6f3d93fa02017a997b5feee8a8', '[\"*\"]', NULL, NULL, '2025-08-15 00:02:11', '2025-08-15 00:02:11'),
(19, 'App\\Models\\User', 1, 'test_user_token', '7701178b3465cef25621f1b4a6ff5f84e8c8866a499cf67db63a496871de412d', '[\"*\"]', NULL, NULL, '2025-08-15 00:02:20', '2025-08-15 00:02:20'),
(20, 'App\\Models\\User', 1, 'auth_token_remember', '9bce9732ee54d67fc45df45213f4e8e785b2a61bc1e80520fa408d53e8d19f10', '[\"*\"]', NULL, NULL, '2025-08-15 07:03:35', '2025-08-15 07:03:35'),
(21, 'App\\Models\\User', 1, 'auth_token', 'f34fbc40af9d1df9ef477c1d19d39e560eacfa0e3dc3058ed92f418e2446c5a8', '[\"*\"]', NULL, NULL, '2025-08-15 07:04:06', '2025-08-15 07:04:06'),
(22, 'App\\Models\\User', 1, 'auth_token_remember', '50deaa965de600cb87ca4ecb3f57d89703ae7969bf2975a929b2b50bb63f76fd', '[\"*\"]', NULL, NULL, '2025-08-15 07:06:11', '2025-08-15 07:06:11'),
(23, 'App\\Models\\User', 1, 'auth_token_remember', '753947645d143b947988c82ef085d93f9e155044227d8394b19b317062aa5845', '[\"*\"]', '2025-08-16 00:20:17', NULL, '2025-08-15 23:51:27', '2025-08-16 00:20:17'),
(24, 'App\\Models\\User', 1, 'auth_token', '71d71ba8f8f9c0ab5db579c083fdfc8a614f6468736cd94b4e53ac727333aef3', '[\"*\"]', NULL, NULL, '2025-08-16 00:12:15', '2025-08-16 00:12:15'),
(25, 'App\\Models\\User', 1, 'auth_token', '7b24b9078b91e4ee1257658aefc352b48b2fe1f488810883cc6a3c78303ae15a', '[\"*\"]', NULL, NULL, '2025-08-16 00:12:24', '2025-08-16 00:12:24'),
(26, 'App\\Models\\User', 1, 'auth_token', 'cd5cdbde0009706d2387219d93ab148dd74190f2271072f79e46a3df295af844', '[\"*\"]', NULL, NULL, '2025-08-16 00:12:33', '2025-08-16 00:12:33'),
(27, 'App\\Models\\User', 1, 'auth_token', '4ea68bc86fe83e936bfd3eed0670b607a4304ef6705d51a95612d0c9d9ea7b50', '[\"*\"]', NULL, NULL, '2025-08-16 00:12:43', '2025-08-16 00:12:43'),
(28, 'App\\Models\\User', 1, 'auth_token', 'be3f35f246ff25691b5f25979987fd47a2886ae1b23df6f22c60ed45885c808d', '[\"*\"]', '2025-08-16 00:14:21', NULL, '2025-08-16 00:14:21', '2025-08-16 00:14:21'),
(29, 'App\\Models\\User', 2, 'auth_token', 'e8ded366bd8cabae6478cb090b8436107c9a7f18a38052a7a28560b4f394bdbf', '[\"*\"]', '2025-08-16 00:14:31', NULL, '2025-08-16 00:14:31', '2025-08-16 00:14:31'),
(30, 'App\\Models\\User', 3, 'auth_token', '28b2f49b039539dadb4f2b7d53d63472bd75a7af506fc373142d622223497e99', '[\"*\"]', '2025-08-16 00:14:41', NULL, '2025-08-16 00:14:41', '2025-08-16 00:14:41'),
(32, 'App\\Models\\User', 1, 'auth_token_remember', '5659595cfed4b89f9f6ebfcbeb391d9b71e9fafaebe4c4b09f0ad4daaef89958', '[\"*\"]', '2025-08-16 00:36:36', NULL, '2025-08-16 00:20:36', '2025-08-16 00:36:36'),
(33, 'App\\Models\\User', 1, 'auth_token_remember', '7f0b1a9c87caa3d6e4769967f62c593944685fb1b601a9629935427b89659d35', '[\"*\"]', '2025-08-16 00:51:52', NULL, '2025-08-16 00:36:43', '2025-08-16 00:51:52'),
(34, 'App\\Models\\User', 1, 'auth_token_remember', '2fd506a101dfd64678bc0b43db6024206e74d73795f5475289e6d33778e4edb7', '[\"*\"]', '2025-08-16 01:06:01', NULL, '2025-08-16 00:51:57', '2025-08-16 01:06:01'),
(35, 'App\\Models\\User', 1, 'auth_token_remember', '709ba534db65abf9a55ab68cebeb7d4dbdb1811c50d501e2bf198ec2b61616ff', '[\"*\"]', '2025-08-16 01:10:23', NULL, '2025-08-16 01:06:10', '2025-08-16 01:10:23'),
(36, 'App\\Models\\User', 1, 'auth_token_remember', '77e83fcac2043fc40afb2a3acd7d62974f09481fc741a76d7747eeec90ad82f6', '[\"*\"]', '2025-08-16 01:13:00', NULL, '2025-08-16 01:12:58', '2025-08-16 01:13:00'),
(37, 'App\\Models\\User', 1, 'auth_token', '6d44206632756f12701897572e15463f720cbc3615ca124466000a540ad23904', '[\"*\"]', '2025-08-16 01:22:53', NULL, '2025-08-16 01:13:12', '2025-08-16 01:22:53'),
(38, 'App\\Models\\User', 1, 'auth_token_remember', '681a0daaa6065fa42d1d62191357b832767499109a4ed4ed821c202a31802939', '[\"*\"]', '2025-08-16 04:35:43', NULL, '2025-08-16 01:23:02', '2025-08-16 04:35:43'),
(39, 'App\\Models\\User', 1, 'auth_token_remember', '5c44d07695458b9a0337822ce171cec232ae7d8c3791b6d37d83487dabf6e473', '[\"*\"]', '2025-08-16 05:03:12', NULL, '2025-08-16 04:35:50', '2025-08-16 05:03:12'),
(40, 'App\\Models\\User', 1, 'auth_token_remember', 'f5bf810bef82f0a2e62e6a96dfd8c312c23e2a06126fa58a16cebb644a998a56', '[\"*\"]', '2025-08-16 05:08:46', NULL, '2025-08-16 05:05:44', '2025-08-16 05:08:46'),
(41, 'App\\Models\\User', 1, 'auth_token_remember', '1465015c7fc5801effbe98e059bcb6ca0ee097fcce066ba5db14649fdbb7e9f6', '[\"*\"]', '2025-08-16 05:14:44', NULL, '2025-08-16 05:10:04', '2025-08-16 05:14:44'),
(42, 'App\\Models\\User', 1, 'auth_token_remember', 'a2e3bed3b90afba7da6b2af8ed306f94912c8bbde4edca8aac513f1d3b53bc74', '[\"*\"]', '2025-08-16 05:15:34', NULL, '2025-08-16 05:15:06', '2025-08-16 05:15:34'),
(43, 'App\\Models\\User', 1, 'auth_token_remember', '5393bdc7def56bf57f8aaf48f7eb546dac9349b0f291d58b77596de651a71847', '[\"*\"]', '2025-08-16 05:15:59', NULL, '2025-08-16 05:15:40', '2025-08-16 05:15:59'),
(44, 'App\\Models\\User', 1, 'auth_token_remember', '44c884ef5aca77aed0d136a1f05775d2d35d8d0370b2f0b36f6829f9bc275698', '[\"*\"]', '2025-08-16 05:17:26', NULL, '2025-08-16 05:16:04', '2025-08-16 05:17:26'),
(45, 'App\\Models\\User', 1, 'auth_token_remember', '6f9136b044992a1b0388f5992e1978a7f68bc16d5ad304d8d16bb0b56a933ab4', '[\"*\"]', '2025-08-16 05:27:03', NULL, '2025-08-16 05:17:51', '2025-08-16 05:27:03'),
(46, 'App\\Models\\User', 1, 'auth_token_remember', '0ca3b161bff6c1c4674d68f16c860ecf2980ee4868074ae0661fad633c91a449', '[\"*\"]', NULL, NULL, '2025-08-16 05:27:51', '2025-08-16 05:27:51'),
(47, 'App\\Models\\User', 1, 'auth_token_remember', 'fa338de6faa265621860a74225c9d3a1857ea12ad5257e86d443ba4e875eda54', '[\"*\"]', '2025-08-16 05:42:41', NULL, '2025-08-16 05:32:02', '2025-08-16 05:42:41'),
(48, 'App\\Models\\User', 1, 'auth_token_remember', '2d8377f4595453e3bd1b2b15b1d5432d0d09bcb50906ca4a826dcbb7400d3296', '[\"*\"]', NULL, NULL, '2025-08-16 05:41:37', '2025-08-16 05:41:37'),
(49, 'App\\Models\\User', 1, 'auth_token_remember', '3bfa8194c67a33e8f0ef7e50dd656a647ccc68f4ebaf8e7c386f8cfb9d1ea86e', '[\"*\"]', '2025-08-16 05:51:22', NULL, '2025-08-16 05:42:48', '2025-08-16 05:51:22'),
(50, 'App\\Models\\User', 1, 'auth_token_remember', '5926df3a6d7ed76b82f70d606dbf4e2075408e23ce67ed0c96ea18e314fc4166', '[\"*\"]', '2025-08-16 06:00:44', NULL, '2025-08-16 05:51:29', '2025-08-16 06:00:44'),
(51, 'App\\Models\\User', 1, 'auth_token_remember', 'f7d0e577198282c82c6365b5e182c3e1a5eeef43dd37c1191ffd3666cbe54e82', '[\"*\"]', NULL, NULL, '2025-08-16 05:55:28', '2025-08-16 05:55:28'),
(52, 'App\\Models\\User', 1, 'auth_token_remember', 'baecc6e4e016376b01cb451541ec620fb981641f4032f0dfb391254351174e05', '[\"*\"]', '2025-08-16 06:00:52', NULL, '2025-08-16 06:00:51', '2025-08-16 06:00:52'),
(53, 'App\\Models\\User', 1, 'auth_token_remember', '9ed98c179826c72311b3cf4bac171b5880a60913b5dabd92bef61ba58bc5080b', '[\"*\"]', NULL, NULL, '2025-08-16 06:03:38', '2025-08-16 06:03:38');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('CKZTezxISdK61w9zmHy4HHI0S2xQbuRAQmh1uhb2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicVJqVkFPZG9MMjBnSzREMnkyUWFhQkJqbUlNMTRob3JTdE9xS1ZXMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1755261118),
('IijEwRuIUfVxde53Al8G59tLF3ugxPZcDX8IBAOa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidXF2QzRUSjAwM0FlZzFnRFdGTjJXcDJTcml0VWZEendtM0FYa0F3OSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1755321273),
('W6mPYqzqicvng0QvLHt7vzVE8HpbWTovC0LceThU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUWROZXNXUHVKNlM3c0U4S0FuQjlrQnp5RDU1c3hmeFdXTUJlNGwwZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1755233093),
('wafv2Jp4ok9i22SfynWkMjBEfQ3sdBr6Pnk59SF9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYk5DaXdMYWE1TjV0VURsRHV6anhNVUFEd0hhT1hRV0c1OXREQk0weiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1755179116);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','agency','client') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'client',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@test.com', NULL, '$2y$12$mGFumPm9bBkbvMg6YkY2aeeNGF//QagyRCPeSirSXRDNyTnA5J9zi', 'admin', NULL, '2025-08-14 22:50:27', '2025-08-14 22:50:27'),
(2, 'Agency Manager', 'agency@test.com', NULL, '$2y$12$L7W9F0cxjkhCoieftbo14uj3dzt2WCRwEsgGizipJ.4PxZ3WKKE8m', 'agency', NULL, '2025-08-14 22:50:27', '2025-08-14 22:50:27'),
(3, 'Client User', 'client@test.com', NULL, '$2y$12$YgWDGNjZBnehs69m.B44nuhLVPEtPezctDBiRst7fzWyMo60qe0OK', 'client', NULL, '2025-08-14 22:50:28', '2025-08-14 22:50:28');

--
-- Indexes for dumped tables
--

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
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
