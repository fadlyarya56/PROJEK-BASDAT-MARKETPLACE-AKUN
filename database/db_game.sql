-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for db_game
CREATE DATABASE IF NOT EXISTS `db_game` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `db_game`;

-- Dumping structure for table db_game.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `account_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `game_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `account_email` varchar(255) NOT NULL,
  `email_password` varchar(255) NOT NULL,
  `game_password` varchar(255) NOT NULL,
  `status` enum('tersedia','tertunda','terjual') NOT NULL DEFAULT 'tersedia',
  `sold_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  KEY `accounts_game_id_foreign` (`game_id`),
  CONSTRAINT `accounts_game_id_foreign` FOREIGN KEY (`game_id`) REFERENCES `games` (`game_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.accounts: ~40 rows (approximately)
INSERT INTO `accounts` (`account_id`, `game_id`, `title`, `price`, `image_url`, `description`, `account_email`, `email_password`, `game_password`, `status`, `sold_at`, `created_at`, `updated_at`) VALUES
	(11, 1, '', 150000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser01@example.com', 'DummyEmail01!', 'MLdummy01!', 'tersedia', NULL, NULL, NULL),
	(12, 1, '', 200000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser02@example.com', 'DummyEmail02!', 'MLdummy02!', 'terjual', NULL, NULL, NULL),
	(13, 1, '', 250000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser03@example.com', 'DummyEmail03!', 'MLdummy03!', 'tersedia', NULL, NULL, NULL),
	(14, 1, '', 300000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser04@example.com', 'DummyEmail04!', 'MLdummy04!', 'terjual', NULL, NULL, NULL),
	(15, 1, '', 350000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser05@example.com', 'DummyEmail05!', 'MLdummy05!', 'tersedia', NULL, NULL, NULL),
	(16, 2, '', 175000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser01@example.com', 'DummyEmail06!', 'EFBdummy01!', 'tersedia', NULL, NULL, NULL),
	(17, 2, '', 225000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser02@example.com', 'DummyEmail07!', 'EFBdummy02!', 'terjual', NULL, NULL, NULL),
	(18, 2, '', 275000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser03@example.com', 'DummyEmail08!', 'EFBdummy03!', 'tersedia', NULL, NULL, NULL),
	(19, 2, '', 325000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser04@example.com', 'DummyEmail09!', 'EFBdummy04!', 'terjual', NULL, NULL, NULL),
	(20, 2, '', 400000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser05@example.com', 'DummyEmail10!', 'EFBdummy05!', 'tersedia', NULL, NULL, NULL),
	(21, 1, '', 150000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser01@example.com', 'DummyEmail01!', 'MLdummy01!', 'tersedia', NULL, NULL, NULL),
	(22, 1, '', 200000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser02@example.com', 'DummyEmail02!', 'MLdummy02!', 'terjual', NULL, NULL, NULL),
	(23, 1, '', 250000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser03@example.com', 'DummyEmail03!', 'MLdummy03!', 'tersedia', NULL, NULL, NULL),
	(24, 1, '', 300000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser04@example.com', 'DummyEmail04!', 'MLdummy04!', 'terjual', NULL, NULL, NULL),
	(25, 1, '', 350000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser05@example.com', 'DummyEmail05!', 'MLdummy05!', 'tersedia', NULL, NULL, NULL),
	(26, 2, '', 175000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser01@example.com', 'DummyEmail06!', 'EFBdummy01!', 'tersedia', NULL, NULL, NULL),
	(27, 2, '', 225000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser02@example.com', 'DummyEmail07!', 'EFBdummy02!', 'terjual', NULL, NULL, NULL),
	(28, 2, '', 275000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser03@example.com', 'DummyEmail08!', 'EFBdummy03!', 'tersedia', NULL, NULL, NULL),
	(29, 2, '', 325000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser04@example.com', 'DummyEmail09!', 'EFBdummy04!', 'terjual', NULL, NULL, NULL),
	(30, 2, '', 400000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser05@example.com', 'DummyEmail10!', 'EFBdummy05!', 'tersedia', NULL, NULL, NULL),
	(31, 1, '', 150000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser01@example.com', 'DummyEmail01!', 'MLdummy01!', 'tersedia', NULL, NULL, NULL),
	(32, 1, '', 200000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser02@example.com', 'DummyEmail02!', 'MLdummy02!', 'terjual', NULL, NULL, NULL),
	(33, 1, '', 250000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser03@example.com', 'DummyEmail03!', 'MLdummy03!', 'tersedia', NULL, NULL, NULL),
	(34, 1, '', 300000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser04@example.com', 'DummyEmail04!', 'MLdummy04!', 'terjual', NULL, NULL, NULL),
	(35, 1, '', 350000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser05@example.com', 'DummyEmail05!', 'MLdummy05!', 'tersedia', NULL, NULL, NULL),
	(36, 2, '', 175000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser01@example.com', 'DummyEmail06!', 'EFBdummy01!', 'tersedia', NULL, NULL, NULL),
	(37, 2, '', 225000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser02@example.com', 'DummyEmail07!', 'EFBdummy02!', 'terjual', NULL, NULL, NULL),
	(38, 2, '', 275000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser03@example.com', 'DummyEmail08!', 'EFBdummy03!', 'tersedia', NULL, NULL, NULL),
	(39, 2, '', 325000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser04@example.com', 'DummyEmail09!', 'EFBdummy04!', 'terjual', NULL, NULL, NULL),
	(40, 2, '', 400000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser05@example.com', 'DummyEmail10!', 'EFBdummy05!', 'tersedia', NULL, NULL, NULL),
	(41, 1, '', 150000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser01@example.com', 'DummyEmail01!', 'MLdummy01!', 'tersedia', NULL, NULL, NULL),
	(42, 1, '', 200000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser02@example.com', 'DummyEmail02!', 'MLdummy02!', 'terjual', NULL, NULL, NULL),
	(43, 1, '', 250000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser03@example.com', 'DummyEmail03!', 'MLdummy03!', 'tersedia', NULL, NULL, NULL),
	(44, 1, '', 300000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser04@example.com', 'DummyEmail04!', 'MLdummy04!', 'terjual', NULL, NULL, NULL),
	(45, 1, '', 350000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'mluser05@example.com', 'DummyEmail05!', 'MLdummy05!', 'tersedia', NULL, NULL, NULL),
	(46, 2, '', 175000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser01@example.com', 'DummyEmail06!', 'EFBdummy01!', 'tersedia', NULL, NULL, NULL),
	(47, 2, '', 225000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser02@example.com', 'DummyEmail07!', 'EFBdummy02!', 'terjual', NULL, NULL, NULL),
	(48, 2, '', 275000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser03@example.com', 'DummyEmail08!', 'EFBdummy03!', 'tersedia', NULL, NULL, NULL),
	(49, 2, '', 325000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser04@example.com', 'DummyEmail09!', 'EFBdummy04!', 'terjual', NULL, NULL, NULL),
	(50, 2, '', 400000.00, NULL, 'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.', 'efbuser05@example.com', 'DummyEmail10!', 'EFBdummy05!', 'tersedia', NULL, NULL, NULL);

-- Dumping structure for table db_game.admins
CREATE TABLE IF NOT EXISTS `admins` (
  `admin_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admins_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.admins: ~0 rows (approximately)

-- Dumping structure for table db_game.buyers
CREATE TABLE IF NOT EXISTS `buyers` (
  `buyer_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`buyer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.buyers: ~0 rows (approximately)

-- Dumping structure for table db_game.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.cache: ~0 rows (approximately)

-- Dumping structure for table db_game.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.cache_locks: ~0 rows (approximately)

-- Dumping structure for table db_game.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.failed_jobs: ~0 rows (approximately)

-- Dumping structure for table db_game.games
CREATE TABLE IF NOT EXISTS `games` (
  `game_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `webmail_url` varchar(255) DEFAULT NULL,
  `guide_url` varchar(255) DEFAULT NULL,
  `email_template` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.games: ~0 rows (approximately)
INSERT INTO `games` (`game_id`, `name`, `webmail_url`, `guide_url`, `email_template`, `created_at`, `updated_at`) VALUES
	(1, 'Mobile Legends', NULL, NULL, NULL, NULL, NULL),
	(2, 'eFootball', NULL, NULL, NULL, NULL, NULL);

-- Dumping structure for table db_game.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.jobs: ~0 rows (approximately)

-- Dumping structure for table db_game.job_batches
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.job_batches: ~0 rows (approximately)

-- Dumping structure for table db_game.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.migrations: ~10 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2026_09_24_174041_create_games_table', 1),
	(5, '2026_09_24_174046_create_buyers_table', 1),
	(6, '2026_09_24_174112_create_admin_table', 1),
	(7, '2026_09_24_174141_create_accounts_table', 1),
	(8, '2026_09_24_174206_create_orders_table', 1),
	(9, '2026_09_24_174237_create_payments_table', 1),
	(10, '2026_09_24_174257_create_status_logs_table', 1);

-- Dumping structure for table db_game.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `buyer_id` bigint(20) unsigned NOT NULL,
  `account_id` bigint(20) unsigned NOT NULL,
  `delivery_email` varchar(255) NOT NULL,
  `status` enum('menunggu','menunggu_konfirmasi','valid','ditolak') NOT NULL DEFAULT 'menunggu',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `orders_buyer_id_foreign` (`buyer_id`),
  KEY `orders_account_id_foreign` (`account_id`),
  CONSTRAINT `orders_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  CONSTRAINT `orders_buyer_id_foreign` FOREIGN KEY (`buyer_id`) REFERENCES `buyers` (`buyer_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.orders: ~0 rows (approximately)

-- Dumping structure for table db_game.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table db_game.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `method` varchar(255) NOT NULL,
  `proof_image` varchar(255) DEFAULT NULL,
  `status` enum('menunggu','dikonfirmasi','ditolak') NOT NULL DEFAULT 'menunggu',
  `confirmed_by` bigint(20) unsigned DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `payments_order_id_foreign` (`order_id`),
  KEY `payments_confirmed_by_foreign` (`confirmed_by`),
  CONSTRAINT `payments_confirmed_by_foreign` FOREIGN KEY (`confirmed_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL,
  CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.payments: ~0 rows (approximately)

-- Dumping structure for table db_game.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.sessions: ~0 rows (approximately)

-- Dumping structure for table db_game.status_logs
CREATE TABLE IF NOT EXISTS `status_logs` (
  `log_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` bigint(20) unsigned NOT NULL,
  `old_status` varchar(255) NOT NULL,
  `new_status` varchar(255) NOT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`log_id`),
  KEY `status_logs_account_id_foreign` (`account_id`),
  CONSTRAINT `status_logs_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.status_logs: ~0 rows (approximately)

-- Dumping structure for table db_game.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_game.users: ~0 rows (approximately)

-- Dumping structure for trigger db_game.after_account_status_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER after_account_status_update
            AFTER UPDATE ON accounts
            FOR EACH ROW
            BEGIN
                IF OLD.status <> NEW.status THEN
                    INSERT INTO status_logs (account_id, old_status, new_status, changed_at)
                    VALUES (OLD.account_id, OLD.status, NEW.status, NOW());
                END IF;
            END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
