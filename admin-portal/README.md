# Admin Portal

A secure admin portal built with Node.js and Express.

## Features

- Secure login system
- Session-based authentication
- Protected admin routes
- Modern UI design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate a secure password hash:
```bash
node generate-password.js
```

3. Copy the generated hash and replace the `ADMIN_PASSWORD` value in `server.js`

4. Start the server:
```bash
node server.js
```

## Default Credentials

- Username: `admin`
- Password: `admin123` (change this in generate-password.js before generating the hash)

## Security Notes

- Change the default password immediately after first login
- In production, store credentials in a secure database
- Use HTTPS in production
- Change the session secret in production
- Consider implementing rate limiting
- Add additional security measures like 2FA for production use

## Development

The server runs on port 3000 by default. You can change this in the `.env` file.

## Production Deployment

Before deploying to production:

1. Change all default credentials
2. Set up proper environment variables
3. Enable HTTPS
4. Implement additional security measures
5. Use a proper session store (e.g., Redis)
6. Set up proper logging and monitoring 