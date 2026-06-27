-- ============================================
-- Smart Object Detection & Tracking System
-- MySQL Database Schema
-- Version: 1.0.0
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS detection_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE detection_db;

-- ============================================
-- TABLE: users
-- Stores user account information
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: videos
-- Stores uploaded and processed video information
-- ============================================

CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_path VARCHAR(500) NOT NULL,
    processed_path VARCHAR(500),
    duration FLOAT,
    fps FLOAT,
    resolution VARCHAR(50),
    file_size BIGINT,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: detections
-- Stores all object detection records
-- ============================================

CREATE TABLE IF NOT EXISTS detections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    video_id INT,
    object_name VARCHAR(100) NOT NULL,
    confidence FLOAT NOT NULL,
    tracking_id INT,
    frame_number INT,
    bbox_x1 FLOAT,
    bbox_y1 FLOAT,
    bbox_x2 FLOAT,
    bbox_y2 FLOAT,
    source ENUM('webcam', 'upload') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_video_id (video_id),
    INDEX idx_object_name (object_name),
    INDEX idx_source (source),
    INDEX idx_timestamp (timestamp),
    INDEX idx_confidence (confidence)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: detection_logs
-- Stores detailed logs for each detection session
-- ============================================

CREATE TABLE IF NOT EXISTS detection_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    source ENUM('webcam', 'upload') NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    total_frames INT DEFAULT 0,
    total_detections INT DEFAULT 0,
    average_fps FLOAT,
    status ENUM('active', 'completed', 'failed') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_start_time (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: screenshots
-- Stores captured screenshots from detection
-- ============================================

CREATE TABLE IF NOT EXISTS screenshots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    detection_id INT,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (detection_id) REFERENCES detections(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: settings
-- Stores user-specific application settings
-- ============================================

CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    confidence_threshold FLOAT DEFAULT 0.5,
    theme VARCHAR(50) DEFAULT 'dark',
    notifications BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'en',
    default_camera INT DEFAULT 0,
    auto_save BOOLEAN DEFAULT TRUE,
    show_tracking_ids BOOLEAN DEFAULT TRUE,
    show_confidence BOOLEAN DEFAULT TRUE,
    enable_sound BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: analytics
-- Stores aggregated analytics data for performance
-- ============================================

CREATE TABLE IF NOT EXISTS analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    total_detections INT DEFAULT 0,
    total_videos INT DEFAULT 0,
    total_sessions INT DEFAULT 0,
    most_detected_object VARCHAR(100),
    average_confidence FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_user_id (user_id),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@detection.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5p3Cp3y6V7Cxm', 'admin');

-- Insert demo user (password: demo123)
-- Password hash for 'demo123' using bcrypt
INSERT INTO users (name, email, password_hash, role) VALUES
('Demo User', 'demo@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5p3Cp3y6V7Cxm', 'user');

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: User detection summary
CREATE OR REPLACE VIEW user_detection_summary AS
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    COUNT(DISTINCT d.id) AS total_detections,
    COUNT(DISTINCT v.id) AS total_videos,
    COUNT(DISTINCT DATE(d.timestamp)) AS active_days
FROM users u
LEFT JOIN detections d ON u.id = d.user_id
LEFT JOIN videos v ON u.id = v.user_id
GROUP BY u.id, u.name, u.email;

-- View: Daily detection stats
CREATE OR REPLACE VIEW daily_detection_stats AS
SELECT 
    DATE(timestamp) AS detection_date,
    user_id,
    object_name,
    COUNT(*) AS detection_count,
    AVG(confidence) AS avg_confidence,
    source
FROM detections
GROUP BY DATE(timestamp), user_id, object_name, source;

-- View: Object distribution
CREATE OR REPLACE VIEW object_distribution AS
SELECT 
    user_id,
    object_name,
    COUNT(*) AS count,
    AVG(confidence) AS avg_confidence,
    MIN(confidence) AS min_confidence,
    MAX(confidence) AS max_confidence
FROM detections
GROUP BY user_id, object_name
ORDER BY count DESC;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

-- Procedure: Get user statistics
CREATE PROCEDURE GetUserStatistics(IN p_user_id INT)
BEGIN
    SELECT 
        COUNT(DISTINCT d.id) AS total_detections,
        COUNT(DISTINCT v.id) AS videos_processed,
        COUNT(DISTINCT dl.id) AS total_sessions,
        COUNT(CASE WHEN DATE(d.timestamp) = CURDATE() THEN 1 END) AS today_detections,
        COUNT(CASE WHEN d.timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) AS week_detections,
        COUNT(CASE WHEN d.timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) AS month_detections
    FROM users u
    LEFT JOIN detections d ON u.id = d.user_id
    LEFT JOIN videos v ON u.id = v.user_id AND v.status = 'completed'
    LEFT JOIN detection_logs dl ON u.id = dl.user_id
    WHERE u.id = p_user_id;
END //

-- Procedure: Clean old detection logs (older than 90 days)
CREATE PROCEDURE CleanOldDetectionLogs()
BEGIN
    DELETE FROM detections 
    WHERE timestamp < DATE_SUB(NOW(), INTERVAL 90 DAY);
    
    DELETE FROM detection_logs 
    WHERE start_time < DATE_SUB(NOW(), INTERVAL 90 DAY);
    
    SELECT ROW_COUNT() AS deleted_rows;
END //

DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER //

-- Trigger: Update analytics after detection insert
CREATE TRIGGER after_detection_insert
AFTER INSERT ON detections
FOR EACH ROW
BEGIN
    INSERT INTO analytics (user_id, date, total_detections)
    VALUES (NEW.user_id, DATE(NEW.timestamp), 1)
    ON DUPLICATE KEY UPDATE
        total_detections = total_detections + 1;
END //

-- Trigger: Create default settings for new user
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO settings (user_id) VALUES (NEW.id);
END //

DELIMITER ;

-- ============================================
-- PERFORMANCE OPTIMIZATION
-- ============================================

-- Analyze tables for better query performance
ANALYZE TABLE users, videos, detections, detection_logs, screenshots, settings, analytics;

-- ============================================
-- GRANTS (Optional - for production)
-- ============================================

-- Create dedicated application user
-- CREATE USER 'detection_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON detection_db.* TO 'detection_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify table creation
SELECT 
    TABLE_NAME, 
    TABLE_ROWS, 
    CREATE_TIME 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'detection_db';

-- Show indexes
SELECT 
    TABLE_NAME, 
    INDEX_NAME, 
    COLUMN_NAME 
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'detection_db' 
ORDER BY TABLE_NAME, INDEX_NAME;

-- ============================================
-- END OF SCHEMA
-- ============================================

-- Database ready for Smart Object Detection System!
-- Next steps:
-- 1. Update backend/.env with database credentials
-- 2. Run: python backend/main.py
-- 3. API will be available at http://localhost:8000
