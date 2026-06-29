# 🌟 New Star Real Estate — Premium MERN Stack Web Application

Welcome to the New Star Real Estate project! This is a modern, full-stack luxury real estate web application built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS. It features a beautiful, dynamic public-facing website and a secure, fully-functional Admin Portal for managing properties and client enquiries.

---

## ✨ Features

### Public Website
- **Premium UI/UX**: Designed with rich aesthetics, glassmorphism, dynamic micro-animations, and a responsive layout for all devices.
- **Dark Mode Support**: Seamless toggle between stunning light and dark themes.
- **Dynamic Property Listings**: Browse verified properties directly from the MongoDB database, complete with filters, pricing, and amenities.
- **Enquiry System**: Prospective buyers can easily submit enquiries for specific properties or general contact forms.

### Secure Admin Portal
- **Dashboard**: A dedicated control center to manage the entire real estate portfolio.
- **Property Management**: Full CRUD capabilities. Add new listings, edit existing properties (including amenities, location, and pricing), and toggle their visibility on the public site.
- **Enquiry Management**: Track, review, and manage customer leads and contact requests.
- **Authentication**: Secured by JWT (JSON Web Tokens) to ensure only authorized administrators can modify database records.

---

## 🛠️ Technology Stack

- **Frontend**: React (with Vite), TypeScript, Tailwind CSS, Framer Motion (for animations), Lucide React (for icons).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas Cloud / Local).
- **Authentication**: JWT (JSON Web Tokens) and bcrypt.

---

## 🚀 Getting Started

Follow these steps to configure the environment, install dependencies, and run the application locally.

### Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB** (A local instance or a MongoDB Atlas URI)

### 1. Environment Configuration
The backend server relies on a `.env` file for configuration.
1. Navigate to the `/server` directory: `cd server`
2. Copy the example environment file: `cp .env.example .env`
3. Configure your `server/.env` file:
   - `MONGODB_URI`: Point to your MongoDB instance (e.g., your MongoDB Atlas connection string).
   - `JWT_SECRET`: A secure secret key for generating admin authentication tokens.
   - `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET`: (Optional) Configure if you want property image uploads to save to Cloudinary.

### 2. Install Dependencies
You must install dependencies for both the frontend (root directory) and backend (`/server` directory).
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 3. Seed the Database
To populate the database with the default admin user and sample properties, run the seed script from the `/server` directory:
```bash
npm run seed
```
*Note: This will clear existing collections (`users`, `properties`, `enquiries`) and load the mock data.*

### 4. Run the Application
Start both the backend server and the frontend client concurrently:

**Start the Backend Server (Port 5000)**
```bash
cd server
npm run dev
```

**Start the Frontend Client (Port 5173)**
Open a new terminal in the root directory:
```bash
npm run dev
```

Navigate to [http://localhost:5173](http://localhost:5173) in your browser to view the application!

---

## 🔐 Admin Dashboard Access
To access the luxury real estate control panel and manage listings:
1. Go to **[http://localhost:5173/admin](http://localhost:5173/admin)**
2. Sign in with the default administrator credentials (if you ran the seed script):
   - **Email**: `admin@newstar.com`
   - **Password**: `admin123`
# New-Star
