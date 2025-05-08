# JCI App Backend

## Overview
This is the backend for the JCI mobile application, built with Express.js and MongoDB.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jci-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jci-app
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints
- **User Registration:** `POST /api/users/register`
- **User Login:** `POST /api/users/login`
- **Admin Login:** `POST /api/admin/login`
- **Admin Approve User:** `PUT /api/admin/approve-user/:id`
- **Admin Reject User:** `PUT /api/admin/reject-user/:id`
- **Admin Upload Image:** `POST /api/images/upload`
- **Get All Images:** `GET /api/images`
- **Notify New User:** `POST /api/admin/notify-new-user`

## Download
Download the code as a zip file from the repository.

## License
MIT 