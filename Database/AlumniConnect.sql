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
) ENGINE MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE Users (
	Username VARCHAR(100) NOT NULL PRIMARY KEY,
	Password VARCHAR(100) NOT NULL, 	
	Permissions VARCHAR(20) NOT NULL
) ENGINE InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE Alumni (
	ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	FullName VARCHAR(255) NOT NULL,
	Phone VARCHAR(30), -- this should avoid all odd formatting errors and extensions
	Email VARCHAR(100),
	Website VARCHAR(255),
	LinkedInURL VARCHAR(255),
	Bio VARCHAR(255) NOT NULL,
	Friends MEDIUMTEXT, -- as array of ID e.g. {1, 14, 19}
	PictureURL VARCHAR(255), --URL link to picture
	User_ID VARCHAR(100) NOT NULL,
	FOREIGN KEY (User_ID) REFERENCES Users(Username)
) ENGINE InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE WorkHistory (
	ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	Company VARCHAR(255) NOT NULL,
	Title VARCHAR(100) NOT NULL,
	Part_FullTime VARCHAR(20) NOT NULL,
	StartDate DATE NOT NULL,
	EndDate DATE, -- can be NULL if present position
	Description VARCHAR(255) NOT NULL,
	Alumni_ID INT,
	FOREIGN KEY (Alumni_ID) REFERENCES Alumni(ID)
) ENGINE InnoDB DEFAULT CHARSET=latin1;
