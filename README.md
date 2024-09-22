# File Metadata Microservice

This project is a File Metadata Microservice that allows users to upload files and retrieve their basic metadata details such as name, type, and size. The microservice is built using Express.js and Multer.

## Project Overview
The File Metadata Microservice provides an API where users can upload a file and receive its metadata in response. Users can submit files up to a maximum size of 10MB and are restricted from uploading potentially harmful file types (e.g., .exe, .zip, .rar). The microservice aims to demonstrate basic file handling and metadata extraction.

## Technologies Used
HTML5: Provides the structure of the webpage.
CSS3: Styles for layout and presentation.
JavaScript (Node.js with Express): Handles the server logic and API functionality.
Multer: Middleware for handling multipart/form-data for file uploads.
Node.js File System (fs): For creating and managing upload directories.