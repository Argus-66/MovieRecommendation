# Movie Recommendation System

A full-stack web application that provides movie recommendations based on user preferences and viewing history.

## Features

- Movie search functionality
- Personalized movie recommendations
- User authentication
- Movie details and ratings
- Similar movies suggestions

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT

## Local Development

1. Clone the repository
```bash
git clone <your-repo-url>
cd MovieRecommendation
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the backend server
```bash
npm run start:backend
```

5. Start the frontend development server
```bash
npm run dev
```

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install`
   - Start Command: `npm run start:backend`
4. Add environment variables:
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`

### Frontend Deployment (Render)

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add environment variables:
   - `VITE_API_URL` (your backend URL)

## Environment Variables

- `PORT`: Backend server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `VITE_API_URL`: Backend API URL (for frontend)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request# MovieRecommendation
