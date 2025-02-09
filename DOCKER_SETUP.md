# Docker Setup Instructions

1. Install Docker and Docker Compose on your machine:
   - Windows/Mac: Install Docker Desktop from https://www.docker.com/products/docker-desktop
   - Linux: Follow instructions at https://docs.docker.com/engine/install/

2. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tritonfit
   ```

3. Create .env file:
   ```bash
   cp .env.example .env
   # Edit .env with your secure values
   ```

4. Start the services:
   ```bash
   docker-compose up -d
   ```

5. Access the services:
   - Backend API: http://localhost:8000
   - MongoDB Express: http://localhost:8081
     - Username: admin
     - Password: pass

6. View logs:
   ```bash
   docker-compose logs -f
   ```

7. Stop services:
   ```bash
   docker-compose down
   ```

## Development Workflow

1. Code changes in ./backend will automatically reload
2. Database data persists in docker volume
3. Access MongoDB Express to view/edit database

## Troubleshooting

1. If services don't start:
   ```bash
   docker-compose down -v
   docker-compose up -d --build
   ```

2. To reset database:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```