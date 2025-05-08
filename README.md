# JCI Mobile App

A mobile application for JCI (Junior Chamber International) members to manage their profiles and activities.

## Features

- User Registration and Login
- Profile Management
- Admin Dashboard
- User Approval System
- Profile Picture Upload

## Tech Stack

- Frontend: React Native with Expo
- Backend: Node.js with Express
- Database: MongoDB
- File Storage: Local storage with Multer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Expo CLI
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repository-url>
cd jci-app
```

2. Install dependencies:
```bash
# Install backend dependencies
cd jci-backend
npm install

# Install frontend dependencies
cd ../jci-app
npm install
```

3. Configure environment variables:
- Create a `.env` file in the backend directory
- Add necessary environment variables (MongoDB URI, etc.)

4. Start the backend server:
```bash
cd jci-backend
npm start
```

5. Start the frontend app:
```bash
cd jci-app
npm start
```

## Project Structure

```
jci-app/
├── app/                 # Frontend application code
├── assets/             # Images and other static assets
├── config/             # Configuration files
└── screens/            # Screen components

jci-backend/
├── models/             # Database models
├── routes/             # API routes
├── uploads/            # Uploaded files
└── server.js          # Main server file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 