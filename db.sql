
DROP TABLE IF EXISTS `files`;

CREATE TABLE `files` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `file_origianalname` varchar(100) DEFAULT NULL,
  `file_name` varchar(100) DEFAULT NULL,
  `mimetype` varchar(100) DEFAULT NULL,
  `size` int DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`file_id`)
)

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `frist_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
)