# WandroApp

## Overview
WandroApp is a web-based platform designed for adding hotel listings and booking accommodations. It provides a **scalable backend**, **secure authentication**, and a **responsive frontend** to deliver an optimal user experience. The platform also includes **review and rating features** for hotels and supports **image uploads** using Multer and Cloudinary.

## Live Demo
🔗 [WandroApp Live](https://wandroapp.onrender.com/listings)

🔗 [GitHub Repository](https://github.com/kumar-gopal/wandroApp)

## Features
- **Hotel Listings**: Users can add, view, and manage hotel listings.
- **Booking System**: Seamless accommodation booking with real-time updates.
- **Secure Authentication**: Role-based access control using Passport.js.
- **Optimized Performance**: Reduced transaction processing times by 75%.
- **Responsive UI**: Fully optimized for various devices using Bootstrap.
- **Reviews & Ratings**: Users can add and view hotel reviews and ratings.
- **Image Uploads**: Uses Multer and Cloudinary for storing and retrieving images.

## Tech Stack
### Backend
- **Node.js**: Server-side runtime
- **Express.js**: Web framework for routing and middleware
- **MongoDB**: NoSQL database for storing hotel and booking data

### Frontend
- **EJS**: Template engine for dynamic content rendering
- **Bootstrap**: Responsive design framework
- **HTML, CSS, JavaScript**: Core frontend technologies

### Security & Optimization
- **Passport.js**: Secure user authentication and authorization
- **Mongoose**: ODM for MongoDB
- **BCrypt**: Password hashing for enhanced security
- **Multer & Cloudinary**: Image upload and storage solutions

## Installation & Setup
To run WandroApp locally, follow these steps:

### Prerequisites
- Node.js installed
- MongoDB installed or use a cloud database (MongoDB Atlas)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/kumar-gopal/wandroApp.git
   cd wandroApp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to `http://localhost:5000`

## API Endpoints
### Authentication
- `POST /register` - Register a new user
- `POST /login` - Authenticate and receive a token

### Hotels
- `GET /listings` - Retrieve all hotel listings
- `POST /listings` - Add a new hotel listing (admin/vendor only)
- `PUT /listings/:id` - Update hotel details (admin/vendor only)
- `DELETE /listings/:id` - Remove a hotel listing (admin/vendor only)

### Booking
- `POST /bookings` - Create a new booking
- `GET /bookings` - Retrieve user bookings
- `DELETE /bookings/:id` - Cancel a booking

### Reviews & Ratings
- `POST /reviews` - Add a new review
- `GET /reviews/:hotel_id` - Retrieve reviews for a specific hotel
- `DELETE /reviews/:id` - Remove a review (admin only)

### Image Upload
- `POST /upload` - Upload a hotel image (secured with authentication)

## Deployment
WandroApp is deployed on **Render** with the following services:
- **Backend**: Hosted on Render
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary

## Future Enhancements
- Payment gateway integration
- Advanced search and filtering

## Contact
For any inquiries, reach out via:
- 📧 Email: contactkrgopal@gmail.com
- 🔗 LinkedIn: [linkedin.com/in/krgopal7](https://www.linkedin.com/in/krgopal7/)
- 🛠 GitHub: [github.com/kumar-gopal](https://github.com/kumar-gopal)

