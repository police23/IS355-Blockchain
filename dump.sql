-- Adminer 5.4.1 MySQL 8.0.44 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_line` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ward` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `addresses` (`id`, `user_id`, `address_line`, `ward`, `district`, `province`, `is_default`, `created_at`, `updated_at`) VALUES
(1,	5,	'123 Đường Nguyễn Văn Linh',	'Phường Tân Phong',	'Quận 7',	'TP. Hồ Chí Minh',	1,	'2025-07-13 03:29:22',	'2025-07-30 12:28:17'),
(2,	5,	'ssssss',	'Thạnh Xuân',	'district2',	'hanoi',	0,	'2025-07-13 04:42:28',	'2025-07-30 12:28:17'),
(3,	6,	'fffffffffffff',	'qqqqqqqqq',	'district1',	'hcm',	1,	'2025-10-19 09:57:16',	'2025-10-19 09:57:16');

DROP TABLE IF EXISTS `book_images`;
CREATE TABLE `book_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_book_id` (`book_id`),
  CONSTRAINT `book_images_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `book_images` (`id`, `book_id`, `image_path`, `created_at`) VALUES
(2,	1,	'/uploads/de-men-50k_1-1752913450695-914855093.webp',	'2025-07-19 08:24:10'),
(3,	2,	'/uploads/ttdgbn1-1752913653905-623267634.webp',	'2025-07-19 08:27:33'),
(4,	2,	'/uploads/ttdgbn2-1752913653908-357982895.webp',	'2025-07-19 08:27:33'),
(5,	2,	'/uploads/ttdgbn3-1752913653912-210652702.webp',	'2025-07-19 08:27:33'),
(6,	2,	'/uploads/ttdgbn5-1752913653913-956395460.webp',	'2025-07-19 08:27:33'),
(7,	2,	'/uploads/ttdgbn6-1752913653916-732643185.webp',	'2025-07-19 08:27:33'),
(8,	3,	'/uploads/bo_gia_1_2018_07_20_15_20_34-1752913719377-658319581.webp',	'2025-07-19 08:28:39'),
(9,	3,	'/uploads/bo_gia_2_2018_07_20_15_20_34-1752913719379-307820006.webp',	'2025-07-19 08:28:39'),
(10,	3,	'/uploads/bo_gia_3_2018_07_20_15_20_34-1752913719382-894417764.webp',	'2025-07-19 08:28:39'),
(11,	3,	'/uploads/bo_gia_10_2018_07_20_15_20_34-1752913719384-946961444.webp',	'2025-07-19 08:28:39'),
(12,	4,	'/uploads/2024_06_10_11_08_00_1-390x510-1752913807234-156855493.webp',	'2025-07-19 08:30:07'),
(13,	4,	'/uploads/2024_06_10_11_08_00_2-390x510-1752913807237-764864218.webp',	'2025-07-19 08:30:07'),
(14,	4,	'/uploads/2024_06_10_11_08_00_10-390x510-1752913807241-87830304.webp',	'2025-07-19 08:30:07'),
(15,	5,	'/uploads/8934974179238-1752913888503-639732535.webp',	'2025-07-19 08:31:28'),
(16,	5,	'/uploads/2023_03_23_15_58_37_3-390x510-1752913888504-834406421.webp',	'2025-07-19 08:31:28'),
(17,	5,	'/uploads/2023_03_23_15_58_37_5-390x510-1752913888506-829785661.webp',	'2025-07-19 08:31:28'),
(18,	6,	'/uploads/8934974179672-1752913939638-34954671.webp',	'2025-07-19 08:32:19'),
(19,	6,	'/uploads/2022_12_09_10_30_42_1-390x510-1752913939639-32335142.webp',	'2025-07-19 08:32:19'),
(20,	6,	'/uploads/2022_12_09_10_30_42_2-390x510-1752913939639-714185204.webp',	'2025-07-19 08:32:19'),
(21,	6,	'/uploads/2022_12_09_10_30_42_3-390x510-1752913939640-154591274.webp',	'2025-07-19 08:32:19'),
(22,	7,	'/uploads/2024_03_20_18_29_19_1-390x510-1752913995368-812078401.webp',	'2025-07-19 08:33:15'),
(23,	7,	'/uploads/2024_03_20_18_29_19_2-390x510-1752913995369-298971134.webp',	'2025-07-19 08:33:15'),
(24,	7,	'/uploads/2024_03_20_18_29_19_3-390x510-1752913995370-234135356.webp',	'2025-07-19 08:33:15'),
(25,	7,	'/uploads/2024_03_20_18_29_19_4-390x510-1752913995370-656066038.webp',	'2025-07-19 08:33:15'),
(26,	8,	'/uploads/2022_06_21_14_58_24_1-390x510-1752914054696-480451691.webp',	'2025-07-19 08:34:14'),
(27,	8,	'/uploads/2022_06_21_14_58_24_2-390x510-1752914054699-662022883.webp',	'2025-07-19 08:34:14'),
(28,	8,	'/uploads/2022_06_21_14_58_24_3-390x510-1752914054701-796399724.webp',	'2025-07-19 08:34:14'),
(29,	8,	'/uploads/2022_06_21_14_58_24_4-390x510-1752914054705-572626226.webp',	'2025-07-19 08:34:14'),
(30,	8,	'/uploads/2022_06_21_14_58_24_5-390x510-1752914054708-274118915.webp',	'2025-07-19 08:34:14'),
(31,	9,	'/uploads/560_1_1-1752914109820-341914357.webp',	'2025-07-19 08:35:09'),
(32,	10,	'/uploads/bo-tro-anh-6-2-_curved__2-1752914165319-232741614.webp',	'2025-07-19 08:36:05'),
(33,	10,	'/uploads/2025_01_22_14_33_42_2-390x510-1752914165319-705532890.webp',	'2025-07-19 08:36:05'),
(34,	10,	'/uploads/2025_01_22_14_33_42_3-390x510-1752914165319-286957714.webp',	'2025-07-19 08:36:05'),
(35,	10,	'/uploads/2025_01_22_14_33_42_4-390x510-1752914165320-711845791.webp',	'2025-07-19 08:36:05'),
(36,	15,	'/uploads/9784091233714-1752914285682-115839587.webp',	'2025-07-19 08:38:05'),
(37,	15,	'/uploads/2022_04_05_10_59_51_2-390x510-1752914285683-571339396.webp',	'2025-07-19 08:38:05'),
(38,	15,	'/uploads/2022_04_05_10_59_51_3-390x510-1752914285684-700626044.webp',	'2025-07-19 08:38:05'),
(39,	15,	'/uploads/2022_04_05_10_59_51_4-390x510-1752914285684-623522132.webp',	'2025-07-19 08:38:05'),
(40,	20,	'/uploads/9781108430425-1752914353659-495993056.webp',	'2025-07-19 08:39:13'),
(41,	20,	'/uploads/english_grammar_in_use_book_w_ans_2_2018_09_19_15_25_47-1752914353660-573626453.webp',	'2025-07-19 08:39:13'),
(42,	20,	'/uploads/english_grammar_in_use_book_w_ans_3_2018_09_19_15_25_47-1752914353664-967063201.webp',	'2025-07-19 08:39:13'),
(43,	20,	'/uploads/english_grammar_in_use_book_w_ans_10_2018_09_19_15_25_47-1752914353668-822090353.webp',	'2025-07-19 08:39:13'),
(44,	18,	'/uploads/8935086831311-1752914407260-506221013.webp',	'2025-07-19 08:40:07'),
(45,	18,	'/uploads/2021_02_18_15_15_34_2-390x510-1752914407260-540167791.gif',	'2025-07-19 08:40:07'),
(46,	18,	'/uploads/2021_02_18_15_15_34_3-390x510-1752914407264-983607881.gif',	'2025-07-19 08:40:07'),
(47,	18,	'/uploads/2021_02_18_15_15_34_4-390x510-1752914407267-123464874.gif',	'2025-07-19 08:40:07'),
(48,	17,	'/uploads/thaydoituduy_bia1-1752914843612-398440183.webp',	'2025-07-19 08:47:23'),
(49,	17,	'/uploads/banner_thaydoituduy_mockup2-1752914843613-536868804.webp',	'2025-07-19 08:47:23'),
(50,	17,	'/uploads/2024_09_09_17_29_08_2-390x510-1752914843615-440421417.webp',	'2025-07-19 08:47:23'),
(51,	17,	'/uploads/2024_09_09_17_29_08_3-390x510-1752914843615-320252378.webp',	'2025-07-19 08:47:23'),
(52,	16,	'/uploads/image_235287-1752914888595-396777423.webp',	'2025-07-19 08:48:08'),
(53,	16,	'/uploads/2024_10_30_16_43_45_2-390x510-1752914888595-946153256.webp',	'2025-07-19 08:48:08'),
(54,	16,	'/uploads/2024_10_30_16_43_45_3-390x510-1752914888598-107415742.webp',	'2025-07-19 08:48:08'),
(55,	16,	'/uploads/2024_10_30_16_43_45_6-390x510-1752914888600-326191751.webp',	'2025-07-19 08:48:08'),
(56,	19,	'/uploads/muado-1752914966569-202978072.webp',	'2025-07-19 08:49:26'),
(57,	19,	'/uploads/2025_06_21_11_56_48_3-390x510-1752914966569-67917996.webp',	'2025-07-19 08:49:26'),
(58,	19,	'/uploads/2025_06_21_11_56_48_4-390x510-1752914966572-170157794.webp',	'2025-07-19 08:49:26'),
(59,	19,	'/uploads/2025_06_21_11_56_48_5-390x510-1752914966575-42326830.webp',	'2025-07-19 08:49:26'),
(60,	14,	'/uploads/gt1-1752914993723-302471092.webp',	'2025-07-19 08:49:53'),
(61,	12,	'/uploads/táº£i xuá»ng-1754037281638-168069631.png',	'2025-08-01 08:34:41'),
(63,	24,	'/uploads/mau-bia-sach-dep-1760847385390-642106478.jpg',	'2025-10-19 04:16:25'),
(64,	22,	'/uploads/mau-bia-sach-dep-1760847562868-66367909.jpg',	'2025-10-19 04:19:22');

DROP TABLE IF EXISTS `book_import_details`;
CREATE TABLE `book_import_details` (
  `import_id` int NOT NULL,
  `book_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,0) NOT NULL,
  PRIMARY KEY (`import_id`,`book_id`),
  KEY `import_id` (`import_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `book_import_details_ibfk_1` FOREIGN KEY (`import_id`) REFERENCES `book_imports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `book_import_details_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `book_import_details` (`import_id`, `book_id`, `quantity`, `unit_price`) VALUES
(1,	1,	50,	7000),
(1,	2,	50,	7000),
(2,	3,	60,	6000),
(2,	4,	50,	9000),
(3,	5,	40,	8500),
(3,	6,	40,	8500),
(4,	7,	70,	5000),
(4,	8,	60,	7000),
(5,	9,	50,	8000),
(5,	10,	60,	8000),
(6,	12,	55,	7500),
(7,	14,	60,	7000),
(8,	15,	100,	4000),
(8,	16,	60,	8000),
(9,	17,	65,	6500),
(9,	18,	65,	6100),
(10,	19,	55,	7200),
(10,	20,	55,	7100);

DROP TABLE IF EXISTS `book_imports`;
CREATE TABLE `book_imports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int NOT NULL,
  `imported_by` int NOT NULL,
  `import_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_price` decimal(12,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `imported_by` (`imported_by`),
  CONSTRAINT `book_imports_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `book_imports_ibfk_2` FOREIGN KEY (`imported_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `book_imports` (`id`, `supplier_id`, `imported_by`, `import_date`, `total_price`) VALUES
(1,	1,	3,	'2025-07-18 20:58:00',	700000),
(2,	2,	3,	'2025-07-18 20:58:00',	750000),
(3,	3,	3,	'2025-07-18 20:58:00',	680000),
(4,	4,	3,	'2025-07-18 20:58:00',	720000),
(5,	5,	3,	'2025-07-18 20:58:00',	840000),
(6,	6,	3,	'2025-07-18 20:58:00',	910000),
(7,	7,	3,	'2025-07-18 20:58:00',	760000),
(8,	8,	3,	'2025-07-18 20:58:00',	880000),
(9,	9,	3,	'2025-07-18 20:58:00',	820000),
(10,	10,	3,	'2025-07-18 20:58:00',	790000),
(11,	3,	1,	'2025-09-07 04:46:47',	145000);

DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category_id` int NOT NULL,
  `publisher_id` int NOT NULL,
  `publication_year` int DEFAULT NULL,
  `price` int DEFAULT NULL,
  `quantity_in_stock` int DEFAULT '0',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `publisher_id` (`publisher_id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `books_ibfk_2` FOREIGN KEY (`publisher_id`) REFERENCES `publishers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `books` (`id`, `title`, `author`, `category_id`, `publisher_id`, `publication_year`, `price`, `quantity_in_stock`, `description`, `created_at`, `updated_at`) VALUES
(1,	'Dế Mèn Phiêu Lưu Ky',	'Tô Hoài',	1,	1,	2023,	35000,	0,	'Cuốn truyện thiếu nhi kinh điển của văn học Việt Nam',	'2025-07-18 13:57:13',	'2025-07-19 08:24:10'),
(2,	'Tuổi Trẻ Đáng Giá Bao Nhiêu',	'Rosie Nguyễn',	4,	2,	2016,	85000,	35,	'Cuốn sách truyền cảm hứng cho giới trẻ hiện đại',	'2025-07-18 13:57:13',	'2025-07-19 08:27:33'),
(3,	'Bố Già',	'Mario Puzo',	1,	4,	1969,	99000,	43,	'Tiểu thuyết tội phạm nổi tiếng thế giới',	'2025-07-18 13:57:13',	'2025-07-19 08:28:39'),
(4,	'Đắc Nhân Tâm',	'Dale Carnegie',	4,	5,	1936,	79000,	39,	'Kỹ năng giao tiếp và ứng xử giúp thành công',	'2025-07-18 13:57:13',	'2025-07-19 08:30:07'),
(5,	'Lược Sử Thời Gian',	'Stephen Hawking',	2,	6,	1988,	110000,	40,	'Giải thích khoa học vũ trụ cho người phổ thông',	'2025-07-18 13:57:13',	'2025-07-19 08:31:28'),
(6,	'Harry Potter và Hòn Đá Phù Thủy',	'J.K. Rowling',	1,	1,	1997,	120000,	0,	'Phần đầu tiên trong loạt truyện Harry Potter',	'2025-07-18 13:57:13',	'2025-07-19 08:32:19'),
(7,	'Nhà Giả Kim',	'Paulo Coelho',	1,	2,	1988,	89000,	62,	'Hành trình đi tìm ước mơ và định mệnh',	'2025-07-18 13:57:13',	'2025-07-19 08:33:15'),
(8,	'Lập Trình Python Cơ Bản',	'Nguyễn Văn A',	6,	3,	2022,	150000,	51,	'Sách lập trình Python cho người mới bắt đầu',	'2025-07-18 13:57:13',	'2025-07-19 08:34:14'),
(9,	'Kinh Tế Học Dành Cho Đại Chúng',	'Steven D. Levitt',	3,	4,	2005,	98000,	50,	'Phân tích các hiện tượng xã hội bằng góc nhìn kinh tế',	'2025-07-18 13:57:13',	'2025-07-19 08:35:09'),
(10,	'Hạt Giống Tâm Hồn',	'Nhiều tác giả',	4,	1,	2002,	55000,	54,	'Tập hợp những câu chuyện truyền cảm hứng',	'2025-07-18 13:57:13',	'2025-07-19 08:36:05'),
(12,	'Từ Điển Anh - Việt',	'Nhiều tác giả',	7,	7,	2010,	60000,	47,	'Từ điển học tiếng Anh cơ bản',	'2025-07-18 13:57:13',	'2025-08-01 08:34:41'),
(14,	'Giáo Trình Giải Tích 1',	'Ngô Bảo Châu',	9,	9,	2008,	100000,	50,	'Sách đại học chuyên ngành Toán',	'2025-07-18 13:57:13',	'2025-07-19 08:49:53'),
(15,	'Detective Conan Vol.1',	'Gosho Aoyama',	10,	1,	1994,	25000,	78,	'Tập đầu của truyện tranh trinh thám nổi tiếng',	'2025-07-18 13:57:13',	'2025-07-19 08:38:05'),
(16,	'Triết Học Nhập Môn',	'Nguyễn Văn C',	2,	5,	2019,	68000,	52,	'Giới thiệu các trường phái triết học',	'2025-07-18 13:57:13',	'2025-07-19 08:48:08'),
(17,	'Mindset - Tư Duy Thay Đổi',	'Carol S. Dweck',	4,	2,	2006,	95000,	62,	'Khám phá sức mạnh của tư duy phát triển',	'2025-07-18 13:57:13',	'2025-07-19 08:47:23'),
(18,	'Cuộc Sống Không Giới Hạn',	'Nick Vujicic',	4,	1,	2011,	89000,	60,	'Câu chuyện vượt lên số phận của người không tay chân',	'2025-07-18 13:57:13',	'2025-07-19 08:40:07'),
(19,	'Mưa Đỏ',	'Lê Văn D',	1,	3,	2021,	160000,	55,	'Lập trình JS từ căn bản đến nâng cao',	'2025-07-18 13:57:13',	'2025-07-19 08:49:26'),
(20,	'English Grammar in Use',	'Raymond Murphy',	7,	10,	2015,	135000,	55,	'Sách ngữ pháp tiếng Anh nổi tiếng dành cho người học',	'2025-07-18 13:57:13',	'2025-07-19 08:39:13'),
(22,	'ddd',	'Nhật Ánh',	4,	1,	2022,	150000,	0,	'aaaaaaaaa',	'2025-10-19 02:39:15',	'2025-10-19 02:39:15'),
(24,	'ddee',	'Nhật Ánh',	1,	8,	2024,	150000,	0,	'q',	'2025-10-19 04:16:25',	'2025-10-19 04:16:25');

DROP TABLE IF EXISTS `cart_details`;
CREATE TABLE `cart_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `book_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cart_book` (`cart_id`,`book_id`),
  KEY `cart_id` (`cart_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `cart_details_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_details_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_details_chk_1` CHECK ((`quantity` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `cart_details` (`id`, `cart_id`, `book_id`, `quantity`, `added_at`) VALUES
(51,	1,	12,	1,	'2025-12-06 13:31:56');

DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `carts` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(1,	6,	'2025-10-18 13:08:54',	'2025-10-18 13:08:54');

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1,	'Văn học',	'Sách văn học trong nước và nước ngoài',	'2025-07-18 12:55:33',	'2025-07-18 12:55:33'),
(2,	'Khoa học',	'Sách về vật lý, hóa học, sinh học và các ngành khoa học khác',	'2025-07-18 12:55:33',	'2025-07-18 12:55:33'),
(3,	'Kinh tế',	'Sách về kinh doanh, tài chính, và quản lý',	'2025-07-18 12:55:33',	'2025-07-18 12:55:33'),
(4,	'Tâm lý - Kỹ năng sống',	'Sách phát triển bản thân, tâm lý học, kỹ năng sống',	'2025-07-18 12:55:33',	'2025-07-18 12:55:33'),
(5,	'Thiếu nhi',	'Sách dành cho trẻ em và thiếu nhi',	'2025-07-18 12:55:33',	'2025-07-18 12:55:33'),
(6,	'Công nghệ - Lập trình',	'Sách về CNTT, lập trình, phần mềm',	'2025-07-18 12:55:33',	'2025-07-18 12:55:33'),
(7,	'Ngoại ngữ',	'Sách học tiếng Anh, tiếng Nhật, tiếng Hàn, v.v.',	'2025-07-18 12:55:33',	'2025-07-18 12:55:33'),
(8,	'Lịch sử',	'Sách lịch sử Việt Nam và thế giới',	'2025-07-18 12:55:33',	'2025-07-18 12:55:33'),
(9,	'Giáo trình',	'Giáo trình học tập các cấp, đại học, cao đẳng',	'2025-07-18 12:55:33',	'2025-07-18 12:55:33'),
(10,	'Truyện tranh',	'Manga, comic, truyện tranh thiếu nhi',	'2025-07-18 12:55:33',	'2025-07-18 12:55:33');

DROP TABLE IF EXISTS `contract_events`;
CREATE TABLE `contract_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaction_hash` varchar(255) NOT NULL,
  `event_name` varchar(50) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  `payload` json DEFAULT NULL,
  `block_number` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `event_name` (`event_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `contract_events` (`id`, `transaction_hash`, `event_name`, `order_id`, `payload`, `block_number`, `created_at`) VALUES
(1,	'0xe8eb2307c4304a2768bb0fe90c0f23cf2054b71f8a0d3c0b8ff8ce93d3fd1fb7',	'PaymentRecorded',	'0x2e9b7c94e032d8b3b8b30bd825717a5ac74958b53e7c37a892a4fd7dc56e4975',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.00236536134418802\", \"status\": \"None\", \"paymentId\": \"11\"}',	9766289,	'2025-12-04 09:07:32'),
(2,	'0x39b2c154b47169a8f5be5e1320f55825984aec6c601888fda74ea09ff58a0ac9',	'PaymentRecorded',	'0x2cc0d3dcb20652cd8f106aee76b6a7391771a130885634c0eb2bbe3cde796691',	'{\"payer\": \"0xbFe10bda2Dab71736877d0E72cA7DA7598734627\", \"amount\": \"0.001352123677471819\", \"status\": \"None\", \"paymentId\": \"12\"}',	9766310,	'2025-12-04 09:11:42'),
(3,	'0x5e791cf39c32e6b095180511bb67571b8f0ec15c82d60d7f8fa952c52ec38319',	'PaymentRecorded',	'0xcc1431a2586c1e11fb75c87e5ee58e4204126a9fdde07075c91770f50276cbb0',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001600320955629169\", \"status\": \"None\", \"paymentId\": \"13\"}',	9766423,	'2025-12-04 09:34:21'),
(4,	'0x7d618f6ecdea06298b08d950588244217130287b1b02cca17d607bd9ffaac6b7',	'PaymentRecorded',	'0xc47ece0ffae697632ce145a7086cbcf260f7fa60876ff2606761ea2b7581ee76',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001361279058750578\", \"status\": \"None\", \"paymentId\": \"14\"}',	9766455,	'2025-12-04 09:40:42'),
(5,	'0x2c35b603e7bdc27cb09334cd1596136322095f163573410825685f84edb90def',	'PaymentRecorded',	'0x6304e47846f882085b0f4b1a184252ae95ffe5e2a02daf39c014f492dcb1441c',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001112719003223475\", \"status\": \"None\", \"paymentId\": \"15\"}',	9766463,	'2025-12-04 09:42:16'),
(6,	'0x2a6b14dcc88ede45a98f904ca834980e84ab7a69689154e79eddbe6a5a86ccf3',	'EscrowCreated',	'0x59c0d2b7af0a8e6d3d8e710a078764bd67b7223777026c424cdb4f599824bb79',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.00369387120991536\", \"seller\": \"0x5FF0D668aD4a813e0dd6939a273213159c6c9Cb2\", \"status\": \"Active\", \"createdAt\": \"1764854796\", \"timeoutAt\": \"1765459596\"}',	9767584,	'2025-12-04 13:26:44'),
(7,	'0x2a6b14dcc88ede45a98f904ca834980e84ab7a69689154e79eddbe6a5a86ccf3',	'PaymentRecorded',	'0x59c0d2b7af0a8e6d3d8e710a078764bd67b7223777026c424cdb4f599824bb79',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.00369387120991536\", \"status\": \"None\", \"paymentId\": \"16\"}',	9767584,	'2025-12-04 13:26:44'),
(8,	'0xe4ae90f3208b5e85f12febb56053a15473070ecc9c90fcb42329475aee467983',	'EscrowCreated',	'0xf928ede1c39c5595ff22fe845412ee05a93eeaa584f8ef0c46b5eeb14cb99ec8',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.002920127922103478\", \"seller\": \"0x5FF0D668aD4a813e0dd6939a273213159c6c9Cb2\", \"status\": \"Active\", \"createdAt\": \"1764855780\", \"timeoutAt\": \"1765460580\"}',	9767666,	'2025-12-04 13:43:03'),
(9,	'0xe4ae90f3208b5e85f12febb56053a15473070ecc9c90fcb42329475aee467983',	'PaymentRecorded',	'0xf928ede1c39c5595ff22fe845412ee05a93eeaa584f8ef0c46b5eeb14cb99ec8',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.002920127922103478\", \"status\": \"None\", \"paymentId\": \"17\"}',	9767666,	'2025-12-04 13:43:03'),
(10,	'0x882f22aba68498ffa299b96f38aa037f52e707d675c93f23f641f7652b6c002a',	'PaymentRecorded',	'0xf928ede1c39c5595ff22fe845412ee05a93eeaa584f8ef0c46b5eeb14cb99ec8',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.002920127922103478\", \"status\": \"Released\", \"paymentId\": \"18\"}',	9767669,	'2025-12-04 13:43:43'),
(11,	'0x882f22aba68498ffa299b96f38aa037f52e707d675c93f23f641f7652b6c002a',	'EscrowRefunded',	'0xf928ede1c39c5595ff22fe845412ee05a93eeaa584f8ef0c46b5eeb14cb99ec8',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.002920127922103478\", \"seller\": \"0x5FF0D668aD4a813e0dd6939a273213159c6c9Cb2\", \"status\": \"Refunded\", \"isTimeout\": false, \"refundedAt\": \"1764855816\", \"refundedBy\": \"0x5FF0D668aD4a813e0dd6939a273213159c6c9Cb2\"}',	9767669,	'2025-12-04 13:43:43'),
(12,	'0x2f6866a497ca23f9b761e5c2f3d2b0d94c205d0b66203b9242189e6a8378404e',	'EscrowCreated',	'0xcd41b8bf8f20f7ad95d96d948a315af225b219053fc98a80aee13063b692b681',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001123965704936642\", \"seller\": \"0x5FF0D668aD4a813e0dd6939a273213159c6c9Cb2\", \"status\": \"Active\", \"createdAt\": \"1764856116\", \"timeoutAt\": \"1765460916\"}',	9767694,	'2025-12-04 13:48:43'),
(13,	'0x2f6866a497ca23f9b761e5c2f3d2b0d94c205d0b66203b9242189e6a8378404e',	'PaymentRecorded',	'0xcd41b8bf8f20f7ad95d96d948a315af225b219053fc98a80aee13063b692b681',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001123965704936642\", \"status\": \"None\", \"paymentId\": \"19\"}',	9767694,	'2025-12-04 13:48:43'),
(14,	'0x182066e52d84a80b484e82ac2299181fa85d1db44032019a64a2edd0c00dcca0',	'EscrowCreated',	'0xbbd48b257be1b8216d144ef9be5734f8d11697959c9e0f7768bec89db74a63a3',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001356391577684008\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"createdAt\": \"1764858576\", \"timeoutAt\": \"1765463376\"}',	9767897,	'2025-12-04 14:29:42'),
(15,	'0x182066e52d84a80b484e82ac2299181fa85d1db44032019a64a2edd0c00dcca0',	'PaymentRecorded',	'0xbbd48b257be1b8216d144ef9be5734f8d11697959c9e0f7768bec89db74a63a3',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001356391577684008\", \"status\": \"None\", \"paymentId\": \"4\"}',	9767897,	'2025-12-04 14:29:42'),
(16,	'0xbbf496d633e512a2713d405170c31da7777f6116bacf8ff9f1f4176731bb6586',	'PaymentRecorded',	'0xbbd48b257be1b8216d144ef9be5734f8d11697959c9e0f7768bec89db74a63a3',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001356391577684008\", \"status\": \"Active\", \"paymentId\": \"5\"}',	9767904,	'2025-12-04 14:31:02'),
(17,	'0xbbf496d633e512a2713d405170c31da7777f6116bacf8ff9f1f4176731bb6586',	'EscrowReleased',	'0xbbd48b257be1b8216d144ef9be5734f8d11697959c9e0f7768bec89db74a63a3',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001356391577684008\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Released\", \"releasedAt\": \"1764858660\", \"releasedBy\": \"0x5FF0D668aD4a813e0dd6939a273213159c6c9Cb2\"}',	9767904,	'2025-12-04 14:31:02'),
(18,	'0x0bb56aa12791bb8b3a736274d927e9c2d6711dd1f4e7e8a6e24165671aaa49ff',	'EscrowCreated',	'0x32da71dbd53bc029835bc5ecdd3e688035cc92bb61b1811d1685e67ba974e19f',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.002355385978557245\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"createdAt\": \"1764937788\", \"timeoutAt\": \"1765542588\"}',	9774468,	'2025-12-05 12:29:52'),
(19,	'0x0bb56aa12791bb8b3a736274d927e9c2d6711dd1f4e7e8a6e24165671aaa49ff',	'PaymentRecorded',	'0x32da71dbd53bc029835bc5ecdd3e688035cc92bb61b1811d1685e67ba974e19f',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.002355385978557245\", \"status\": \"None\", \"paymentId\": \"6\"}',	9774468,	'2025-12-05 12:29:52'),
(20,	'0xb710494674d79d768a7dbff642cd27d941a51f5841f8b900ad2e7e60410de6dd',	'EscrowCreated',	'0xe921da22f871c25c63f06c1365385cbb26397f64f79055cdbab32187a9377d16',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001006434609360651\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"createdAt\": \"1764938184\", \"timeoutAt\": \"1765542984\"}',	9774500,	'2025-12-05 12:36:36'),
(21,	'0xb710494674d79d768a7dbff642cd27d941a51f5841f8b900ad2e7e60410de6dd',	'PaymentRecorded',	'0xe921da22f871c25c63f06c1365385cbb26397f64f79055cdbab32187a9377d16',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001006434609360651\", \"status\": \"None\", \"paymentId\": \"7\"}',	9774500,	'2025-12-05 12:36:36'),
(22,	'0x6471a45e28b641907360005dbc2b2d9b500d86a7cd6cfa2ab02eb2074286f1aa',	'EscrowCreated',	'0x59d26ca75eb04b47ab1bca5d789d02e4d0cf9ff8cb49c9041caeeeab4eccafbf',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001138680462919155\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"createdAt\": \"1764938592\", \"timeoutAt\": \"1765543392\"}',	9774533,	'2025-12-05 12:43:19'),
(23,	'0x6471a45e28b641907360005dbc2b2d9b500d86a7cd6cfa2ab02eb2074286f1aa',	'PaymentRecorded',	'0x59d26ca75eb04b47ab1bca5d789d02e4d0cf9ff8cb49c9041caeeeab4eccafbf',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001138680462919155\", \"status\": \"None\", \"paymentId\": \"8\"}',	9774533,	'2025-12-05 12:43:19'),
(24,	'0xa8efd9a53984798938b46e3a14c465c02b278b8926a11fde679e239b7d225d78',	'EscrowCreated',	'0xdec29173c70f4e70086d64e09cb72b415f3d6a1843817cff62483903f0e12f62',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.002000805827578581\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"createdAt\": \"1764938964\", \"timeoutAt\": \"1765543764\"}',	9774564,	'2025-12-05 12:49:30'),
(25,	'0xa8efd9a53984798938b46e3a14c465c02b278b8926a11fde679e239b7d225d78',	'PaymentRecorded',	'0xdec29173c70f4e70086d64e09cb72b415f3d6a1843817cff62483903f0e12f62',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.002000805827578581\", \"status\": \"None\", \"paymentId\": \"9\"}',	9774564,	'2025-12-05 12:49:30'),
(26,	'0xb96178b95a3fe295af99e7b9783fcd5844bf1a241d76ca7a907b6d59412c3194',	'EscrowCreated',	'0x7446b42d7fe1689ec32fc1ca65129d9f21f1979742315d34500a6886f6986bea',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001139110777165841\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"createdAt\": \"1764939384\", \"timeoutAt\": \"1765544184\"}',	9774599,	'2025-12-05 12:56:33'),
(27,	'0xb96178b95a3fe295af99e7b9783fcd5844bf1a241d76ca7a907b6d59412c3194',	'PaymentRecorded',	'0x7446b42d7fe1689ec32fc1ca65129d9f21f1979742315d34500a6886f6986bea',	'{\"payer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001139110777165841\", \"status\": \"None\", \"paymentId\": \"10\"}',	9774599,	'2025-12-05 12:56:33'),
(28,	'0x22da45a32a712f6fcb745fa3c3a6df3794f81f31f7ae1e761a955b0b2e45e420',	'PaymentRecorded',	'107',	'{\"amount\": \"0.001175361394244695\", \"sender\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"status\": \"None\", \"paymentId\": \"3\"}',	9781092,	'2025-12-06 11:11:51'),
(29,	'0x7b086b3973ae4b0d4640884256fc495ca6e17103ca06a8ff7892a867eb296abb',	'EscrowFunded',	'109',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.002061587154977615\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"fundedAt\": \"1765020396\", \"timeoutAt\": \"1765625196\"}',	9781166,	'2025-12-06 11:26:45'),
(30,	'0x7b086b3973ae4b0d4640884256fc495ca6e17103ca06a8ff7892a867eb296abb',	'PaymentRecorded',	'109',	'{\"amount\": \"0.002061587154977615\", \"sender\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"status\": \"None\", \"paymentId\": \"4\"}',	9781166,	'2025-12-06 11:26:45'),
(31,	'0xe5dc20ff1e4daea885c4d39ba3740813c19e16de0454c2b7f3c6183fd74c0603',	'EscrowFunded',	'110',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.000936192747257367\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"fundedAt\": \"1765021020\", \"timeoutAt\": \"1765625820\"}',	9781218,	'2025-12-06 11:37:05'),
(32,	'0xe5dc20ff1e4daea885c4d39ba3740813c19e16de0454c2b7f3c6183fd74c0603',	'PaymentRecorded',	'110',	'{\"amount\": \"0.000936192747257367\", \"sender\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"status\": \"None\", \"paymentId\": \"5\"}',	9781218,	'2025-12-06 11:37:05'),
(33,	'0x01e68c2c68fc767aeee935293355bf3ef4b6cb56892c40cabf2ec618a54b0b6d',	'EscrowFunded',	'111',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.000874432886551427\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"fundedAt\": \"1765021200\", \"timeoutAt\": \"1765626000\"}',	9781233,	'2025-12-06 11:40:07'),
(34,	'0x01e68c2c68fc767aeee935293355bf3ef4b6cb56892c40cabf2ec618a54b0b6d',	'PaymentRecorded',	'111',	'{\"amount\": \"0.000874432886551427\", \"sender\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"status\": \"None\", \"paymentId\": \"6\"}',	9781233,	'2025-12-06 11:40:07'),
(35,	'0x9ab0aad0b162cd83c35235f7b6a536ff8334d3d37a4f743cdb1f822fb2c6602a',	'EscrowCreated',	'112',	'{\"amount\": \"0.0020604093798676\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"createdAt\": \"1765021428\"}',	9781252,	'2025-12-06 11:43:58'),
(36,	'0xab8f97cb0c26a887b67fe151b64103f80b39a945a6e39f4b1d24e489b11bef75',	'EscrowFunded',	'112',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.0020604093798676\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"fundedAt\": \"1765021452\", \"timeoutAt\": \"1765626252\"}',	9781254,	'2025-12-06 11:44:17'),
(37,	'0xab8f97cb0c26a887b67fe151b64103f80b39a945a6e39f4b1d24e489b11bef75',	'PaymentRecorded',	'112',	'{\"amount\": \"0.0020604093798676\", \"sender\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"status\": \"None\", \"paymentId\": \"7\"}',	9781254,	'2025-12-06 11:44:17'),
(38,	'0x76b6f2375a2d188e2e1dfe93b49d6f343a8e15cfc6345a7be11d7d77b7f1b66c',	'PaymentRecorded',	'112',	'{\"amount\": \"0.0020604093798676\", \"sender\": \"0x5FF0D668aD4a813e0dd6939a273213159c6c9Cb2\", \"status\": \"Released\", \"paymentId\": \"8\"}',	9781258,	'2025-12-06 11:45:03'),
(39,	'0x76b6f2375a2d188e2e1dfe93b49d6f343a8e15cfc6345a7be11d7d77b7f1b66c',	'EscrowRefunded',	'112',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.0020604093798676\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Refunded\", \"isTimeout\": false, \"refundedAt\": \"1765021500\", \"refundedBy\": \"0x5FF0D668aD4a813e0dd6939a273213159c6c9Cb2\"}',	9781258,	'2025-12-06 11:45:03'),
(40,	'0x13335ffb6086b7ad67200fdf179acb767579eac9d038a0a990d735e4f1ac9c12',	'EscrowCreated',	'113',	'{\"amount\": \"0.001435026713521411\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"createdAt\": \"1765021560\"}',	9781263,	'2025-12-06 11:46:03'),
(41,	'0xad1473af706f031ec1649fa22fdeffb3163bcb884ef1dea2632b545fa1d17cb1',	'EscrowFunded',	'113',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001435026713521411\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"fundedAt\": \"1765021584\", \"timeoutAt\": \"1765626384\"}',	9781265,	'2025-12-06 11:46:33'),
(42,	'0xad1473af706f031ec1649fa22fdeffb3163bcb884ef1dea2632b545fa1d17cb1',	'PaymentRecorded',	'113',	'{\"amount\": \"0.001435026713521411\", \"sender\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"status\": \"None\", \"paymentId\": \"9\"}',	9781265,	'2025-12-06 11:46:33'),
(43,	'0xcb6c89ee2c086f3bfd136328dd046c20f2c07e7aff9b3fa2175d5825277e8583',	'PaymentRecorded',	'113',	'{\"amount\": \"0.001435026713521411\", \"sender\": \"0x5FF0D668aD4a813e0dd6939a273213159c6c9Cb2\", \"status\": \"Active\", \"paymentId\": \"10\"}',	9781275,	'2025-12-06 11:48:33'),
(44,	'0xcb6c89ee2c086f3bfd136328dd046c20f2c07e7aff9b3fa2175d5825277e8583',	'EscrowReleased',	'113',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001435026713521411\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Released\", \"releasedAt\": \"1765021704\", \"releasedBy\": \"0x5FF0D668aD4a813e0dd6939a273213159c6c9Cb2\"}',	9781275,	'2025-12-06 11:48:33'),
(45,	'0x10c8fbc88c5b8fdbf46d8d9a46439bac038e5ed6d4c6a433f751fba799ca3093',	'EscrowCreated',	'114',	'{\"amount\": \"0.001372161632207717\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"createdAt\": \"1765021980\"}',	9781298,	'2025-12-06 11:53:06'),
(46,	'0x9a5ef5552f58cc27d91541eea6ea09c8d15799766bda96d28631d15dbb8b9511',	'EscrowFunded',	'114',	'{\"buyer\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"amount\": \"0.001372161632207717\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"fundedAt\": \"1765022004\", \"timeoutAt\": \"1765626804\"}',	9781300,	'2025-12-06 11:53:31'),
(47,	'0x9a5ef5552f58cc27d91541eea6ea09c8d15799766bda96d28631d15dbb8b9511',	'PaymentRecorded',	'114',	'{\"amount\": \"0.001372161632207717\", \"sender\": \"0x159d6026CDB1355646393277d542E954cC28F8bA\", \"status\": \"None\", \"paymentId\": \"11\"}',	9781300,	'2025-12-06 11:53:31'),
(48,	'0xe85227b187b77fd3d505e3b190767899d7d0d61bf6f28d73df1245a3471a826d',	'EscrowCreated',	'115',	'{\"amount\": \"0.000936585330765973\", \"seller\": \"0xB086b6E7FE91eDd37Bc88d5a1E35b6EaA4c2F4D7\", \"status\": \"Active\", \"createdAt\": \"1765029192\"}',	9781897,	'2025-12-06 13:53:16');

DROP TABLE IF EXISTS `damage_report_items`;
CREATE TABLE `damage_report_items` (
  `report_id` int NOT NULL,
  `book_id` int NOT NULL,
  `quantity` int NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`report_id`,`book_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `damage_report_items_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `damage_reports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `damage_report_items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `damage_report_items_chk_1` CHECK ((`quantity` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `damage_report_items` (`report_id`, `book_id`, `quantity`, `reason`) VALUES
(14,	1,	3,	'rách trang'),
(15,	10,	1,	'rách');

DROP TABLE IF EXISTS `damage_reports`;
CREATE TABLE `damage_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_by` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `note` text,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `damage_reports_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `damage_reports` (`id`, `created_by`, `created_at`, `note`) VALUES
(14,	3,	'2025-08-01 14:21:30',	''),
(15,	3,	'2025-08-05 13:45:19',	'');

DROP TABLE IF EXISTS `order_assignments`;
CREATE TABLE `order_assignments` (
  `order_id` int NOT NULL,
  `assigned_by` int DEFAULT NULL,
  `shipper_id` int DEFAULT NULL,
  `assigned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `completion_date` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `assigned_by` (`assigned_by`),
  KEY `shipper_id` (`shipper_id`),
  CONSTRAINT `order_assignments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_assignments_ibfk_2` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `order_assignments_ibfk_3` FOREIGN KEY (`shipper_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `order_assignments` (`order_id`, `assigned_by`, `shipper_id`, `assigned_at`, `completion_date`) VALUES
(52,	5,	7,	'2025-12-04 13:52:34',	'2025-12-04 13:53:53'),
(53,	5,	7,	'2025-12-04 14:30:22',	'2025-12-04 14:31:03'),
(113,	5,	7,	'2025-12-06 11:47:49',	'2025-12-06 11:48:28');

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE `order_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `book_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `order_details` (`id`, `order_id`, `book_id`, `quantity`, `unit_price`) VALUES
(26,	24,	1,	2,	31500),
(27,	24,	16,	1,	61200),
(28,	25,	1,	1,	35000),
(29,	25,	2,	1,	85000),
(30,	26,	1,	1,	35000),
(31,	26,	2,	1,	85000),
(32,	27,	1,	1,	35000),
(33,	27,	2,	1,	85000),
(34,	28,	1,	1,	35000),
(35,	28,	2,	1,	85000),
(36,	29,	1,	1,	35000),
(37,	29,	2,	1,	85000),
(38,	30,	1,	1,	35000),
(39,	30,	3,	1,	99000),
(40,	31,	1,	1,	35000),
(41,	31,	3,	1,	99000),
(42,	32,	1,	1,	35000),
(43,	32,	3,	1,	99000),
(44,	33,	1,	1,	35000),
(45,	33,	3,	1,	99000),
(46,	34,	4,	1,	79000),
(47,	34,	5,	1,	110000),
(48,	35,	8,	1,	150000),
(49,	35,	9,	1,	98000),
(50,	36,	8,	1,	150000),
(51,	36,	9,	1,	98000),
(52,	37,	10,	1,	55000),
(53,	37,	12,	1,	60000),
(54,	38,	10,	1,	55000),
(55,	38,	12,	2,	60000),
(56,	38,	14,	1,	100000),
(57,	39,	10,	1,	55000),
(58,	39,	12,	2,	60000),
(59,	39,	14,	1,	100000),
(60,	40,	6,	1,	120000),
(61,	40,	7,	1,	89000),
(62,	41,	6,	1,	120000),
(63,	41,	7,	1,	89000),
(64,	42,	12,	1,	60000),
(65,	42,	14,	1,	100000),
(66,	43,	12,	1,	60000),
(67,	43,	14,	1,	100000),
(68,	44,	17,	1,	95000),
(69,	44,	18,	1,	89000),
(70,	45,	6,	1,	120000),
(71,	46,	14,	1,	100000),
(72,	47,	4,	1,	79000),
(73,	48,	4,	1,	79000),
(74,	49,	19,	1,	160000),
(75,	49,	20,	1,	135000),
(76,	50,	5,	1,	110000),
(77,	50,	6,	1,	120000),
(78,	51,	5,	1,	110000),
(79,	51,	6,	1,	120000),
(80,	52,	4,	1,	79000),
(81,	53,	3,	1,	99000),
(82,	54,	4,	1,	79000),
(83,	54,	14,	1,	100000),
(84,	55,	4,	1,	79000),
(85,	55,	14,	1,	100000),
(86,	56,	4,	1,	79000),
(87,	56,	14,	1,	100000),
(88,	57,	16,	1,	68000),
(89,	58,	4,	1,	79000),
(90,	59,	8,	1,	150000),
(91,	60,	4,	1,	79000),
(92,	61,	3,	1,	99000),
(93,	62,	3,	1,	99000),
(94,	63,	3,	1,	99000),
(95,	64,	6,	1,	120000),
(96,	65,	6,	1,	120000),
(97,	66,	6,	1,	120000),
(98,	67,	6,	1,	120000),
(99,	68,	6,	1,	120000),
(100,	69,	6,	1,	120000),
(101,	70,	6,	1,	120000),
(102,	71,	6,	1,	120000),
(103,	72,	6,	1,	120000),
(104,	73,	6,	1,	120000),
(105,	74,	6,	1,	120000),
(106,	75,	6,	1,	120000),
(107,	76,	6,	1,	120000),
(108,	77,	6,	1,	120000),
(109,	78,	6,	1,	120000),
(110,	79,	6,	1,	120000),
(111,	80,	6,	1,	120000),
(112,	81,	6,	1,	120000),
(113,	82,	6,	1,	120000),
(114,	83,	6,	1,	120000),
(115,	84,	6,	1,	120000),
(116,	85,	6,	1,	120000),
(117,	86,	6,	1,	120000),
(118,	87,	6,	1,	120000),
(119,	88,	6,	1,	120000),
(120,	89,	6,	1,	120000),
(121,	90,	6,	1,	120000),
(122,	91,	6,	1,	120000),
(123,	92,	6,	1,	120000),
(124,	93,	6,	1,	120000),
(125,	94,	6,	1,	120000),
(126,	95,	6,	1,	120000),
(127,	96,	6,	1,	120000),
(128,	97,	6,	1,	120000),
(129,	98,	6,	1,	120000),
(130,	100,	3,	1,	99000),
(131,	101,	3,	1,	99000),
(132,	102,	3,	1,	99000),
(133,	103,	3,	1,	99000),
(134,	104,	3,	1,	99000),
(135,	105,	4,	1,	79000),
(136,	106,	4,	1,	79000),
(137,	107,	4,	1,	79000),
(138,	108,	8,	1,	150000),
(139,	109,	8,	1,	150000),
(140,	110,	12,	1,	60000),
(141,	111,	10,	1,	55000),
(142,	112,	8,	1,	150000),
(143,	113,	14,	1,	100000),
(144,	114,	17,	1,	95000),
(145,	115,	12,	1,	60000);

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `shipping_method_id` int DEFAULT NULL,
  `shipping_address` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `promotion_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_amount` decimal(10,0) NOT NULL,
  `shipping_fee` decimal(10,0) NOT NULL,
  `discount_amount` decimal(10,0) DEFAULT '0',
  `final_amount` decimal(10,0) NOT NULL,
  `payment_method` enum('cash','online','crypto') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('pending','confirmed','delivering','delivered','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `escrow_status` enum('None','Active','Released','Refunded') COLLATE utf8mb4_general_ci DEFAULT 'None',
  `buyer_wallet_address` varchar(42) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `receipt_cid` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `crypto_amount` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `promotion_code` (`promotion_code`),
  KEY `shipping_method_id` (`shipping_method_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_methods` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `orders` (`id`, `user_id`, `order_date`, `shipping_method_id`, `shipping_address`, `promotion_code`, `total_amount`, `shipping_fee`, `discount_amount`, `final_amount`, `payment_method`, `status`, `escrow_status`, `buyer_wallet_address`, `receipt_cid`, `crypto_amount`) VALUES
(24,	6,	'2025-10-19 10:01:53',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	124200,	15000,	0,	139200,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(25,	6,	'2025-12-03 10:06:13',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(26,	6,	'2025-12-03 10:09:16',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(27,	6,	'2025-12-03 10:18:47',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(28,	6,	'2025-12-03 10:24:03',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(29,	6,	'2025-12-03 10:25:41',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(30,	6,	'2025-12-03 12:21:06',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	134000,	15000,	0,	149000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(31,	6,	'2025-12-03 12:23:57',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	134000,	15000,	0,	149000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(32,	6,	'2025-12-03 12:25:51',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	134000,	15000,	0,	149000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(33,	6,	'2025-12-03 12:27:51',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	134000,	15000,	0,	149000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(34,	6,	'2025-12-03 13:42:06',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	189000,	15000,	0,	204000,	'online',	'cancelled',	'None',	NULL,	NULL,	NULL),
(35,	6,	'2025-12-04 05:20:46',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	248000,	15000,	0,	263000,	'online',	'cancelled',	'None',	NULL,	NULL,	NULL),
(36,	6,	'2025-12-04 05:29:38',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	248000,	15000,	0,	263000,	'online',	'cancelled',	'None',	NULL,	NULL,	NULL),
(37,	6,	'2025-12-04 05:37:28',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	115000,	15000,	0,	130000,	'cash',	'pending',	'None',	NULL,	NULL,	NULL),
(38,	6,	'2025-12-04 05:37:48',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	275000,	15000,	0,	290000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(39,	6,	'2025-12-04 05:38:26',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	275000,	15000,	0,	290000,	'online',	'cancelled',	'None',	NULL,	NULL,	NULL),
(40,	6,	'2025-12-04 08:50:11',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	209000,	15000,	0,	224000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(41,	6,	'2025-12-04 08:57:05',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	209000,	15000,	0,	224000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(42,	6,	'2025-12-04 09:00:13',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	160000,	15000,	0,	175000,	'cash',	'pending',	'None',	NULL,	NULL,	NULL),
(43,	6,	'2025-12-04 09:00:31',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	160000,	15000,	0,	175000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(44,	6,	'2025-12-04 09:06:49',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	184000,	15000,	0,	199000,	'online',	'pending',	'None',	NULL,	NULL,	NULL),
(45,	6,	'2025-12-04 09:33:50',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'None',	NULL,	NULL,	NULL),
(46,	6,	'2025-12-04 09:40:19',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	100000,	15000,	0,	115000,	'crypto',	'pending',	'None',	NULL,	NULL,	NULL),
(47,	6,	'2025-12-04 09:41:45',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	79000,	15000,	0,	94000,	'cash',	'pending',	'None',	NULL,	NULL,	NULL),
(48,	6,	'2025-12-04 09:41:52',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	79000,	15000,	0,	94000,	'crypto',	'pending',	'Active',	NULL,	NULL,	NULL),
(49,	6,	'2025-12-04 13:26:02',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	295000,	15000,	0,	310000,	'crypto',	'cancelled',	'Active',	NULL,	NULL,	NULL),
(50,	6,	'2025-12-04 13:32:19',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	230000,	15000,	0,	245000,	'crypto',	'cancelled',	'Active',	NULL,	NULL,	NULL),
(51,	6,	'2025-12-04 13:42:41',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	230000,	15000,	0,	245000,	'crypto',	'cancelled',	'Refunded',	NULL,	NULL,	NULL),
(52,	6,	'2025-12-04 13:48:15',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	79000,	15000,	0,	94000,	'crypto',	'delivered',	'Active',	NULL,	NULL,	NULL),
(53,	6,	'2025-12-04 14:28:57',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	99000,	15000,	0,	114000,	'crypto',	'delivered',	'Released',	NULL,	NULL,	NULL),
(54,	6,	'2025-12-05 12:08:04',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	179000,	15000,	0,	194000,	'crypto',	'pending',	'Active',	NULL,	NULL,	NULL),
(55,	6,	'2025-12-05 12:14:24',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	179000,	15000,	0,	194000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	NULL),
(56,	6,	'2025-12-05 12:29:14',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	179000,	15000,	0,	194000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	NULL),
(57,	6,	'2025-12-05 12:35:58',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	68000,	15000,	0,	83000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	NULL),
(58,	6,	'2025-12-05 12:42:44',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	79000,	15000,	0,	94000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	NULL),
(59,	6,	'2025-12-05 12:49:02',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	150000,	15000,	0,	165000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	NULL),
(60,	6,	'2025-12-05 12:56:09',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	79000,	15000,	0,	94000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	'QmRws1vD9juAA1Hr8gthh2ijfPdyBjUWhj74Ji7YjzWr26',	NULL),
(61,	6,	'2025-12-06 06:01:44',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	99000,	15000,	0,	114000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'114000'),
(62,	6,	'2025-12-06 06:24:51',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	99000,	15000,	0,	114000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x50ed47df9486c'),
(63,	6,	'2025-12-06 06:29:39',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	99000,	15000,	0,	114000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x50ddf81191765'),
(64,	6,	'2025-12-06 06:42:22',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x5fc7e6982b5a4'),
(65,	6,	'2025-12-06 06:45:43',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	NULL,	NULL,	NULL),
(66,	6,	'2025-12-06 06:46:12',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	NULL,	NULL,	NULL),
(67,	6,	'2025-12-06 06:47:07',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x5fc984235e10f'),
(68,	6,	'2025-12-06 06:55:19',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x5fbf6650cf3e5'),
(69,	6,	'2025-12-06 06:59:49',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x5fc6c3a05cb13'),
(70,	6,	'2025-12-06 07:11:32',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x5fb656e2b3fc5'),
(71,	6,	'2025-12-06 07:16:01',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	NULL,	NULL,	NULL),
(72,	6,	'2025-12-06 07:16:48',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x5fbe23d807a0b'),
(73,	6,	'2025-12-06 07:19:19',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x5fcb3f0bcd434'),
(74,	6,	'2025-12-06 07:26:41',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x5fc0fe6799834'),
(75,	6,	'2025-12-06 07:27:01',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'cash',	'pending',	'None',	NULL,	NULL,	NULL),
(76,	6,	'2025-12-06 07:27:09',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x5fd68a883034d'),
(77,	6,	'2025-12-06 07:38:12',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x600b1028641b9'),
(78,	6,	'2025-12-06 07:46:02',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x60048f1869216'),
(79,	6,	'2025-12-06 07:50:31',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x6000eb16083d3'),
(80,	6,	'2025-12-06 07:54:47',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x60189e768f612'),
(81,	6,	'2025-12-06 07:59:49',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x602548550c8e6'),
(82,	6,	'2025-12-06 08:21:45',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x6014d7304596c'),
(83,	6,	'2025-12-06 08:22:36',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x6014d7304596c'),
(84,	6,	'2025-12-06 08:26:10',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x605321d81b76f'),
(85,	6,	'2025-12-06 08:28:18',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x607aa4c7bfe80'),
(86,	6,	'2025-12-06 08:29:40',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x6080788308908'),
(87,	6,	'2025-12-06 08:30:30',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x6080788308908'),
(88,	6,	'2025-12-06 08:32:49',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x607cc4161926f'),
(89,	6,	'2025-12-06 08:34:11',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x60876bce377d6'),
(90,	6,	'2025-12-06 08:36:30',	2,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	40000,	0,	160000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x725c55f56a27f'),
(91,	6,	'2025-12-06 08:50:31',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x60735186984cd'),
(92,	6,	'2025-12-06 09:32:05',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x6011b113d71e4'),
(93,	6,	'2025-12-06 09:48:38',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x5ffd26399d2b1'),
(94,	6,	'2025-12-06 09:58:07',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x60073f3d0d704'),
(95,	6,	'2025-12-06 10:03:11',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x600af76c01bde'),
(96,	6,	'2025-12-06 10:06:58',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x602720758fbca'),
(97,	6,	'2025-12-06 10:08:47',	2,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	40000,	0,	160000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x71ee691f7a318'),
(98,	6,	'2025-12-06 10:10:18',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	120000,	15000,	0,	135000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x601823e93a814'),
(100,	6,	'2025-12-06 10:36:52',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	99000,	15000,	0,	114000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x5115bb64a2d91'),
(101,	6,	'2025-12-06 10:41:59',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	99000,	15000,	0,	114000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x510cf05e41eaf'),
(102,	6,	'2025-12-06 10:46:16',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	99000,	15000,	0,	114000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x50faa589bd639'),
(103,	6,	'2025-12-06 10:51:06',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	99000,	15000,	0,	114000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x51060c9994d08'),
(104,	6,	'2025-12-06 10:57:42',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	99000,	15000,	0,	114000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x51111d14d68e3'),
(105,	6,	'2025-12-06 11:05:12',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	79000,	15000,	0,	94000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x42e0e545b3d41'),
(106,	6,	'2025-12-06 11:06:50',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	79000,	15000,	0,	94000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x42e384219faba'),
(107,	6,	'2025-12-06 11:11:03',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	79000,	15000,	0,	94000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x42cfc2662fc57'),
(108,	6,	'2025-12-06 11:22:47',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	150000,	15000,	0,	165000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x752c83f6e7107'),
(109,	6,	'2025-12-06 11:25:49',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	150000,	15000,	0,	165000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x75300aa0bc34f'),
(110,	6,	'2025-12-06 11:35:58',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	60000,	15000,	0,	75000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x353765c243e17'),
(111,	6,	'2025-12-06 11:39:07',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	55000,	15000,	0,	70000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x31b4ac5953383'),
(112,	6,	'2025-12-06 11:43:30',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	150000,	15000,	0,	165000,	'crypto',	'cancelled',	'Refunded',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x751ee712dcbd0'),
(113,	6,	'2025-12-06 11:45:39',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	100000,	15000,	0,	115000,	'crypto',	'delivered',	'Released',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x519263180ad03'),
(114,	6,	'2025-12-06 11:52:35',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	95000,	15000,	0,	110000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	'QmcBW9A3nRgqqmBBxkRx5REMFNLJgyyPmg4UaDYmjL5a8w',	'0x4dff946a98365'),
(115,	6,	'2025-12-06 13:52:31',	3,	'fffffffffffff, qqqqqqqqq, Quận 1, TP. Hồ Chí Minh',	NULL,	60000,	15000,	0,	75000,	'crypto',	'pending',	'Active',	'0x159d6026CDB1355646393277d542E954cC28F8bA',	NULL,	'0x353d1c3f13095');

DROP TABLE IF EXISTS `promotion_details`;
CREATE TABLE `promotion_details` (
  `promotion_id` int NOT NULL,
  `book_id` int NOT NULL,
  PRIMARY KEY (`promotion_id`,`book_id`),
  KEY `idx_promotion_id` (`promotion_id`),
  KEY `idx_book_id` (`book_id`),
  CONSTRAINT `promo_details_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promo_details_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `promotion_details` (`promotion_id`, `book_id`) VALUES
(1,	1),
(1,	2),
(1,	3),
(1,	4),
(1,	5),
(1,	6),
(1,	7),
(1,	8),
(1,	9),
(1,	10),
(1,	12),
(1,	14),
(1,	15),
(1,	16),
(1,	17),
(1,	18),
(1,	19),
(1,	20),
(1,	22);

DROP TABLE IF EXISTS `promotions`;
CREATE TABLE `promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('percent','fixed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `discount` decimal(10,0) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `promotions` (`id`, `name`, `type`, `discount`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
(1,	'iPhone',	'percent',	10,	'2025-10-19',	'2025-10-25',	'2025-10-19 02:40:36',	'2025-10-19 02:40:36');

DROP TABLE IF EXISTS `publishers`;
CREATE TABLE `publishers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `publishers` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1,	'NXB Kim Đồng',	'2025-07-18 12:59:18',	'2025-07-18 12:59:18'),
(2,	'NXB Trẻ',	'2025-07-18 12:59:18',	'2025-07-18 12:59:18'),
(3,	'NXB Giáo Dục Việt Nam',	'2025-07-18 12:59:18',	'2025-07-18 12:59:18'),
(4,	'NXB Văn Học',	'2025-07-18 12:59:18',	'2025-07-18 12:59:18'),
(5,	'NXB Khoa Học Kỹ Thuật',	'2025-07-18 12:59:18',	'2025-07-18 12:59:18'),
(6,	'NXB Thế Giới',	'2025-07-18 12:59:18',	'2025-07-18 12:59:18'),
(7,	'NXB Tổng Hợp TP.HCM',	'2025-07-18 12:59:18',	'2025-07-18 12:59:18'),
(8,	'NXB Lao Động',	'2025-07-18 12:59:18',	'2025-07-18 12:59:18'),
(9,	'NXB Công An Nhân Dân',	'2025-07-18 12:59:18',	'2025-07-18 12:59:18'),
(10,	'NXB Thanh Niên',	'2025-07-18 12:59:18',	'2025-07-18 12:59:18');

DROP TABLE IF EXISTS `ratings`;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_rating` (`user_id`,`book_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `ratings` (`id`, `user_id`, `book_id`, `rating`, `comment`, `created_at`) VALUES
(2,	5,	2,	5,	'sssssssss',	'2025-08-05 12:22:49');

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `roles` (`id`, `name`) VALUES
(1,	'admin'),
(4,	'enduser'),
(5,	'ordmanager'),
(6,	'shipper'),
(3,	'warehouse');

DROP TABLE IF EXISTS `rules`;
CREATE TABLE `rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `min_import_quantity` int NOT NULL,
  `min_stock_before_import` int NOT NULL,
  `max_promotion_duration` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `rules` (`id`, `min_import_quantity`, `min_stock_before_import`, `max_promotion_duration`) VALUES
(1,	7,	45,	30);

DROP TABLE IF EXISTS `shipping_methods`;
CREATE TABLE `shipping_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `delivery_time_days` int DEFAULT NULL,
  `fee` decimal(10,0) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `shipping_methods` (`id`, `name`, `description`, `delivery_time_days`, `fee`, `is_active`, `created_at`, `updated_at`) VALUES
(1,	'Giao tiêu chuẩn',	'Giao hàng từ 3-5 ngày làm việc',	5,	20000,	1,	'2025-07-13 08:29:31',	'2025-07-13 08:29:31'),
(2,	'Giao nhanh',	'Giao trong vòng 24h tại nội thành',	2,	40000,	1,	'2025-07-13 08:29:31',	'2025-07-13 08:29:31'),
(3,	'Giao tiết kiệm',	'Giao chậm nhưng rẻ hơn',	7,	15000,	1,	'2025-07-13 08:29:31',	'2025-07-13 08:29:31');

DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `suppliers` (`id`, `name`, `address`, `phone`, `email`, `created_at`, `updated_at`) VALUES
(1,	'Công ty Giấy Bảo An',	'Số 10, Đường Nguyễn Văn Linh, TP. Hải Phòng',	'0225-355-7890',	'lienhe@baoanpaper.vn',	'2025-01-02 02:00:00',	'2025-01-02 02:00:00'),
(2,	'Nhà cung cấp Thiết bị Học đường Minh Khoa',	'Số 3, Lê Duẩn, Hà Nội',	'024-3736-1234',	'minhkhoa@thietbihocduong.vn',	'2025-01-02 02:03:00',	'2025-01-02 02:03:00'),
(3,	'Văn phòng phẩm Hưng Thịnh',	'212 Nguyễn Trãi, Quận 5, TP.HCM',	'028-3845-6789',	'info@hungthinhvp.vn',	'2025-01-02 02:06:00',	'2025-01-02 02:06:00'),
(4,	'Công ty TNHH Sách & Thiết bị Alpha',	'45 Hoàng Văn Thụ, Đà Nẵng',	'0236-3799-456',	'alpha@suppliers.vn',	'2025-01-02 02:09:00',	'2025-01-02 02:09:00'),
(5,	'Công ty TNHH Thiết bị văn phòng Minh Khoa',	'190 Ngõ Nam Kỳ Khởi Nghĩa, TP. Hải Phòng',	'029-2869-2802',	'lienhe@minhkhoa.vn',	'2025-01-02 02:12:00',	'2025-01-02 02:12:00'),
(6,	'Nhà cung cấp In ấn Phú Quý',	'155 Đường Hai Bà Trưng, TP. Quy Nhơn, Bình Định',	'0297-3044-8864',	'lienhe@phqu.vn',	'2025-01-02 02:15:00',	'2025-01-02 02:15:00'),
(7,	'Doanh nghiệp VPP Bảo An',	'187 Phố Pasteur, TP. Long Xuyên, An Giang',	'024-8203-4521',	'lienhe@boan.vn',	'2025-01-02 02:18:00',	'2025-01-02 02:18:00'),
(8,	'Thiết bị giáo dục Hưng Thịnh',	'58 Ngõ Pasteur, TP. Vinh, Nghệ An',	'028-6671-6364',	'lienhe@hungthinh.vn',	'2025-01-02 02:21:00',	'2025-01-02 02:21:00'),
(9,	'Xưởng Bao bì Alpha',	'23 Ngõ Pasteur, TP. Huế, Thừa Thiên Huế',	'029-7776-3127',	'lienhe@alpha.vn',	'2025-01-02 02:24:00',	'2025-01-02 02:24:00'),
(10,	'Doanh nghiệp Thiết bị giáo dục Beta',	'99 Đường Hai Bà Trưng, TP. Hải Phòng',	'024-5138-3270',	'lienhe@beta.vn',	'2025-01-02 02:27:00',	'2025-01-02 02:27:00'),
(11,	'Xưởng Thiết bị giáo dục Omega',	'66 Đường Hai Bà Trưng, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-9039-5372',	'lienhe@omega.vn',	'2025-01-02 02:30:00',	'2025-01-02 02:30:00'),
(12,	'Văn phòng phẩm Hoàng Long',	'81 Phố Trần Hưng Đạo, TP. Huế, Thừa Thiên Huế',	'0234-1595-7581',	'lienhe@hoanglong.vn',	'2025-01-02 02:33:00',	'2025-01-02 02:33:00'),
(13,	'Công ty CP Dụng cụ học tập Phương Nam',	'86 Đường Nam Kỳ Khởi Nghĩa, TP. Rạch Giá, Kiên Giang',	'0297-8335-9496',	'lienhe@phuongnam.vn',	'2025-01-02 02:36:00',	'2025-01-02 02:36:00'),
(14,	'Nhà cung cấp Bao bì Đức Tín',	'116 Phố Hai Bà Trưng, TP. Đà Nẵng',	'0236-3481-2680',	'lienhe@ductin.vn',	'2025-01-02 02:39:00',	'2025-01-02 02:39:00'),
(15,	'Công ty TNHH Văn phòng phẩm Phú Quý',	'156 Đường Nguyễn Văn Linh, TP. Biên Hòa, Đồng Nai',	'0251-8149-9450',	'lienhe@phuquy.vn',	'2025-01-02 02:42:00',	'2025-01-02 02:42:00'),
(16,	'Doanh nghiệp Giấy Hưng Thịnh',	'164 Đường Nguyễn Văn Linh, TP. Biên Hòa, Đồng Nai',	'0251-8149-9450',	'lienhe@hungthinh.vn',	'2025-01-02 02:45:00',	'2025-01-02 02:45:00'),
(17,	'Xưởng Đồ dùng học sinh Alpha',	'133 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@alpha.vn',	'2025-01-02 02:48:00',	'2025-01-02 02:48:00'),
(18,	'Công ty TNHH Bao bì Thiên Long',	'52 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@thienlong.vn',	'2025-01-02 02:51:00',	'2025-01-02 02:51:00'),
(19,	'Công ty CP Dụng cụ học tập Nam Việt',	'166 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@namviet.vn',	'2025-01-02 02:54:00',	'2025-01-02 02:54:00'),
(20,	'Công ty TNHH VPP Đông Á',	'119 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@donga.vn',	'2025-01-02 02:57:00',	'2025-01-02 02:57:00'),
(21,	'Nhà cung cấp Thiết bị văn phòng Đại Phát',	'76 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@daiphat.vn',	'2025-01-02 03:00:00',	'2025-01-02 03:00:00'),
(22,	'Công ty CP Giấy Kim Liên',	'25 Hai Bà Trưng, Hoàn Kiếm, Hà Nội',	'024-4680-2998',	'lienhe@kimlien.vn',	'2025-01-02 03:03:00',	'2025-01-02 03:03:00'),
(23,	'Nhà cung cấp Sách Phú Quý',	'54 Hai Bà Trưng, Hoàn Kiếm, Hà Nội',	'024-4680-2998',	'lienhe@phuquy.vn',	'2025-01-02 03:06:00',	'2025-01-02 03:06:00'),
(24,	'Công ty TNHH Thiết bị giáo dục Phương Nam',	'86 Hai Bà Trưng, Hoàn Kiếm, Hà Nội',	'024-4680-2998',	'lienhe@phuongnam.vn',	'2025-01-02 03:09:00',	'2025-01-02 03:09:00'),
(25,	'Doanh nghiệp Văn phòng phẩm Đức Tín',	'89 Hai Bà Trưng, Hoàn Kiếm, Hà Nội',	'024-4680-2998',	'lienhe@ductin.vn',	'2025-01-02 03:12:00',	'2025-01-02 03:12:00'),
(26,	'Công ty CP In ấn Châu Á',	'37 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',	'024-4680-2998',	'lienhe@chaua.vn',	'2025-01-02 03:15:00',	'2025-01-02 03:15:00'),
(27,	'Nhà cung cấp VPP Kim Liên',	'48 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',	'024-4680-2998',	'lienhe@kimlienvn.vn',	'2025-01-02 03:18:00',	'2025-01-02 03:18:00'),
(28,	'Công ty TNHH Văn phòng phẩm Phú Quý',	'13 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',	'024-4680-2998',	'lienhe@phuquyvn.vn',	'2025-01-02 03:21:00',	'2025-01-02 03:21:00'),
(29,	'Doanh nghiệp Sách Đông Á',	'88 Pasteur, Quận 1, TP. Hồ Chí Minh',	'028-3827-1001',	'lienhe@donga.com.vn',	'2025-01-02 03:24:00',	'2025-01-02 03:24:00'),
(30,	'Công ty TNHH Giấy Tân Tiến',	'23 Phan Chu Trinh, Quận 1, TP. Hồ Chí Minh',	'028-3827-1001',	'lienhe@tantien.vn',	'2025-01-02 03:27:00',	'2025-01-02 03:27:00'),
(31,	'Công ty CP Thiết bị trường học Thành Công',	'73 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@thanhcong.vn',	'2025-01-02 03:30:00',	'2025-01-02 03:30:00'),
(32,	'Công ty TNHH Bao bì Tân Tiến',	'160 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@tantienbb.vn',	'2025-01-02 03:33:00',	'2025-01-02 03:33:00'),
(33,	'Nhà cung cấp In ấn Omega',	'130 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@omega.vn',	'2025-01-02 03:36:00',	'2025-01-02 03:36:00'),
(34,	'Xưởng Thiết bị giáo dục Đức Tín',	'60 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@ductin.com.vn',	'2025-01-02 03:39:00',	'2025-01-02 03:39:00'),
(35,	'Công ty CP Văn phòng phẩm Đông Á',	'151 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@vppdonga.vn',	'2025-01-02 03:42:00',	'2025-01-02 03:42:00'),
(36,	'Nhà cung cấp Văn hóa Phú Hưng',	'19 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@phuhungvn.vn',	'2025-01-02 03:45:00',	'2025-01-02 03:45:00'),
(37,	'Công ty CP Giấy An Bình',	'152 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@anbinhpaper.vn',	'2025-01-02 03:48:00',	'2025-01-02 03:48:00'),
(38,	'Công ty TNHH Dụng cụ học tập Sông Hồng',	'10 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@songhong.vn',	'2025-01-02 03:51:00',	'2025-01-02 03:51:00'),
(39,	'Doanh nghiệp In ấn Châu Á',	'15 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@chaua.com.vn',	'2025-01-02 03:54:00',	'2025-01-02 03:54:00'),
(40,	'Xưởng Bao bì Phú Quý',	'20 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@phuquyco.vn',	'2025-01-02 03:57:00',	'2025-01-02 03:57:00'),
(41,	'Công ty CP Sách & Thiết bị Công Thương',	'25 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@congthuongbook.vn',	'2025-01-02 04:00:00',	'2025-01-02 04:00:00'),
(42,	'Nhà cung cấp Văn phòng phẩm Thành Công',	'30 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@thanhcongvpp.vn',	'2025-01-02 04:03:00',	'2025-01-02 04:03:00'),
(43,	'Công ty TNHH Thiết bị văn phòng Châu Á',	'35 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@thietbichaua.vn',	'2025-01-02 04:06:00',	'2025-01-02 04:06:00'),
(44,	'Xưởng In ấn Việt Thắng',	'40 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@vietthangprint.vn',	'2025-01-02 04:09:00',	'2025-01-02 04:09:00'),
(45,	'Công ty CP VPP Đức Tín',	'45 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@ductinvpp.vn',	'2025-01-02 04:12:00',	'2025-01-02 04:12:00'),
(46,	'Nhà cung cấp Thiết bị trường học Đông Á',	'50 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@dongaschool.vn',	'2025-01-02 04:15:00',	'2025-01-02 04:15:00'),
(47,	'Công ty TNHH Giấy Hưng Thịnh',	'55 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@hungthinhpaper.vn',	'2025-01-02 04:18:00',	'2025-01-02 04:18:00'),
(48,	'Công ty CP Thiết bị trường học Nam Việt',	'60 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@namvietedu.vn',	'2025-01-02 04:21:00',	'2025-01-02 04:21:00'),
(49,	'Công ty TNHH In ấn Beta',	'65 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@beta.vn',	'2025-01-02 04:24:00',	'2025-01-02 04:24:00'),
(50,	'Doanh nghiệp Bao bì Omega',	'70 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@omega.vn',	'2025-01-02 04:27:00',	'2025-01-02 04:27:00'),
(51,	'Công ty CP Dụng cụ học sinh Minh Khoa',	'75 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@minhkhoaedu.vn',	'2025-01-02 04:30:00',	'2025-01-02 04:30:00'),
(52,	'Nhà cung cấp In ấn Thiên Long',	'80 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@thienlongprint.vn',	'2025-01-02 04:33:00',	'2025-01-02 04:33:00'),
(53,	'Công ty TNHH Văn phòng phẩm Kim Liên',	'85 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@kimlienvpp.vn',	'2025-01-02 04:36:00',	'2025-01-02 04:36:00'),
(54,	'Công ty CP Thiết bị Hoàng Long',	'90 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@hoanglongco.vn',	'2025-01-02 04:39:00',	'2025-01-02 04:39:00'),
(55,	'Xưởng In ấn An Bình',	'95 Nam Kỳ Khởi Nghĩa, Quận Bình Thạnh, TP. Hồ Chí Minh',	'028-2842-1639',	'lienhe@anbinhprint.vn',	'2025-01-02 04:42:00',	'2025-01-02 04:42:00'),
(56,	'Công ty CP Thiết bị văn phòng Ngọc Minh',	'228A Xuân Thủy, Hải Phòng',	'0225-240-4900',	'lienhe@minh.vn',	'2025-01-02 04:45:00',	'2025-01-02 04:45:00'),
(57,	'Công ty CP In ấn Tân Tiến',	'2 Nguyễn Thị Minh Khai, TP. Vinh, Nghệ An',	'0238-1229-025',	'lienhe@tien.vn',	'2025-01-02 04:48:00',	'2025-01-02 04:48:00'),
(58,	'Doanh nghiệp VPP Phú Quý',	'101 Kim Mã, TP. Quy Nhơn, Bình Định',	'0256-3700-876',	'lienhe@quy.vn',	'2025-01-02 04:51:00',	'2025-01-02 04:51:00'),
(59,	'Xưởng Văn phòng phẩm Bảo An',	'70 Kim Mã, Cầu Giấy, Hà Nội',	'024-7770-7755',	'lienhe@an.vn',	'2025-01-02 04:54:00',	'2025-01-02 04:54:00'),
(60,	'Doanh nghiệp Bao bì Minh Khoa',	'297 Lê Lợi, Đà Nẵng',	'0236-179-0940',	'lienhe@khoa.vn',	'2025-01-02 04:57:00',	'2025-01-02 04:57:00');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `role_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `phone`, `gender`, `role_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1,	'admin',	'123456',	'Bao Bao',	'admin@gmail.com',	'',	1,	1,	1,	'2025-01-01 01:00:00',	'2025-01-01 01:00:00'),
(3,	'warehouse1',	'$2b$10$sAgAAKU/x/324JT.mtV/M.RLPW7l5nFJrEdQKXiUrVcKT1djp0anW',	'BaoC',	'warehouse1@gmail.com',	'0282843582',	0,	3,	1,	'2025-01-01 01:20:00',	'2025-01-01 01:20:00'),
(4,	'warehouse2',	'$2b$10$DnXPR8xsPrp4lxe2ugdKY.dx8H6heNxVZPWN.BSWFEiXm4kpHA.Mm',	'Bao Baoa',	'warehouse2@gmail.com',	'0271927190',	0,	3,	1,	'2025-01-01 01:30:00',	'2025-01-01 01:30:00'),
(5,	'order',	'$2b$10$3lLRY.Y24snpj814CtIPVOMP8eSgnrKHVQYY8oL8dLqYgRF2A7m3y',	'abcd f',	'order@gmail.com',	'0183618342',	0,	5,	1,	'2025-07-11 14:00:29',	'2025-07-11 14:00:29'),
(6,	'customer',	'$2b$10$jN0SAOb//k6Au2eTkwu3NOjoWXiMtFCJ/A1900u8BGeTG0vmTCSSG',	'bbb',	'abcs@gmail.com',	'0372917211',	0,	4,	1,	'2025-07-11 14:09:07',	'2025-07-11 14:09:07'),
(7,	'shipper1',	'$2b$10$.ijibJLLkqeG62ZHm8VvSO.yZPqVyEU7wTk/DVqWpajTzr83NNr8m',	'Nguyễn Văn A',	'hoanam328@gmail.com',	'0271927199',	0,	6,	1,	'2025-07-15 14:30:59',	'2025-07-15 14:30:59'),
(15,	'shipper2',	'$2b$10$0QQX/68P.NJVPjAUCBtoF.DTg4a4u2mvWCOpvlcpHshr45kaeR0j6',	'Charlie',	'hoanam320@gmail.com',	'0271927198',	0,	6,	1,	'2025-07-15 15:27:37',	'2025-07-15 15:27:37');

DROP VIEW IF EXISTS `v_books_pricing`;
CREATE TABLE `v_books_pricing` (`id` int, `title` varchar(255), `author` varchar(255), `category_id` int, `publisher_id` int, `publication_year` int, `original_price` int, `quantity_in_stock` int, `description` text, `created_at` timestamp, `updated_at` timestamp, `discounted_price` decimal(25,4));


DROP TABLE IF EXISTS `v_books_pricing`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_books_pricing` AS select `b`.`id` AS `id`,`b`.`title` AS `title`,`b`.`author` AS `author`,`b`.`category_id` AS `category_id`,`b`.`publisher_id` AS `publisher_id`,`b`.`publication_year` AS `publication_year`,`b`.`price` AS `original_price`,`b`.`quantity_in_stock` AS `quantity_in_stock`,`b`.`description` AS `description`,`b`.`created_at` AS `created_at`,`b`.`updated_at` AS `updated_at`,(select (case when (`p_inner`.`type` = 'percent') then (`b`.`price` * (1 - (`p_inner`.`discount` / 100))) when (`p_inner`.`type` = 'fixed') then greatest(0,(`b`.`price` - `p_inner`.`discount`)) end) from (`promotions` `p_inner` join `promotion_details` `pd_inner` on((`p_inner`.`id` = `pd_inner`.`promotion_id`))) where ((`pd_inner`.`book_id` = `b`.`id`) and (curdate() between `p_inner`.`start_date` and `p_inner`.`end_date`))) AS `discounted_price` from `books` `b`;

-- 2025-12-06 13:57:02 UTC

