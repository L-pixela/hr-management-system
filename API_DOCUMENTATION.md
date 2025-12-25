# API Documentation - HR Management Microservices

Complete API reference for the HR Management microservices system with request/response examples.

## 📋 Table of Contents
- [Base URLs](#base-urls)
- [Authentication](#authentication)
- [Auth Service API](#auth-service-api)
- [Employee Service API](#employee-service-api)
- [Department Service API](#department-service-api)
- [Performance Service API](#performance-service-api)
- [Error Responses](#error-responses)

---

## Base URLs

When running with Docker Compose:
- **Nginx Gateway**: `http://localhost`
- **Auth Service**: `http://localhost/auth`
- **Employee Service**: `http://localhost/employees`
- **Department Service**: `http://localhost/departments`
- **Performance Service**: `http://localhost/performance`

For local development (without Docker):
- **Auth Service**: `http://localhost:4000/auth`
- **Employee Service**: `http://localhost:4001/employees`
- **Department Service**: `http://localhost:4001/departments`
- **Performance Service**: `http://localhost:4002/performance`

---

## Authentication

Most endpoints require a JWT Bearer token in the `Authorization` header.

### How to Get a Token
1. Register a user via `POST /auth/register`
2. Login via `POST /auth/login` to receive an access token
3. Include token in subsequent requests: `Authorization: Bearer <token>`

### Token Format
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration
- **Access Token**: 1 hour
- **Refresh Token**: 7 days

---

## Auth Service API

### 1. Register User

Create a new user account.

**Endpoint**: `POST /auth/register`

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response**: `201 Created`
```json
{
  "email": "john.doe@example.com",
  "roles": ["EMPLOYEE"],
  "isLocked": false,
  "_id": "674a1b2c3d4e5f6g7h8i9j0k",
  "createdAt": "2025-12-25T10:30:00.000Z",
  "updatedAt": "2025-12-25T10:30:00.000Z"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### 2. Login

Authenticate user and receive access tokens.

**Endpoint**: `POST /auth/login`

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response**: `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzRhMWIyYzNkNGU1ZjZnN2g4aTlqMGsiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiRU1QTE9ZRUUiXSwiaWF0IjoxNjcyNDgxNDAwLCJleHAiOjE2NzI0ODUwMDB9.signature",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refreshPayload.signature"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### 3. Get Current User Profile

Retrieve the authenticated user's profile information.

**Endpoint**: `GET /auth/me`

**Authentication**: Required (Bearer token)

**Request Headers**:
```http
Authorization: Bearer <your-access-token>
```

**Success Response**: `200 OK`
```json
{
  "id": "674a1b2c3d4e5f6g7h8i9j0k",
  "email": "john.doe@example.com",
  "roles": ["EMPLOYEE"],
  "iat": 1672481400,
  "exp": 1672485000
}
```

**cURL Example**:
```bash
curl -X GET http://localhost/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4. Token Introspection

Validate a JWT token and retrieve its claims.

**Endpoint**: `POST /auth/introspect`

**Authentication**: Not required

**Request Body** (Option 1 - Body):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Headers** (Option 2 - Header):
```http
Authorization: Bearer <token-to-validate>
```

**Success Response** (Valid Token): `200 OK`
```json
{
  "active": true,
  "sub": "674a1b2c3d4e5f6g7h8i9j0k",
  "email": "john.doe@example.com",
  "roles": ["EMPLOYEE"],
  "iat": 1672481400,
  "exp": 1672485000
}
```

**Success Response** (Invalid Token): `200 OK`
```json
{
  "active": false
}
```

**cURL Example**:
```bash
curl -X POST http://localhost/auth/introspect \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

### 5. Health Check

Check if the auth service is running.

**Endpoint**: `GET /auth/health`

**Authentication**: Not required

**Success Response**: `200 OK`
```json
{
  "status": "ok"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost/auth/health
```

---

## Employee Service API

All employee endpoints require authentication.

### 1. Create Employee

Add a new employee to the system.

**Endpoint**: `POST /employees`

**Authentication**: Required (Bearer token)

**Request Headers**:
```http
Authorization: Bearer <your-access-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@company.com",
  "position": "Senior Software Engineer",
  "department": "674a1b2c3d4e5f6g7h8i9j0k",
  "dateOfJoining": "2025-01-15",
  "status": "active"
}
```

**Field Descriptions**:
- `name` (required): Full name of the employee
- `email` (required): Unique email address
- `position` (optional): Job title or position
- `department` (required): MongoDB ObjectId of the department
- `dateOfJoining` (optional): Date in ISO format
- `status` (optional): Either `"active"` or `"inactive"` (default: `"active"`)

**Success Response**: `201 Created`
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@company.com",
  "position": "Senior Software Engineer",
  "department": "674a1b2c3d4e5f6g7h8i9j0k",
  "dateOfJoining": "2025-01-15T00:00:00.000Z",
  "status": "active",
  "_id": "674a2b3c4d5e6f7g8h9i0j1k",
  "createdAt": "2025-12-25T11:00:00.000Z",
  "updatedAt": "2025-12-25T11:00:00.000Z",
  "__v": 0
}
```

**cURL Example**:
```bash
curl -X POST http://localhost/employees \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@company.com",
    "position": "Senior Software Engineer",
    "department": "674a1b2c3d4e5f6g7h8i9j0k",
    "dateOfJoining": "2025-01-15",
    "status": "active"
  }'
```

---

### 2. List All Employees

Retrieve a list of all employees.

**Endpoint**: `GET /employees`

**Authentication**: Required (Bearer token)

**Request Headers**:
```http
Authorization: Bearer <your-access-token>
```

**Success Response**: `200 OK`
```json
[
  {
    "_id": "674a2b3c4d5e6f7g8h9i0j1k",
    "name": "Jane Smith",
    "email": "jane.smith@company.com",
    "position": "Senior Software Engineer",
    "department": "674a1b2c3d4e5f6g7h8i9j0k",
    "dateOfJoining": "2025-01-15T00:00:00.000Z",
    "status": "active",
    "createdAt": "2025-12-25T11:00:00.000Z",
    "updatedAt": "2025-12-25T11:00:00.000Z",
    "__v": 0
  },
  {
    "_id": "674a3c4d5e6f7g8h9i0j1k2l",
    "name": "Bob Johnson",
    "email": "bob.johnson@company.com",
    "position": "DevOps Engineer",
    "department": "674a1b2c3d4e5f6g7h8i9j0k",
    "dateOfJoining": "2024-06-01T00:00:00.000Z",
    "status": "active",
    "createdAt": "2025-12-25T11:15:00.000Z",
    "updatedAt": "2025-12-25T11:15:00.000Z",
    "__v": 0
  }
]
```

**cURL Example**:
```bash
curl -X GET http://localhost/employees \
  -H "Authorization: Bearer <your-token>"
```

---

### 3. Get Employee by ID

Retrieve a specific employee's details.

**Endpoint**: `GET /employees/:id`

**Authentication**: Required (Bearer token)

**URL Parameters**:
- `id`: MongoDB ObjectId of the employee

**Request Headers**:
```http
Authorization: Bearer <your-access-token>
```

**Success Response**: `200 OK`
```json
{
  "_id": "674a2b3c4d5e6f7g8h9i0j1k",
  "name": "Jane Smith",
  "email": "jane.smith@company.com",
  "position": "Senior Software Engineer",
  "department": "674a1b2c3d4e5f6g7h8i9j0k",
  "dateOfJoining": "2025-01-15T00:00:00.000Z",
  "status": "active",
  "createdAt": "2025-12-25T11:00:00.000Z",
  "updatedAt": "2025-12-25T11:00:00.000Z",
  "__v": 0
}
```

**Error Response**: `404 Not Found`
```json
{
  "message": "Not found"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost/employees/674a2b3c4d5e6f7g8h9i0j1k \
  -H "Authorization: Bearer <your-token>"
```

---

### 4. Update Employee

Update an employee's information.

**Endpoint**: `PUT /employees/:id`

**Authentication**: Required (Bearer token)

**URL Parameters**:
- `id`: MongoDB ObjectId of the employee

**Request Headers**:
```http
Authorization: Bearer <your-access-token>
Content-Type: application/json
```

**Request Body** (all fields optional, send only what you want to update):
```json
{
  "name": "Jane Smith-Williams",
  "position": "Lead Software Engineer",
  "status": "active"
}
```

**Success Response**: `200 OK`
```json
{
  "_id": "674a2b3c4d5e6f7g8h9i0j1k",
  "name": "Jane Smith-Williams",
  "email": "jane.smith@company.com",
  "position": "Lead Software Engineer",
  "department": "674a1b2c3d4e5f6g7h8i9j0k",
  "dateOfJoining": "2025-01-15T00:00:00.000Z",
  "status": "active",
  "createdAt": "2025-12-25T11:00:00.000Z",
  "updatedAt": "2025-12-25T12:30:00.000Z",
  "__v": 0
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost/employees/674a2b3c4d5e6f7g8h9i0j1k \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Lead Software Engineer",
    "name": "Jane Smith-Williams"
  }'
```

---

### 5. Delete Employee

Remove an employee from the system.

**Endpoint**: `DELETE /employees/:id`

**Authentication**: Required (Bearer token)

**URL Parameters**:
- `id`: MongoDB ObjectId of the employee

**Request Headers**:
```http
Authorization: Bearer <your-access-token>
```

**Success Response**: `204 No Content`

(No response body)

**cURL Example**:
```bash
curl -X DELETE http://localhost/employees/674a2b3c4d5e6f7g8h9i0j1k \
  -H "Authorization: Bearer <your-token>"
```

---

### 6. Health Check

Check if the employee service is running.

**Endpoint**: `GET /employees/health`

**Authentication**: Not required

**Success Response**: `200 OK`
```json
{
  "status": "ok"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost/employees/health
```

---

## Department Service API

All department endpoints require authentication.

### 1. Create Department

Add a new department to the system.

**Endpoint**: `POST /departments`

**Authentication**: Required (Bearer token)

**Request Headers**:
```http
Authorization: Bearer <your-access-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Engineering",
  "description": "Software Development and Engineering Team",
  "status": "active"
}
```

**Field Descriptions**:
- `name` (required): Unique department name
- `description` (optional): Department description
- `status` (optional): Either `"active"` or `"inactive"` (default: `"active"`)

**Success Response**: `201 Created`
```json
{
  "name": "Engineering",
  "description": "Software Development and Engineering Team",
  "status": "active",
  "_id": "674a1b2c3d4e5f6g7h8i9j0k",
  "createdAt": "2025-12-25T10:00:00.000Z",
  "updatedAt": "2025-12-25T10:00:00.000Z",
  "__v": 0
}
```

**cURL Example**:
```bash
curl -X POST http://localhost/departments \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering",
    "description": "Software Development and Engineering Team",
    "status": "active"
  }'
```

---

### 2. List All Departments

Retrieve a list of all departments.

**Endpoint**: `GET /departments`

**Authentication**: Required (Bearer token)

**Request Headers**:
```http
Authorization: Bearer <your-access-token>
```

**Success Response**: `200 OK`
```json
[
  {
    "_id": "674a1b2c3d4e5f6g7h8i9j0k",
    "name": "Engineering",
    "description": "Software Development and Engineering Team",
    "status": "active",
    "createdAt": "2025-12-25T10:00:00.000Z",
    "updatedAt": "2025-12-25T10:00:00.000Z",
    "__v": 0
  },
  {
    "_id": "674a2c3d4e5f6g7h8i9j0k1l",
    "name": "Human Resources",
    "description": "HR and People Operations",
    "status": "active",
    "createdAt": "2025-12-25T10:05:00.000Z",
    "updatedAt": "2025-12-25T10:05:00.000Z",
    "__v": 0
  },
  {
    "_id": "674a3d4e5f6g7h8i9j0k1l2m",
    "name": "Sales",
    "description": "Sales and Business Development",
    "status": "active",
    "createdAt": "2025-12-25T10:10:00.000Z",
    "updatedAt": "2025-12-25T10:10:00.000Z",
    "__v": 0
  }
]
```

**cURL Example**:
```bash
curl -X GET http://localhost/departments \
  -H "Authorization: Bearer <your-token>"
```

---

### 3. Get Department by ID

Retrieve a specific department's details.

**Endpoint**: `GET /departments/:id`

**Authentication**: Required (Bearer token)

**URL Parameters**:
- `id`: MongoDB ObjectId of the department

**Request Headers**:
```http
Authorization: Bearer <your-access-token>
```

**Success Response**: `200 OK`
```json
{
  "_id": "674a1b2c3d4e5f6g7h8i9j0k",
  "name": "Engineering",
  "description": "Software Development and Engineering Team",
  "status": "active",
  "createdAt": "2025-12-25T10:00:00.000Z",
  "updatedAt": "2025-12-25T10:00:00.000Z",
  "__v": 0
}
```

**Error Response**: `404 Not Found`
```json
{
  "message": "Department not found"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost/departments/674a1b2c3d4e5f6g7h8i9j0k \
  -H "Authorization: Bearer <your-token>"
```

---

### 4. Update Department

Update a department's information.

**Endpoint**: `PUT /departments/:id`

**Authentication**: Required (Bearer token)

**URL Parameters**:
- `id`: MongoDB ObjectId of the department

**Request Headers**:
```http
Authorization: Bearer <your-access-token>
Content-Type: application/json
```

**Request Body** (all fields optional, send only what you want to update):
```json
{
  "name": "Engineering & Innovation",
  "description": "Software Development, R&D, and Innovation Team"
}
```

**Success Response**: `200 OK`
```json
{
  "_id": "674a1b2c3d4e5f6g7h8i9j0k",
  "name": "Engineering & Innovation",
  "description": "Software Development, R&D, and Innovation Team",
  "status": "active",
  "createdAt": "2025-12-25T10:00:00.000Z",
  "updatedAt": "2025-12-25T14:20:00.000Z",
  "__v": 0
}
```

**Error Response**: `404 Not Found`
```json
{
  "message": "Department not found"
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost/departments/674a1b2c3d4e5f6g7h8i9j0k \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering & Innovation",
    "description": "Software Development, R&D, and Innovation Team"
  }'
```

---

### 5. Delete Department

Remove a department from the system.

**Endpoint**: `DELETE /departments/:id`

**Authentication**: Required (Bearer token)

**URL Parameters**:
- `id`: MongoDB ObjectId of the department

**Request Headers**:
```http
Authorization: Bearer <your-access-token>
```

**Success Response**: `204 No Content`

(No response body)

**Error Response**: `404 Not Found`
```json
{
  "message": "Department not found"
}
```

**cURL Example**:
```bash
curl -X DELETE http://localhost/departments/674a1b2c3d4e5f6g7h8i9j0k \
  -H "Authorization: Bearer <your-token>"
```

---

## Error Responses

### Common Error Codes

| Status Code | Description |
|------------|-------------|
| `400` | Bad Request - Invalid input data |
| `401` | Unauthorized - Missing or invalid token |
| `404` | Not Found - Resource doesn't exist |
| `500` | Internal Server Error |

### Error Response Format

**401 Unauthorized**:
```json
{
  "message": "Unauthorized"
}
```

**400 Bad Request** (Validation Error):
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

**404 Not Found**:
```json
{
  "message": "Not found"
}
```

**500 Internal Server Error**:
```json
{
  "message": "Internal server error"
}
```

---

## Complete CRUD Workflow Example

### Scenario: Creating a complete employee record

**Step 1: Register & Login**
```bash
# Register
curl -X POST http://localhost/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@company.com", "password": "Admin123!"}'

# Login
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@company.com", "password": "Admin123!"}'

# Save the accessToken from response
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Step 2: Create a Department**
```bash
curl -X POST http://localhost/departments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering",
    "description": "Software Development Team"
  }'

# Save the department _id from response
export DEPT_ID="674a1b2c3d4e5f6g7h8i9j0k"
```

**Step 3: Create an Employee**
```bash
curl -X POST http://localhost/employees \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Developer",
    "email": "john.dev@company.com",
    "position": "Full Stack Developer",
    "department": "'$DEPT_ID'",
    "dateOfJoining": "2025-01-15",
    "status": "active"
  }'

# Save the employee _id from response
export EMP_ID="674a2b3c4d5e6f7g8h9i0j1k"
```

**Step 4: Read (Get Employee)**
```bash
curl -X GET http://localhost/employees/$EMP_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Step 5: Update Employee**
```bash
curl -X PUT http://localhost/employees/$EMP_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Senior Full Stack Developer"
  }'
```

**Step 6: List All Employees**
```bash
curl -X GET http://localhost/employees \
  -H "Authorization: Bearer $TOKEN"
```

**Step 7: Delete Employee**
```bash
curl -X DELETE http://localhost/employees/$EMP_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Postman Collection

You can import these endpoints into Postman by creating a new collection with the following structure:

1. Create environment variables:
   - `BASE_URL`: `http://localhost`
   - `TOKEN`: (set after login)
   - `DEPT_ID`: (set after creating department)
   - `EMP_ID`: (set after creating employee)

2. Set Authorization at collection level:
   - Type: Bearer Token
   - Token: `{{TOKEN}}`

3. Add all endpoints from this documentation

---Performance Service API

All Performance Service endpoints require authentication. Include JWT token in Authorization header.

### 📊 Performance Records Overview

Performance records track employee performance reviews with scores, comments, and status.

**Base Path**: `/performance`

---

### 1. Get All Performance Records

Get all performance records with optional filtering.

**GET** `/performance`

**Authentication**: Required (JWT)

**Query Parameters**:
- `employeeId` (optional): Filter by employee ID
- `status` (optional): Filter by status (draft, submitted, approved)
- `startDate` (optional): Filter by review date (ISO 8601 format)
- `endDate` (optional): Filter by review date (ISO 8601 format)

**Request Example**:
```bash
# Get all performance records
curl -X GET http://localhost/performance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get performance records for a specific employee
curl -X GET "http://localhost/performance?employeeId=EMP001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get approved performance records
curl -X GET "http://localhost/performance?status=approved" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get records within date range
curl -X GET "http://localhost/performance?startDate=2025-01-01&endDate=2025-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200)**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "676c1234567890abcdef1234",
      "employeeId": "EMP001",
      "reviewDate": "2025-12-25T10:00:00.000Z",
      "score": 85,
      "comment": "Excellent performance this quarter",
      "reviewedBy": "MGR001",
      "status": "approved",
      "createdAt": "2025-12-25T10:00:00.000Z",
      "updatedAt": "2025-12-25T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Performance Record by ID

Get a specific performance record by its ID.

**GET** `/performance/:id`

**Authentication**: Required (JWT)

**URL Parameters**:
- `id`: Performance record ID (MongoDB ObjectId)

**Request Example**:
```bash
curl -X GET http://localhost/performance/676c1234567890abcdef1234 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "676c1234567890abcdef1234",
    "employeeId": "EMP001",
    "reviewDate": "2025-12-25T10:00:00.000Z",
    "score": 85,
    "comment": "Excellent performance this quarter",
    "reviewedBy": "MGR001",
    "status": "approved",
    "createdAt": "2025-12-25T10:00:00.000Z",
    "updatedAt": "2025-12-25T10:00:00.000Z"
  }
}
```

**Error Response (404)**:
```json
{
  "success": false,
  "message": "Performance record not found"
}
```

---

### 3. Get Performance Records by Employee ID

Get all performance records for a specific employee.

**GET** `/performance/employee/:employeeId`

**Authentication**: Required (JWT)

**URL Parameters**:
- `employeeId`: Employee ID

**Request Example**:
```bash
curl -X GET http://localhost/performance/employee/EMP001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200)**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "676c1234567890abcdef1234",
      "employeeId": "EMP001",
      "reviewDate": "2025-12-25T10:00:00.000Z",
      "score": 85,
      "comment": "Q4 2025 Review",
      "reviewedBy": "MGR001",
      "status": "approved",
      "createdAt": "2025-12-25T10:00:00.000Z",
      "updatedAt": "2025-12-25T10:00:00.000Z"
    },
    {
      "_id": "676c1234567890abcdef5678",
      "employeeId": "EMP001",
      "reviewDate": "2025-09-25T10:00:00.000Z",
      "score": 82,
      "comment": "Q3 2025 Review",
      "reviewedBy": "MGR001",
      "status": "approved",
      "createdAt": "2025-09-25T10:00:00.000Z",
      "updatedAt": "2025-09-25T10:00:00.000Z"
    }
  ]
}
```

---

### 4. Create Performance Record

Create a new performance record.

**POST** `/performance`

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "employeeId": "EMP001",
  "score": 85,
  "comment": "Excellent performance this quarter. Met all objectives and exceeded expectations in key areas.",
  "reviewedBy": "MGR001",
  "status": "draft"
}
```

**Field Validations**:
- `employeeId` (required): Employee identifier
- `score` (required): Performance score (0-100)
- `comment` (optional): Review comments (max 1000 characters)
- `reviewedBy` (required): Reviewer identifier
- `status` (optional): Review status - draft, submitted, or approved (default: draft)

**Request Example**:
```bash
curl -X POST http://localhost/performance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "score": 85,
    "comment": "Excellent performance this quarter",
    "reviewedBy": "MGR001",
    "status": "draft"
  }'
```

**Success Response (201)**:
```json
{
  "success": true,
  "message": "Performance record created successfully",
  "data": {
    "_id": "676c1234567890abcdef1234",
    "employeeId": "EMP001",
    "reviewDate": "2025-12-25T10:00:00.000Z",
    "score": 85,
    "comment": "Excellent performance this quarter",
    "reviewedBy": "MGR001",
    "status": "draft",
    "createdAt": "2025-12-25T10:00:00.000Z",
    "updatedAt": "2025-12-25T10:00:00.000Z"
  }
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "message": "Employee ID, score, and reviewer are required"
}
```

---

### 5. Update Performance Record

Update an existing performance record.

**PUT** `/performance/:id`

**Authentication**: Required (JWT)

**URL Parameters**:
- `id`: Performance record ID (MongoDB ObjectId)

**Request Body** (all fields optional):
```json
{
  "score": 90,
  "comment": "Updated: Outstanding performance",
  "reviewedBy": "MGR002",
  "status": "approved"
}
```

**Request Example**:
```bash
curl -X PUT http://localhost/performance/676c1234567890abcdef1234 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 90,
    "status": "approved"
  }'
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Performance record updated successfully",
  "data": {
    "_id": "676c1234567890abcdef1234",
    "employeeId": "EMP001",
    "reviewDate": "2025-12-25T10:00:00.000Z",
    "score": 90,
    "comment": "Updated: Outstanding performance",
    "reviewedBy": "MGR002",
    "status": "approved",
    "createdAt": "2025-12-25T10:00:00.000Z",
    "updatedAt": "2025-12-25T11:30:00.000Z"
  }
}
```

**Error Response (404)**:
```json
{
  "success": false,
  "message": "Performance record not found"
}
```

---

### 6. Delete Performance Record

Delete a performance record by ID.

**DELETE** `/performance/:id`

**Authentication**: Required (JWT)

**URL Parameters**:
- `id`: Performance record ID (MongoDB ObjectId)

**Request Example**:
```bash
curl -X DELETE http://localhost/performance/676c1234567890abcdef1234 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Performance record deleted successfully"
}
```

**Error Response (404)**:
```json
{
  "success": false,
  "message": "Performance record not found"
}
```

---

### Performance Service - Response Codes Summary

| Status Code | Description |
|-------------|-------------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST) |
| 400 | Bad Request (Missing required fields) |
| 401 | Unauthorized (Invalid or missing JWT token) |
| 403 | Forbidden (Token expired) |
| 404 | Not Found (Record doesn't exist) |
| 500 | Server Error |

---

### Performance Service - Data Model

```javascript
{
  employeeId: String (required),
  reviewDate: Date (default: Date.now),
  score: Number (required, 0-100),
  comment: String (max: 1000 chars),
  reviewedBy: String (required),
  status: String (enum: ['draft', 'submitted', 'approved'], default: 'draft'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ employeeId: 1, reviewDate: -1 }` - For faster employee performance history queries

---

## 

## Rate Limiting & Security

- Rate limiting is configured in the auth service
- All endpoints use HTTPS in production
- JWT tokens are signed with HS256 (shared secret)
- Passwords are hashed using bcrypt
- CORS is enabled for cross-origin requests

---

## Support & Contact

For issues or questions:
- Create an issue in the repository
- Contact the development team

**Last Updated**: December 25, 2025
