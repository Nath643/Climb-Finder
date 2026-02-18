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

INSERT INTO `completedclimbs` (mountainId, date, duration, weather, companions)
VALUES
    ('helv', '2015-05-12', '2 hours 30 minutes', 'clear', 'Luke, Mike, Jill'),
    ('blen', '2016-06-08', '3 hours 55 minutes', 'cloudy', 'Bill, Cindy, John');

-- Create planned climbs table
CREATE TABLE IF NOT EXISTS `plannedclimbs` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mountainId VARCHAR(50),                  
    date VARCHAR(50)                                     
);

INSERT INTO `plannedclimbs` (
    mountainId,
    date
) VALUES (
    'helv',
    '2017-06-12'
);

-- create users table
CREATE TABLE IF NOT EXISTS `users` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(50),
    password_hash VARCHAR(255),
    created_at TIMESTAMP,
    age INT,   
    name VARCHAR(50),                          
    transport JSON,                      
    gear JSON,                           
    fitness VARCHAR(50),                 
    lookingFor JSON,                     
    totalDistance INT,                   
    totalAltitude INT                    
);

INSERT INTO `users` (
    userId,
    password_hash,
    age,
    name,
    transport,
    gear,
    fitness,
    lookingFor,
    totalDistance,
    totalAltitude
) VALUES (
    'user-01',
    21,
    'Sample User',
    JSON_ARRAY('Car', 'Bike'),
    JSON_ARRAY('Waterproof-coat', 'Walking-boots', 'GPS'),
    'intermediate',
    JSON_ARRAY('Exercise', 'Views'),
    34,
    21
);

-- Create mountains table
CREATE TABLE IF NOT EXISTS `mountains` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mountainId VARCHAR(50),                  
    name VARCHAR(100),                           
    image TEXT,                          
    mapImage TEXT,                       
    height INT,                                  
    difficulty VARCHAR(50),                      
    views TEXT,                                  
    distance INT,                                
    mapEmbed TEXT,                               
    recommendedGear JSON,                        
    recommendedFitness VARCHAR(50),            
    recommendedTransport VARCHAR(50)             
);

INSERT INTO `mountains` (
    mountainId,
    name,
    image,
    mapImage,
    height,
    difficulty,
    views,
    distance,
    mapEmbed,
    recommendedGear,
    recommendedFitness,
    recommendedTransport
) VALUES (
    'helv',
    'Helvellyn',
    'mountain-images/helvellyn.png',
    'climb-route-maps/helvellyn-route-map.jpg',
    949,
    'medium',
    'a good view of most of the Lake District, from the central Lake District.',
    7,
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18475.64710328457!2d-3.026492494242575!3d54.527947844254896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487cc27e37923d2d%3A0x103c674a227ad7fe!2sHelvellyn!5e1!3m2!1sen!2sje!4v1740480931993!5m2!1sen!2sje" width="600" height="450" style="border: solid 1px rgb(113, 113, 113);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    JSON_ARRAY('Warm waterproof coat', 'Plenty of water', 'Comfortable walking shoes', 'Walking sticks'),
    'intermediate-strong',
    'car'
);

INSERT INTO `mountains` (
    mountainId,
    name,
    image,
    mapImage,
    height,
    difficulty,
    views,
    distance,
    mapEmbed,
    recommendedGear,
    recommendedFitness,
    recommendedTransport
) VALUES (
    'blen',
    'Blencathra',
    'mountain-images/blencathra.jpg',
    'climb-route-maps/blencathra-route-map.png',
    868,
    'medium',
    'a good view from the North of the Lake District, including a view of Derwent Water.',
    7.5,
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30986.56939796814!2d-3.0617744098989!3d54.64039564929313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487cddebbdfc81f5%3A0xfc3be10d8896d72a!2sBlencathra!5e1!3m2!1sen!2sje!4v1740478024889!5m2!1sen!2sje" width="600" height="450" style="border: solid 1px rgb(113, 113, 113);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    JSON_ARRAY('Warm waterproof coat', 'Plenty of water', 'Comfortable walking shoes'),
    'intermediate',
    'car'
),
(
    'scaf',
    'Scafell Pike',
    'mountain-images/scafell-pike.jpg',
    'climb-route-maps/scafell-pike-route-map.jpg',
    978,
    'medium',
    'a good view from the West of the Lake District, including a view of Wast Water.',
    7.5,
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22011.082737209654!2d-3.234866175685118!3d54.45412277841556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487cc63cd1537a41%3A0xe1eb6d7a17d6aee6!2sScafell%20Pike!5e1!3m2!1sen!2sje!4v1740481377679!5m2!1sen!2sje" width="600" height="450" style="border: solid 1px rgb(113, 113, 113);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    JSON_ARRAY('Warm waterproof coat', 'Plenty of water', 'Comfortable walking shoes', 'Walking sticks'),
    'intermediate-strong',
    'car'
),
(
    'benn',
    'Ben Nevis',
    'mountain-images/ben-nevis.jpg',
    'climb-route-maps/ben-nevis-route-map.png',
    1345,
    'hard',
    'a good view of much of the Highlands of Scotland, from the central Highlands.',
    10,
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d82929.91753399288!2d-5.006151227944132!3d56.79855765699705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x488932978af1e5f3%3A0x6e948b77ffad9a71!2sBen%20Nevis!5e1!3m2!1sen!2sje!4v1740481632312!5m2!1sen!2sje" width="600" height="450" style="border: solid 1px rgb(113, 113, 113);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    JSON_ARRAY('Warm waterproof coat', 'Plenty of water', 'Food', 'Comfortable walking shoes', 'Walking sticks'),
    'strong',
    'car'
),
(
    'cair',
    'Cairn Gorm',
    'mountain-images/cairn-gorm.jpg',
    'climb-route-maps/cairn-gorm-route-map.jpg',
    1244,
    'hard',
    'a good view of much of the Highlands of Scotland, from the Eastern Highlands.',
    11,
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d34611.45215813378!2d-3.633070525691525!3d57.07372282729801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4885f16d5a13bd13%3A0x1d0c681aff302210!2sCairn%20Gorm!5e1!3m2!1sen!2sje!4v1740482398868!5m2!1sen!2sje" width="600" height="450" style="border: solid 1px rgb(113, 113, 113);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    JSON_ARRAY('Warm waterproof coat', 'Plenty of water', 'Food', 'Comfortable walking shoes', 'Walking sticks'),
    'intermediate-strong',
    'car'
),
(
    'snow',
    'Snowdon',
    'mountain-images/snowdon.jpg',
    'climb-route-maps/snowdon-route-map.jpg',
    1085,
    'medium-hard',
    'a good view of much of the the North of Wales, including Snowdonia, from the North-West corner of Wales.',
    7.5,
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22749.527901784546!2d-4.0805168098520745!3d53.06860045265903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4865098216d283bd%3A0x7fe2ceeb3aa47434!2sYr%20Wyddfa!5e1!3m2!1sen!2sje!4v1740482689653!5m2!1sen!2sje" width="600" height="450" style="border: solid 1px rgb(113, 113, 113);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    JSON_ARRAY('Warm waterproof coat', 'Plenty of water', 'Comfortable walking shoes'),
    'intermediate',
    'car'
);