# HelpDesk API

## Installation
```bash
npm install
```

## Configuration
Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

## Running
Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Testing

```bash
npm test
```

API Documentation
Base URL: http://localhost:3000/api/v1

Endpoints

GET /tickets - Get all tickets
POST /tickets - Create ticket
GET /tickets/:id - Get ticket by ID
PUT /tickets/:id - Update ticket
DELETE /tickets/:id - Delete ticket
POST /tickets/:id/comments - Add comment

