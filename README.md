# CRM Application - MERN Stack

A complete Customer Relationship Management system built with the MERN stack, featuring user authentication and customer management capabilities.

## Demo Video
[Click here to watch the application demo video](https://drive.google.com/drive/folders/1DqfEg7bajV9R7Y9k9zDXwRPX4b8UkE0x?usp=sharing) showing all features including user registration, login, customer management, and role-based access control.

## Assignment Requirements Fulfilled

### Project Structure & Organization
- Modular folder structure for both frontend and backend
- Separation of concerns with controllers, models, and routes
- Proper component organization in React

### Database Connectivity
- MongoDB integration with Mongoose ODM
- User and Customer data models
- Secure database operations

### User Authentication Implementation
- User registration and login system
- JWT token-based authentication
- Password encryption with bcrypt
- Protected routes and middleware

### Frontend Functionality
- Responsive React.js user interface
- Customer CRUD operations (Create, Read, Update, Delete)
- Role-based access control
- Form validation and error handling

### Documentation
- Comprehensive code documentation
- API endpoint documentation
- Setup and deployment instructions

## Features

### Authentication System
- User registration with email and password
- Secure login with JWT tokens
- Role-based authorization (Admin/User)
- Protected routes and API endpoints

### Customer Management
- Add new customers with complete details
- View customer list with search and filter
- Edit existing customer information
- Delete customers with confirmation
- Customer status tracking (Active/Inactive)

### User Experience
- Clean and intuitive user interface
- Responsive design for all devices
- Real-time form validation
- Loading states and error messages
- Navigation between different sections

## Technology Stack

**Frontend:** React.js, React Router, Axios, CSS3  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Authentication:** JWT, bcryptjs  
**Security:** CORS, environment variables

## Project Structure

The application follows a clean architecture with separate frontend and backend components, organized for scalability and maintainability.

## Security Features

- Password hashing with salt rounds
- JWT token expiration
- Route protection middleware
- Input validation and sanitization
- CORS configuration for cross-origin requests

## User Roles

**Admin Users:** Full access to all customer management features  
**Regular Users:** Read-only access to customer data

