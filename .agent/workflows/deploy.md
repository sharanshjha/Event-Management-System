---
description: Steps to deploy the Event Management System to a live environment (Render/Netlify)
---

# Deployment Workflow

Follow these steps to make your Event Management System live:

### 1. Database Setup (MongoDB Atlas)
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
- Create a new Project and a free Shared Cluster.
- Go to "Network Access" and "Allow Access from Anywhere" (0.0.0.0/0).
- Go to "Database Access" and create a user with a password.
- Click "Connect" -> "Drivers" to get your CONNECTION STRING.

### 2. Prepare Backend for Render
- In `server/server.js`, ensure you are using `path` to serve the frontend if you want to host them together, or keep them separate.
- In `server/.env`, you will need to set:
  - `MONGO_URI`: Your Atlas connection string.
  - `JWT_SECRET`: A strong random string.
  - `CLOUDINARY_CLOUD_NAME`: From your Cloudinary Dashboard.
  - `CLOUDINARY_API_KEY`: From your Cloudinary Dashboard.
  - `CLOUDINARY_API_SECRET`: From your Cloudinary Dashboard.
  - `PORT`: 5001.

### 3. Prepare Frontend
- Create a file `client/.env.production`.
- Add: `VITE_API_URL=https://your-backend-url.onrender.com/api`.

### 4. Deploy Backend (Render.com)
- Connect your GitHub repo to Render.
- Create a new "Web Service".
- Build Command: `npm install` (in server dir).
- Start Command: `node server.js`.
- Add Environment Variables in Render dashboard.

### 5. Deploy Frontend (Netlify or Render)
- If using Netlify: Connect GitHub, set Base directory to `client`, Build command `npm run build`, Publish directory `client/dist`.
- Add Environment Variables (`VITE_API_URL`).

### 6. Adding Products
- You should add products **after deployment**. 
- Local products stay in your local DB. Production is fresh.

### Pro-Tip: Permanent Images
Currently, images are stored in the server's local folder. For a professional live site, you should use **Cloudinary**. I can help you set that up if you want!
