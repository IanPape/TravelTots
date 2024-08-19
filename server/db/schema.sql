CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create Folders table if it does not exist
CREATE TABLE IF NOT EXISTS Folders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Playgrounds table if it does not exist
CREATE TABLE IF NOT EXISTS Playgrounds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    map_link TEXT NOT NULL
);

-- Create Folder_Playgrounds table if it does not exist
CREATE TABLE IF NOT EXISTS Folder_Playgrounds (
    id SERIAL PRIMARY KEY,
    folder_id INT NOT NULL REFERENCES Folders(id),
    playground_id INT NOT NULL REFERENCES Playgrounds(id)
);