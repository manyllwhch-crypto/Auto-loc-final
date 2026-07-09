CREATE DATABASE autoloc;

USE autoloc;

CREATE TABLE users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    fullname VARCHAR(100),

    email VARCHAR(255) UNIQUE,

    password VARCHAR(255),

    role ENUM('user','admin')
    DEFAULT 'user',

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cars (

    id INT AUTO_INCREMENT PRIMARY KEY,

    brand VARCHAR(50),

    model VARCHAR(100),

    description TEXT,

    price_per_day DECIMAL(10,2),

    seats INT,

    fuel VARCHAR(50),

    gearbox VARCHAR(50),

    image_url VARCHAR(255),

    available BOOLEAN DEFAULT TRUE
);

CREATE TABLE reservations (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    car_id INT,

    start_date DATE,

    end_date DATE,

    pickup_location VARCHAR(255),

    total_price DECIMAL(10,2),

    status ENUM(
        'pending',
        'confirmed',
        'cancelled'
    ) DEFAULT 'pending',

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id),

    FOREIGN KEY (car_id)
    REFERENCES cars(id)
);