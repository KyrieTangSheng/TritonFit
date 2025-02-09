# TritonFit
TritonFit: Fitness Connection & Workout Planning App

## Development Setup

### Prerequisites
1. **Backend**
    - Docker Desktop
    - Python 3.11+ (for local development without Docker)
2. **Frontend**
    - ```Wait for frontend team to fill this out```

### Getting Started
1. **Clone the repository:**
    ```bash
    git clone https://github.com/tritonfit/tritonfit.git
    cd tritonfit
    ```

2. **Setup environment variables:**
    ```bash
    cp .env.example .env
    ```

3. **Start the services:**
    ## Backend
    ```bash
    docker-compose up -d
    ```
    ## Frontend
    ```
    wait for frontend team to fill this out
    ```      
4. **Restart the services:**
    ```bash
    docker-compose down
    docker-compose up -d
    ```
    
### Accessing Services
1. **FastAPI Backend**
    - API Server: http://localhost:8000
    - Interactive API Documentation: http://localhost:8000/docs # you can also use this to test the APIs
2. **MongoDB Express Interface**
    - URL: http://localhost:8081
    - Default credentials:
      - Username: admin
      - Password: pass

### Troubleshooting Common Issues

1. **FastAPI Swagger UI Error**
   If you see a schema error in the local host:8000/docs endpoint:
   - Rebuild the containers: `docker-compose up -d --build`
   - If error persists, clear Docker cache: `docker-compose build --no-cache`

2. **MongoDB Express Not Accessible**
   If you can't access MongoDB Express at http://localhost:8081:
   - Check container status: `docker-compose ps`
   - View logs: `docker-compose logs mongo-express`
   - Ensure all containers are running: `docker-compose up -d`
   - Try restarting mongo-express: `docker-compose restart mongo-express`

3. **Container Logs**
   View logs for specific services:
   ```bash
   # Backend logs
   docker-compose logs backend
   
   # MongoDB logs
   docker-compose logs mongodb
   
   # Mongo Express logs
   docker-compose logs mongo-express
   ```