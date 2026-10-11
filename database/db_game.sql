-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: db_game
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `game_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `account_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `game_password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('tersedia','tertunda','terjual') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tersedia',
  `sold_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  KEY `accounts_game_id_foreign` (`game_id`),
  CONSTRAINT `accounts_game_id_foreign` FOREIGN KEY (`game_id`) REFERENCES `games` (`game_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (11,1,'',150000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser01@example.com','DummyEmail01!','MLdummy01!','terjual','2026-10-11 12:08:14',NULL,'2026-10-11 12:08:14'),(12,1,'',200000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser02@example.com','DummyEmail02!','MLdummy02!','terjual',NULL,NULL,NULL),(13,1,'',250000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser03@example.com','DummyEmail03!','MLdummy03!','terjual','2026-10-11 12:39:03',NULL,'2026-10-11 12:39:03'),(14,1,'',300000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser04@example.com','DummyEmail04!','MLdummy04!','terjual',NULL,NULL,NULL),(15,1,'',350000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser05@example.com','DummyEmail05!','MLdummy05!','tersedia',NULL,NULL,NULL),(16,2,'',175000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser01@example.com','DummyEmail06!','EFBdummy01!','tersedia',NULL,NULL,NULL),(17,2,'',225000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser02@example.com','DummyEmail07!','EFBdummy02!','terjual',NULL,NULL,NULL),(18,2,'',275000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser03@example.com','DummyEmail08!','EFBdummy03!','tersedia',NULL,NULL,NULL),(19,2,'',325000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser04@example.com','DummyEmail09!','EFBdummy04!','terjual',NULL,NULL,NULL),(20,2,'',400000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser05@example.com','DummyEmail10!','EFBdummy05!','tersedia',NULL,NULL,NULL),(21,1,'',150000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser01@example.com','DummyEmail01!','MLdummy01!','tersedia',NULL,NULL,NULL),(22,1,'',200000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser02@example.com','DummyEmail02!','MLdummy02!','terjual',NULL,NULL,NULL),(23,1,'',250000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser03@example.com','DummyEmail03!','MLdummy03!','tersedia',NULL,NULL,NULL),(24,1,'',300000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser04@example.com','DummyEmail04!','MLdummy04!','terjual',NULL,NULL,NULL),(25,1,'',350000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser05@example.com','DummyEmail05!','MLdummy05!','tersedia',NULL,NULL,NULL),(26,2,'',175000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser01@example.com','DummyEmail06!','EFBdummy01!','tersedia',NULL,NULL,NULL),(27,2,'',225000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser02@example.com','DummyEmail07!','EFBdummy02!','terjual',NULL,NULL,NULL),(28,2,'',275000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser03@example.com','DummyEmail08!','EFBdummy03!','tersedia',NULL,NULL,NULL),(29,2,'',325000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser04@example.com','DummyEmail09!','EFBdummy04!','terjual',NULL,NULL,NULL),(30,2,'',400000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser05@example.com','DummyEmail10!','EFBdummy05!','tersedia',NULL,NULL,NULL),(31,1,'',150000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser01@example.com','DummyEmail01!','MLdummy01!','tersedia',NULL,NULL,NULL),(32,1,'',200000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser02@example.com','DummyEmail02!','MLdummy02!','terjual',NULL,NULL,NULL),(33,1,'',250000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser03@example.com','DummyEmail03!','MLdummy03!','tersedia',NULL,NULL,NULL),(34,1,'',300000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser04@example.com','DummyEmail04!','MLdummy04!','terjual',NULL,NULL,NULL),(35,1,'',350000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser05@example.com','DummyEmail05!','MLdummy05!','tersedia',NULL,NULL,NULL),(36,2,'',175000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser01@example.com','DummyEmail06!','EFBdummy01!','tersedia',NULL,NULL,NULL),(37,2,'',225000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser02@example.com','DummyEmail07!','EFBdummy02!','terjual',NULL,NULL,NULL),(38,2,'',275000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser03@example.com','DummyEmail08!','EFBdummy03!','tersedia',NULL,NULL,NULL),(39,2,'',325000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser04@example.com','DummyEmail09!','EFBdummy04!','terjual',NULL,NULL,NULL),(40,2,'',400000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser05@example.com','DummyEmail10!','EFBdummy05!','tersedia',NULL,NULL,NULL),(41,1,'',150000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser01@example.com','DummyEmail01!','MLdummy01!','tersedia',NULL,NULL,NULL),(42,1,'',200000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser02@example.com','DummyEmail02!','MLdummy02!','terjual',NULL,NULL,NULL),(43,1,'',250000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser03@example.com','DummyEmail03!','MLdummy03!','tersedia',NULL,NULL,NULL),(44,1,'',300000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser04@example.com','DummyEmail04!','MLdummy04!','terjual',NULL,NULL,NULL),(45,1,'',350000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','mluser05@example.com','DummyEmail05!','MLdummy05!','tersedia',NULL,NULL,NULL),(46,2,'',175000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser01@example.com','DummyEmail06!','EFBdummy01!','tersedia',NULL,NULL,NULL),(47,2,'',225000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser02@example.com','DummyEmail07!','EFBdummy02!','terjual',NULL,NULL,NULL),(48,2,'',275000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser03@example.com','DummyEmail08!','EFBdummy03!','tersedia',NULL,NULL,NULL),(49,2,'',325000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser04@example.com','DummyEmail09!','EFBdummy04!','terjual',NULL,NULL,NULL),(50,2,'',400000.00,NULL,'Akun siap dimainkan, data sesuai deskripsi dan aman untuk digunakan.','efbuser05@example.com','DummyEmail10!','EFBdummy05!','tersedia',NULL,NULL,NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_account_status_update` AFTER UPDATE ON `accounts` FOR EACH ROW BEGIN
                IF OLD.status <> NEW.status THEN
                    INSERT INTO status_logs (account_id, old_status, new_status, changed_at)
                    VALUES (OLD.account_id, OLD.status, NEW.status, NOW());
                END IF;
            END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `admin_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admins_username_unique` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin','$2y$12$Kabn6fkBWOpO4V2LhsYYquH.zRnqLH4YQPenWbsJgFsSJkMvXsOdm','2026-10-11 12:08:14','2026-10-11 12:08:14');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buyers`
--

DROP TABLE IF EXISTS `buyers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buyers` (
  `buyer_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`buyer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buyers`
--

LOCK TABLES `buyers` WRITE;
/*!40000 ALTER TABLE `buyers` DISABLE KEYS */;
INSERT INTO `buyers` VALUES (1,'Buyer Test','test@buyer.com','0812345678','2026-10-11 12:08:14','2026-10-11 12:08:14'),(2,'Fadly Arya','fadly_buyer@example.com','081234567890','2026-10-11 12:39:03','2026-10-11 12:39:03');
/*!40000 ALTER TABLE `buyers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `game_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `webmail_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guide_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_template` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Mobile Legends',NULL,NULL,NULL,NULL,NULL),(2,'eFootball',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_09_24_174041_create_games_table',1),(5,'2026_09_24_174046_create_buyers_table',1),(6,'2026_09_24_174112_create_admin_table',1),(7,'2026_09_24_174141_create_accounts_table',1),(8,'2026_09_24_174206_create_orders_table',1),(9,'2026_09_24_174237_create_payments_table',1),(10,'2026_09_24_174257_create_status_logs_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `buyer_id` bigint unsigned NOT NULL,
  `account_id` bigint unsigned NOT NULL,
  `delivery_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('menunggu','menunggu_konfirmasi','valid','ditolak') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `orders_buyer_id_foreign` (`buyer_id`),
  KEY `orders_account_id_foreign` (`account_id`),
  CONSTRAINT `orders_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  CONSTRAINT `orders_buyer_id_foreign` FOREIGN KEY (`buyer_id`) REFERENCES `buyers` (`buyer_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,11,'test@buyer.com','valid','2026-10-11 12:08:14','2026-10-11 12:08:14'),(2,2,13,'fadly_buyer@example.com','valid','2026-10-11 12:39:03','2026-10-11 12:39:03');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proof_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('menunggu','dikonfirmasi','ditolak') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu',
  `confirmed_by` bigint unsigned DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `payments_order_id_foreign` (`order_id`),
  KEY `payments_confirmed_by_foreign` (`confirmed_by`),
  CONSTRAINT `payments_confirmed_by_foreign` FOREIGN KEY (`confirmed_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL,
  CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'QRIS','bukti-transfer/test.jpg','dikonfirmasi',1,'2026-10-11 12:08:14','2026-10-11 12:08:14','2026-10-11 12:08:14'),(2,2,'QRIS','bukti-transfer/dummy_qris.jpg','dikonfirmasi',1,'2026-10-11 12:39:03','2026-10-11 12:39:03','2026-10-11 12:39:03');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_logs`
--

DROP TABLE IF EXISTS `status_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_logs` (
  `log_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `account_id` bigint unsigned NOT NULL,
  `old_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `new_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `changed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `status_logs_account_id_foreign` (`account_id`),
  CONSTRAINT `status_logs_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_logs`
--

LOCK TABLES `status_logs` WRITE;
/*!40000 ALTER TABLE `status_logs` DISABLE KEYS */;
INSERT INTO `status_logs` VALUES (1,11,'tersedia','tertunda','2026-10-11 19:08:14'),(2,11,'tertunda','terjual','2026-10-11 19:08:14'),(3,13,'tersedia','tertunda','2026-10-11 19:39:03'),(4,13,'tertunda','terjual','2026-10-11 19:39:03');
/*!40000 ALTER TABLE `status_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-12  2:59:02
