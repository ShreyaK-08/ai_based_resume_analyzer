# Deployment Guide

## Before You Deploy

- [ ] Add authentication to `GET /api/report/:id` (see [SECURITY.md](../SECURITY.md))
- [ ] Use a strong, unique `JWT_SECRET` in production
- [ ] Point `MONGO_URI` at a production MongoDB instance (e.g. Atlas)
- [ ] Update the CORS origin in `server/server.js` from `http://localhost:3000` to your production frontend URL
- [ ] Ensure `server/uploads/` is writable in your hosting environment, or switch to a cloud storage provider for uploaded files
- [ ] Set a production `GROQ_API_KEY` with appropriate rate limits for expected traffic

## Deploying the Server (Express API)

**Render / Railway / Fly.io**
1. Push this repository to GitHub
2. Create a new Web Service pointing at `server/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `server/.env.example` in the host's dashboard

**Docker (example)**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --omit=dev
COPY server/ .
EXPOSE 5000
CMD ["node", "server.js"]
```

## Deploying the Client (React)

Build a production bundle:
```bash
cd client
npm run build
```

Deploy the resulting `client/build/` folder to:
- **Vercel / Netlify** — set the build command to `npm run build` and publish directory to `build`
- **GitHub Pages** — serve `client/build/` as a static site
- Any static host or CDN

Update the API base URL used by the client (wherever `axios` calls are made) to point at your deployed server.

## Database

MongoDB Atlas is the easiest managed option — create a free cluster, whitelist your server's IP (or `0.0.0.0/0` for quick testing only), and use the provided connection string as `MONGO_URI`.
