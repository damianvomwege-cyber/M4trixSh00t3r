# M4trix Sh00t3r - Multiplayer Server

This is the Socket.io server for online multiplayer.

## Deploy to Render (Free)

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Set the following:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Click "Create Web Service"
6. Copy your URL (e.g., `https://m4trix-server.onrender.com`)
7. Update `SERVER_URL` in `game.js` with your URL

## Deploy to Railway (Free)

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo and the `server` folder
4. Railway will auto-detect Node.js
5. Copy your URL from the deployment
6. Update `SERVER_URL` in `game.js`

## Local Testing

```bash
cd server
npm install
npm start
```

Server runs on `http://localhost:3000`

For local testing, set `SERVER_URL` in game.js to:
```javascript
const SERVER_URL = "http://localhost:3000";
```

## API Endpoints

- `GET /` - Health check, returns lobby count and player count
- WebSocket events for real-time multiplayer
