SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
CREATE DATABASE IF NOT EXISTS `monitor` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `monitor`;

CREATE TABLE `monitoredEndpoint` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `reationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastCheck` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `monitoredInterval` int(11) NOT NULL DEFAULT '1',
  `owner` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `monitoredEndpoint` (`id`, `name`, `url`, `reationDate`, `lastCheck`, `monitoredInterval`, `owner`) VALUES
(13, 'google', 'https://www.google.com', '2019-03-18 16:55:24', '2019-03-18 17:52:08', 1000, 127);

CREATE TABLE `monitoringResult` (
  `id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `statuseCode` smallint(6) NOT NULL,
  `payload` text,
  `monitoredEndpointId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `userName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `users` (`id`, `userName`, `email`, `token`, `password`) VALUES
(127, 'test', 'test@test.com', null, 'sha1$a3da6f8c$1$dc669a4c11b88963b400d900f43f5dee730cad7e');


ALTER TABLE `monitoredEndpoint`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_u` (`name`),
  ADD KEY `owner` (`owner`);

ALTER TABLE `monitoringResult`
  ADD KEY `monitoredEndpointId` (`monitoredEndpointId`),
  ADD KEY `id` (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `token` (`token`);


ALTER TABLE `monitoredEndpoint`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
ALTER TABLE `monitoringResult`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

ALTER TABLE `monitoredEndpoint`
  ADD CONSTRAINT `monitoredEndpoint_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `monitoringResult`
  ADD CONSTRAINT `monitoringResult_ibfk_1` FOREIGN KEY (`monitoredEndpointId`) REFERENCES `monitoredEndpoint` (`id`) ON DELETE CASCADE;
