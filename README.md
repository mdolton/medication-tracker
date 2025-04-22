# Medication Tracker

A web application for tracking medications and analyzing potential drug interactions using OpenAI's API.

## Features

- Create and manage medication profiles
- Add, edit, and delete medications
- Analyze potential drug interactions using AI
- Modern, responsive UI built with Material-UI

## Prerequisites

- Docker and Docker Compose
- OpenAI API key
- Node.js (for local development)

## Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd medication-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Edit the `.env` file and add your OpenAI API key:
```
OPENAI_API_KEY=your-api-key-here
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Docker Deployment

### Building and Running with Docker Compose

1. Create a `docker-compose.yml` file:
```bash
cp docker-compose.yml.example docker-compose.yml
```

2. Edit the `docker-compose.yml` file and add your OpenAI API key:
```
OPENAI_API_KEY=your-api-key-here
```

3. Create the database file:
```bash
touch database.sqlite
```

4. Build and start the containers:
```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`.

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for drug interaction analysis | Yes | - |
| `PORT` | Server port | No | 3000 |

### Docker Compose Commands

- Start the application:
```bash
docker-compose up
```

- Start in detached mode:
```bash
docker-compose up -d
```

- Stop the application:
```bash
docker-compose down
```

- View logs:
```bash
docker-compose logs -f
```

- Rebuild and restart:
```bash
docker-compose up --build
```

## API Endpoints

- `GET /api/profiles` - Get all profiles
- `POST /api/profiles` - Create a new profile
- `DELETE /api/profiles/:id` - Delete a profile
- `GET /api/profiles/:profileId/medications` - Get medications for a profile
- `POST /api/profiles/:profileId/medications` - Add a medication to a profile
- `DELETE /api/medications/:id` - Delete a medication
- `POST /api/check-interactions` - Analyze drug interactions

## Database

The application uses SQLite for data storage. The database file (`database.sqlite`) is mounted as a volume in the Docker container to persist data between container restarts.

## License

ISC 