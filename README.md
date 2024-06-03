## TODO API Documentation

### Overview

This TODO API allows you to manage your todo items. You can create, read, update, and delete todos. The API is built using AWS Lambda, API Gateway, and DynamoDB. It is designed to be deployed using the Serverless Framework.

### Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deploying the Application](#deploying-the-application)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
- [License](#license)

### Getting Started

To get started with the TODO API, follow the instructions below to set up and deploy the application.

### Prerequisites

- Node.js (v14.x or later)
- npm or yarn
- AWS account
- Serverless Framework

### Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-username/todo-api.git
   cd todo-api
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

### Configuration

1. **Environment Variables**: Create a `.env` file in the root directory and add the following environment variables:
   ```env
   AWS_REGION=your-aws-region
   TODOS_TABLE=your-dynamodb-table-name
   ```

2. **Serverless Configuration**: Update the `serverless.yml` file with your AWS region and DynamoDB table name.

### Deploying the Application

To deploy the application to AWS, use the Serverless Framework:

```sh
serverless deploy
```

### Running Tests

To run the tests for the TODO API, use the following command:

```sh
npm test
```

### API Endpoints

Here are the available endpoints for the TODO API:

#### Create Todo

- **URL**: `/todos`
- **Method**: `POST`
- **Description**: Create a new todo item.
- **Request Body**:
  ```json
  {
    "title": "Comprar leche",
    "metadata": {
      "prioridad": "alta"
    }
  }
  ```
- **Response**:
  ```json
  {
    "id": "1234",
    "title": "Comprar leche",
    "completed": false,
    "metadata": {
      "prioridad": "alta"
    }
  }
  ```

#### Get Todos

- **URL**: `/todos`
- **Method**: `GET`
- **Description**: Retrieve a list of all todo items.
- **Response**:
  ```json
  [
    {
      "id": "1234",
      "title": "Comprar leche",
      "completed": false,
      "metadata": {
        "prioridad": "alta"
      }
    }
  ]
  ```

#### Update Todo

- **URL**: `/todos/{id}`
- **Method**: `PUT`
- **Description**: Update an existing todo item.
- **Request Body**:
  ```json
  {
    "title": "Comprar leche y pan",
    "completed": true,
    "metadata": {
      "prioridad": "alta"
    }
  }
  ```
- **Response**:
  ```json
  {
    "id": "1234",
    "title": "Comprar leche y pan",
    "completed": true,
    "metadata": {
      "prioridad": "alta"
    }
  }
  ```

#### Delete Todo

- **URL**: `/todos/{id}`
- **Method**: `DELETE`
- **Description**: Delete a completed todo item.
- **Response**:
  ```json
  {
    "message": "Todo deleted successfully"
  }
  ```

#### Delete Todo (Not Completed)

- **URL**: `/todos/{id}`
- **Method**: `DELETE`
- **Description**: Return an error if the todo item is not completed.
- **Response**:
  ```json
  {
    "error": "Todo must be completed before deletion"
  }
  ```

---

This README provides a comprehensive guide to setting up, deploying, and using the TODO API. If you encounter any issues or have questions open an issue on the repository.