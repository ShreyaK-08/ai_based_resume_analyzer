# Installation Guide

## Prerequisites

- [Node.js 18+](https://nodejs.org/) and npm
- [MongoDB](https://www.mongodb.com/) — local install or a free [Atlas](https://www.mongodb.com/atlas) cluster
- A [Groq API key](https://console.groq.com/keys)

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/ai_based_analyzer.git
cd ai_based_analyzer
```

## 2. Set Up the Server

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` with your own values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

## 3. Set Up the Client

```bash
cd ../client
npm install
```

## 4. Run Both

In one terminal:
```bash
cd server
npm run dev
```

In a second terminal:
```bash
cd client
npm start
```

## 5. Verify the Installation

- Visit `http://localhost:3000` — you should see the ResumeAI landing page
- Sign up for an account
- Upload a resume and job description PDF on the **Analyze** page and confirm you receive a result

## Troubleshooting

See [README.md → Known Limitations](../README.md#known-limitations) for documented gaps and setup-relevant caveats.
