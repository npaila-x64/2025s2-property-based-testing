# API Documentation

## User CRUD REST API

Base URL: `http://localhost:3000`

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Error Responses](#error-responses)
- [Endpoints](#endpoints)
  - [Create User](#create-user)
  - [Get All Users](#get-all-users)
  - [Get User by ID](#get-user-by-id)
  - [Update User](#update-user)
  - [Delete User](#delete-user)
- [Data Models](#data-models)

---

## Authentication

Currently, this API does not require authentication. All endpoints are publicly accessible.

---

## Error Responses

### Standard Error Format

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Endpoints

### Create User

Creates a new user in the system.

**Endpoint:** `POST /users`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required, unique, valid email)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "age": "number (required, positive integer)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "age": 30
  }'
```

**Success Response:**

```json
Status: 201 Created

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "age": 30,
  "createdAt": "2025-10-06T10:00:00.000Z",
  "updatedAt": "2025-10-06T10:00:00.000Z"
}
```

**Error Responses:**

```json
Status: 400 Bad Request
{
  "statusCode": 400,
  "message": "User with this email already exists"
}
```

```json
Status: 400 Bad Request
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "age must be a positive number"
  ],
  "error": "Bad Request"
}
```

---

### Get All Users

Retrieves a list of all users.

**Endpoint:** `GET /users`

**Request Headers:** None required

**Query Parameters:** None

**Example Request:**
```bash
curl http://localhost:3000/users
```

**Success Response:**

```json
Status: 200 OK

[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "age": 30,
    "createdAt": "2025-10-06T10:00:00.000Z",
    "updatedAt": "2025-10-06T10:00:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "email": "jane.smith@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "age": 25,
    "createdAt": "2025-10-06T10:05:00.000Z",
    "updatedAt": "2025-10-06T10:05:00.000Z"
  }
]
```

**Empty Response:**
```json
Status: 200 OK

[]
```

---

### Get User by ID

Retrieves a specific user by their ID.

**Endpoint:** `GET /users/:id`

**Path Parameters:**
- `id` (string, required) - The UUID of the user

**Example Request:**
```bash
curl http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000
```

**Success Response:**

```json
Status: 200 OK

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "age": 30,
  "createdAt": "2025-10-06T10:00:00.000Z",
  "updatedAt": "2025-10-06T10:00:00.000Z"
}
```

**Error Response:**

```json
Status: 404 Not Found

{
  "statusCode": 404,
  "message": "User not found"
}
```

---

### Update User

Updates an existing user's information. Only provided fields will be updated.

**Endpoint:** `PUT /users/:id`

**Path Parameters:**
- `id` (string, required) - The UUID of the user

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (optional, unique, valid email)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "age": "number (optional, positive integer)"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "age": 31
  }'
```

**Success Response:**

```json
Status: 200 OK

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "age": 31,
  "createdAt": "2025-10-06T10:00:00.000Z",
  "updatedAt": "2025-10-06T10:30:00.000Z"
}
```

**Error Responses:**

```json
Status: 404 Not Found

{
  "statusCode": 404,
  "message": "User not found"
}
```

```json
Status: 400 Bad Request

{
  "statusCode": 400,
  "message": "Email already in use"
}
```

---

### Delete User

Deletes a user from the system.

**Endpoint:** `DELETE /users/:id`

**Path Parameters:**
- `id` (string, required) - The UUID of the user

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000
```

**Success Response:**

```
Status: 204 No Content

(No body returned)
```

**Error Response:**

```json
Status: 404 Not Found

{
  "statusCode": 404,
  "message": "User not found"
}
```

---

## Data Models

### User

```typescript
{
  id: string;          // UUID v4
  email: string;       // Valid email address, unique
  firstName: string;   // User's first name
  lastName: string;    // User's last name
  age: number;         // Positive integer
  createdAt: Date;     // ISO 8601 timestamp
  updatedAt: Date;     // ISO 8601 timestamp
}
```

### Validation Rules

#### Email
- Must be a valid email format
- Must be unique across all users
- Required for user creation
- Optional for user updates

#### First Name
- Must be a non-empty string
- Required for user creation
- Optional for user updates

#### Last Name
- Must be a non-empty string
- Required for user creation
- Optional for user updates

#### Age
- Must be a positive integer (greater than or equal to 0)
- Required for user creation
- Optional for user updates

---

## Testing the API

### Using cURL

```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test","lastName":"User","age":25}'

# Get all users
curl http://localhost:3000/users

# Get user by ID
curl http://localhost:3000/users/{user-id}

# Update user
curl -X PUT http://localhost:3000/users/{user-id} \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Updated","age":26}'

# Delete user
curl -X DELETE http://localhost:3000/users/{user-id}
```

### Using Postman

1. Import the endpoints as a Postman collection
2. Set the base URL to `http://localhost:3000`
3. Use the documented request/response formats

### Using HTTPie

```bash
# Create a user
http POST localhost:3000/users email=test@example.com firstName=Test lastName=User age:=25

# Get all users
http GET localhost:3000/users

# Update user
http PUT localhost:3000/users/{user-id} firstName=Updated age:=26

# Delete user
http DELETE localhost:3000/users/{user-id}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use.

---

## Versioning

This is version 1 of the API. Future versions may be released with path prefixes like `/v2/users`.

---

## Support

For issues or questions, please refer to the main README.md file.
