# Microservices Architecture - HR Management System

A complete microservices-based HR management system with authentication and employee management services.

## 🏗️ Architecture Overview

This project consists of multiple microservices orchestrated with Docker Compose and routed through an Nginx API gateway:

```
┌─────────────────────────────────────────────────────┐
│                   Nginx Gateway                      │
│                   (Port 80)                          │
└───────┬─────────────────────┬──────────────────┬────┘
        │                     │                  │
        │ /auth/*             │ /employees/*     │ /departments/*
        │                     │                  │
   ┌────▼─────┐         ┌────▼──────────────────▼────┐
   │  Auth    │         │    Employee Service         │
   │ Service  │         │      (Port 4001)            │
   │(Port 4000)│         │                             │
   └────┬─────┘         └─────────┬───────────────────┘
        │                         │
        │                         │
        │    ┌────────────────────▼──────────┐
        │    │      MongoDB                  │
        └────►  (Port 27017)                 │
             │  - auth_db                    │
             │  - employee_db                │
             └───────────────────────────────┘
```

## 📦 Services

### 1. Auth Service
- **Port**: 4000 (internal), accessed via `/auth/*` through nginx
- **Database**: `auth_db`
- **Features**:
  - User registration and login
  - JWT token generation (HMAC HS256)
  - Token refresh mechanism
  - Token introspection
  - User profile management

### 2. Employee Service
- **Port**: 4001 (internal), accessed via `/employees/*` and `/departments/*` through nginx
- **Database**: `employee_db`
- **Features**:
  - Employee CRUD operations
  - Department management
  - JWT authentication middleware
  - Protected endpoints

### 3. MongoDB
- **Port**: 27017
- **Databases**: 
  - `auth_db` - stores users and refresh tokens
  - `employee_db` - stores employees and departments

### 4. Nginx API Gateway
- **Port**: 80
- **Role**: Reverse proxy and API gateway
- **Routes**:
  - `/auth/*` → auth-service:4000
  - `/employees/*` → employee-service:4001
  - `/departments/*` → employee-service:4001

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js (v14+ for local development)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project
```

### 2. Environment Configuration

Create `.env` files for each service:

**auth-service/.env**:
```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://mongo:27017/auth_db
JWT_SECRET=change_me_secure_secret
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
```

**employee_service/.env**:
```env
PORT=4001
NODE_ENV=development
MONGO_URI=mongodb://mongo:27017/employee_db
JWT_SECRET=change_me_secure_secret
```

⚠️ **Important**: Both services must share the same `JWT_SECRET` for authentication to work.

### 3. Start All Services
```bash
docker compose up -d --build
```

### 4. Verify Services
```bash
# Check all containers are running
docker compose ps

# Check health endpoints
curl http://localhost/auth/health
curl http://localhost/employees/health
```

## 🧪 Testing

### Integration Tests

**Test Full Microservice Flow**:
```bash
node test-microservices.js
```

**Test Department Endpoints**:
```bash
node test-departments.js
```

### Manual API Testing

**1. Register a User**:
```bash
curl -X POST http://localhost/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**2. Login**:
```bash
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**3. Access Protected Endpoint**:
```bash
# Use the token from login response
curl -X GET http://localhost/employees \
  -H "Authorization: Bearer <your-token>"
```

## 📁 Project Structure

```
project/
├── auth-service/              # Authentication microservice
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── middlewares/      # Auth & validation
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # JWT & hashing utilities
│   │   └── validations/      # Input validators
│   ├── test/                 # Integration tests
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── employee_service/         # Employee management microservice
│   ├── src/
│   │   ├── configs/         # Database & general config
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # Auth & error handling
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   └── services/        # Business logic
│   ├── test/                # Integration & unit tests
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── docker/
│   └── nginx/
│       └── default.conf      # Nginx routing configuration
│
├── docker-compose.yml        # Orchestration config
├── test-microservices.js     # Integration test suite
├── test-departments.js       # Department endpoint tests
└── README.md                 # This file
```

## 🔐 Authentication Flow

1. **Registration**: User creates account → stored in `auth_db`
2. **Login**: User authenticates → receives JWT access token + refresh token
3. **API Request**: Client sends token in `Authorization: Bearer <token>` header
4. **Validation**: Employee service validates JWT using shared secret
5. **Access**: If valid, request proceeds; if invalid, returns 401 Unauthorized

## 🛠️ Development

### Running Services Locally (without Docker)

**Terminal 1 - MongoDB**:
```bash
docker run -d -p 27017:27017 --name mongo mongo:latest
```

**Terminal 2 - Auth Service**:
```bash
cd auth-service
npm install
# Update .env: MONGO_URI=mongodb://localhost:27017/auth_db
npm start
```

**Terminal 3 - Employee Service**:
```bash
cd employee_service
npm install
# Update .env: MONGO_URI=mongodb://localhost:27017/employee_db
npm start
```

### Useful Commands

```bash
# View logs for all services
docker compose logs -f

# View logs for specific service
docker compose logs -f auth-service
docker compose logs -f employee-service

# Restart a service
docker compose restart auth-service

# Rebuild and restart all services
docker compose up -d --build

# Stop all services
docker compose down

# Stop and remove volumes (clears database)
docker compose down -v
```

## 📊 API Documentation

### Auth Service (`/auth/*`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh access token | No |
| GET | `/auth/me` | Get current user profile | Yes |
| POST | `/auth/introspect` | Validate token | No |
| GET | `/auth/health` | Health check | No |

### Employee Service (`/employees/*`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/employees` | List all employees | Yes |
| POST | `/employees` | Create employee | Yes |
| GET | `/employees/:id` | Get employee by ID | Yes |
| PUT | `/employees/:id` | Update employee | Yes |
| DELETE | `/employees/:id` | Delete employee | Yes |
| GET | `/employees/health` | Health check | No |

### Department Service (`/departments/*`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/departments` | List all departments | Yes |
| POST | `/departments` | Create department | Yes |
| GET | `/departments/:id` | Get department by ID | Yes |
| PUT | `/departments/:id` | Update department | Yes |
| DELETE | `/departments/:id` | Delete department | Yes |

## 🔧 Configuration

### JWT Configuration
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret**: Shared between auth-service and employee-service
- **Access Token Expiry**: 1 hour
- **Refresh Token Expiry**: 7 days

⚠️ **Production Note**: For production, consider migrating to RS256 (asymmetric) with proper key management.

### Nginx Configuration
The nginx gateway handles:
- Request routing based on path prefixes
- CORS headers
- Proxy headers forwarding
- Connection keep-alive

## 🐛 Troubleshooting

### Services Won't Start
```bash
# Check if ports are already in use
netstat -ano | findstr :80
netstat -ano | findstr :27017

# Remove all containers and restart
docker compose down -v
docker compose up -d --build
```

### Authentication Fails
- Verify both services have the same `JWT_SECRET`
- Check token is sent in `Authorization: Bearer <token>` header
- Verify token hasn't expired

### Database Connection Issues
- Ensure MongoDB container is running: `docker compose ps`
- Check MongoDB logs: `docker compose logs mongo`
- Verify `MONGO_URI` uses `mongodb://mongo:27017` (not `localhost`)

### 404 Errors
- Check nginx routes in `docker/nginx/default.conf`
- Verify service is registered in `docker-compose.yml`
- Check service logs for errors

## 📝 Testing Checklist

- [ ] All containers start successfully
- [ ] Health endpoints return 200 OK
- [ ] User can register
- [ ] User can login and receive token
- [ ] Protected endpoints reject requests without token
- [ ] Protected endpoints accept valid tokens
- [ ] Employee CRUD operations work
- [ ] Department CRUD operations work
- [ ] Integration tests pass

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

[Add your license here]

## 🔗 Related Documentation

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [JWT Documentation](https://jwt.io/)
