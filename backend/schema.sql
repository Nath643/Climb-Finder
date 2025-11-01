-- Create the database
CREATE DATABASE IF NOT EXISTS `climbfinder`;

-- Use the database
USE `climbfinder`;

-- Create the table for completed climbs
CREATE TABLE IF NOT EXISTS `completedclimbs` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mountainId VARCHAR(50),
    date VARCHAR(50),
    duration VARCHAR(100),
    weather VARCHAR(50),
    companions TEXT
);

-- Insert two completed climbs
INSERT INTO `completedclimbs` (mountainId, date, duration, weather, companions)
VALUES
    ('helv', '2015-05-12', '2 hours 30 minutes', 'clear', 'Luke, Mike, Jill'),
    ('blen', '2016-06-08', '3 hours 55 minutes', 'cloudy', 'Bill, Cindy, John');
