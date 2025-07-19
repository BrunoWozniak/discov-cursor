# Todo Backend API Documentation

## Base URL
- **Local Development**: `http://localhost:4000`
- **Docker Containers**: `http://backend:4000`

## Authentication
No authentication required for this demo application.

## Endpoints

### 1. Create a Todo
- **URL:** `/todos`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "string",
    "completed": false // optional, defaults to false
  }
  ```
- **Response:**
  - `201 Created`
  - Body:
    ```json
    {
      "id": 1,
      "title": "string",
      "completed": false
    }
    ```

### 2. Get All Todos
- **URL:** `/todos`
- **Method:** `GET`
- **Response:**
  - `200 OK`
  - Body:
    ```json
    [
      {
        "id": 1,
        "title": "string",
        "completed": false
      },
      // ...
    ]
    ```

### 3. Get a Single Todo
- **URL:** `/todos/:id`
- **Method:** `GET`
- **Response:**
  - `200 OK` (if found)
  - Body:
    ```json
    {
      "id": 1,
      "title": "string",
      "completed": false
    }
    ```
  - `404 Not Found` (if not found)
    ```json
    { "error": "Todo not found" }
    ```

### 4. Update a Todo (mark as done/undone, change title)
- **URL:** `/todos/:id`
- **Method:** `PATCH`
- **Request Body:** (any or both fields)
  ```json
  {
    "title": "New title",      // optional
    "completed": true            // optional (true for done, false for undone)
  }
  ```
- **Response:**
  - `200 OK` (if updated)
    ```json
    {
      "id": 1,
      "title": "New title",
      "completed": true
    }
    ```
  - `400 Bad Request` (if no fields provided)
    ```json
    { "error": "No fields to update" }
    ```
  - `404 Not Found` (if not found)
    ```json
    { "error": "Todo not found" }
    ```

### 5. Delete a Todo
- **URL:** `/todos/:id`
- **Method:** `DELETE`
- **Response:**
  - `200 OK` (if deleted)
    ```json
    {
      "message": "Todo deleted",
      "todo": {
        "id": 1,
        "title": "string",
        "completed": false
      }
    }
    ```
  - `404 Not Found` (if not found)
    ```json
    { "error": "Todo not found" }
    ```

## Notes
- All requests and responses use JSON
- CORS is configured for development and testing environments
- The backend must be running and accessible at the specified base URL 