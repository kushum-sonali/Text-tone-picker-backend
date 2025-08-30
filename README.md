# Backend - Tone Picker API

Node.js API server for text tone transformation using Mistral AI.

## Tech Stack

- **Node.js** + TypeScript
- **Express.js** - Web framework
- **Mistral AI** - Text transformation
- **Node-cache** - Request caching
- **Axios** - HTTP client

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp env.example .env

# Add your Mistral API key
MISTRAL_API_KEY=your_api_key_here

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## API Endpoints

### Transform Text Tone
```http
POST /api/transform-tone
Content-Type: application/json

{
  "text": "Your text here",
  "tone": "formal"
}
```

**Available Tones**: formal, casual, friendly, academic, creative, technical, persuasive, humorous, empathetic

### Health Check
```http
GET /health
```

## Environment Variables

```env
MISTRAL_API_KEY=your_mistral_api_key
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Features

- **Text Transformation** - AI-powered tone changes
- **Request Caching** - 1-hour TTL for responses
- **Rate Limiting** - 10 requests/minute per IP
- **Error Handling** - Comprehensive error responses
- **Input Validation** - Request sanitization

## Development

```bash
# Start with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production
npm start
```

## Project Structure

```
src/
├── routes/        # API endpoints
├── services/      # Business logic
├── middleware/    # Request processing
└── index.ts       # Server entry point
```

## Available Scripts

- `npm run dev` - Start with nodemon
- `npm run build` - Compile TypeScript
- `npm start` - Start production server

---

**Port**: 3001 (default)
