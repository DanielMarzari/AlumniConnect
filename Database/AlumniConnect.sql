CREATE DATABASE AlumniConnect;
USE AlumniConnect;
CREATE TABLE Events (
	ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	Color VARCHAR(10) NOT NULL, -- preset color names: blue, yellow, red, green, purple, orange
	Contact VARCHAR(255) NOT NULL, -- Email / Phone number
	Coordinator VARCHAR(100) NOT NULL,
	Cost INT NOT NULL, 
	Date_Time DATETIME NOT NULL,
	Description TEXT NOT NULL, 
	DurationH INT, -- Hours
	DurationD INT, -- Days
	Invitees VARCHAR(100) NOT NULL,
	Location TEXT NOT NULL,
	Name VARCHAR(255) NOT NULL
) ENGINE InnoDB DEFAULT CHARSET=latin1;

