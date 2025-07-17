# Todo Backend API Documentation

**Note for Docker Compose setups:**
- If your frontend runs in a separate container, use the backend service name (e.g., `backend`) as the API host instead of `localhost`.
- Example API base URL from the frontend container: `http://backend:4000`
- For local development on your host machine, use `http://localhost:4000`.

Base URL: `http://localhost:4000` (from host) or `http://backend:4000` (from another container)

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
- All requests and responses use JSON.
- CORS may need to be enabled on the backend for frontend development.
- The backend must be running and accessible at the specified base URL.
- **In Docker Compose, use the backend service name as the host (e.g., `http://backend:4000`) from other containers.** 