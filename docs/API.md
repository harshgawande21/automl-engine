# API Documentation 📚

Complete API reference for the AutoInsight ML Engine.

## Base URL
```
Development: http://localhost:8000
Production: https://your-domain.com
```

## Authentication 🔐

All API endpoints (except authentication) require JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "message": "Registration successful"
}
```

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@local",
  "password": "admin"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": "user_id",
    "name": "Administrator",
    "email": "admin@local",
    "role": "admin"
  }
}
```

### GET /api/auth/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "is_active": true
  }
}
```

### POST /api/auth/logout
Logout user (client-side token removal).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Data Management Endpoints 📊

### POST /api/data/upload
Upload a dataset file (CSV, Excel).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <dataset_file>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "filename": "dataset.csv",
    "file_id": "file_id",
    "size": 1024000,
    "columns": ["col1", "col2", "col3"],
    "rows": 1000
  },
  "message": "File uploaded successfully"
}
```

### POST /api/data/preview
Preview dataset structure and statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "filename": "dataset.csv",
  "limit": 100
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "filename": "dataset.csv",
    "columns": [
      {
        "name": "col1",
        "type": "numeric",
        "null_count": 0,
        "unique_count": 950
      }
    ],
    "preview_data": [
      {"col1": 1.5, "col2": "A", "col3": true}
    ],
    "statistics": {
      "total_rows": 1000,
      "numeric_columns": 2,
      "categorical_columns": 1
    }
  }
}
```

### GET /api/data/datasets
List all uploaded datasets.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "filename": "dataset.csv",
      "file_id": "file_id",
      "upload_date": "2024-01-15T10:30:00Z",
      "size": 1024000,
      "rows": 1000,
      "columns": 3
    }
  ]
}
```

## Model Training Endpoints 🤖

### POST /api/model/train
Train a machine learning model.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "filename": "dataset.csv",
  "target_column": "target",
  "algorithm": "random_forest",
  "hyperparameters": {
    "n_estimators": 100,
    "max_depth": 10
  },
  "test_size": 0.2,
  "random_state": 42
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "model_id": "model_id",
    "algorithm": "random_forest",
    "accuracy": 0.95,
    "precision": 0.93,
    "recall": 0.94,
    "f1_score": 0.93,
    "confusion_matrix": [[450, 50], [30, 470]],
    "feature_importance": {
      "feature1": 0.4,
      "feature2": 0.3,
      "feature3": 0.3
    },
    "training_time": 2.5
  },
  "message": "Model trained successfully"
}
```

### POST /api/model/evaluate
Evaluate a trained model.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "model_id": "model_id",
  "test_data": "dataset.csv"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "model_id": "model_id",
    "metrics": {
      "accuracy": 0.95,
      "precision": 0.93,
      "recall": 0.94,
      "f1_score": 0.93,
      "auc_roc": 0.97
    },
    "classification_report": {
      "class_0": {"precision": 0.94, "recall": 0.90, "f1-score": 0.92},
      "class_1": {"precision": 0.96, "recall": 0.98, "f1-score": 0.97}
    }
  }
}
```

### GET /api/model/list
List all trained models.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "model_id": "model_id",
      "algorithm": "random_forest",
      "target_column": "target",
      "accuracy": 0.95,
      "created_date": "2024-01-15T11:00:00Z",
      "dataset": "dataset.csv"
    }
  ]
}
```

## Prediction Endpoints 📈

### POST /api/prediction/single
Make a single prediction.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "model_id": "model_id",
  "input_data": {
    "feature1": 1.5,
    "feature2": "A",
    "feature3": true
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "prediction": "class_1",
    "confidence": 0.87,
    "probabilities": {
      "class_0": 0.13,
      "class_1": 0.87
    },
    "model_id": "model_id",
    "timestamp": "2024-01-15T12:00:00Z"
  }
}
```

### POST /api/prediction/batch
Make batch predictions.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
model_id: model_id
file: <prediction_data_file>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "row_id": 1,
        "prediction": "class_1",
        "confidence": 0.87
      }
    ],
    "total_predictions": 100,
    "processing_time": 1.2
  }
}
```

### GET /api/prediction/history
Get prediction history.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit`: Number of records to return (default: 50)
- `offset`: Offset for pagination (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "prediction_id": "pred_id",
        "model_id": "model_id",
        "input_data": {"feature1": 1.5},
        "prediction": "class_1",
        "confidence": 0.87,
        "timestamp": "2024-01-15T12:00:00Z"
      }
    ],
    "total_count": 150,
    "limit": 50,
    "offset": 0
  }
}
```

## Visualization Endpoints 📋

### POST /api/visualize/histogram
Generate histogram for a column.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "filename": "dataset.csv",
  "column": "feature1",
  "bins": 20
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "column": "feature1",
    "bins": 20,
    "data": [
      {"bin": "0-1", "count": 50},
      {"bin": "1-2", "count": 75}
    ],
    "statistics": {
      "mean": 1.5,
      "std": 0.5,
      "min": 0,
      "max": 3
    }
  }
}
```

### POST /api/visualize/correlation
Generate correlation matrix.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "filename": "dataset.csv"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "columns": ["feature1", "feature2", "feature3"],
    "correlation_matrix": {
      "feature1": {"feature1": 1.0, "feature2": 0.5, "feature3": -0.2},
      "feature2": {"feature1": 0.5, "feature2": 1.0, "feature3": 0.1}
    }
  }
}
```

### POST /api/visualize/feature-importance
Get feature importance for a model.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "model_id": "model_id"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "model_id": "model_id",
    "feature_importance": {
      "feature1": 0.4,
      "feature2": 0.3,
      "feature3": 0.2,
      "feature4": 0.1
    }
  }
}
```

## Recommendation Endpoints 🎯

### POST /api/recommend/
Get AI-powered recommendations.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "filename": "dataset.csv",
  "target_column": "target"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "task_type": "classification",
    "dataset_summary": {
      "rows": 1000,
      "numeric_columns": 3,
      "categorical_columns": 2
    },
    "preprocessing_tips": [
      {
        "tip": "Handle missing values",
        "detail": "Column 'feature2' has 5% missing values"
      }
    ],
    "models": [
      {
        "name": "Random Forest",
        "confidence": 92,
        "reason": "Works well with mixed data types"
      }
    ],
    "visualizations": [
      {
        "type": "histogram",
        "reason": "Understand feature distributions"
      }
    ]
  }
}
```

## Monitoring Endpoints 📱

### GET /api/monitoring/health
Get system health status.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T12:00:00Z",
    "services": {
      "database": "healthy",
      "ml_engine": "healthy",
      "storage": "healthy"
    }
  }
}
```

### GET /api/monitoring/usage
Get usage statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_models": 10,
    "total_predictions": 1500,
    "storage_used": "2.5GB",
    "api_calls_today": 250
  }
}
```

## Error Responses ❌

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": "Field 'email' is required"
  }
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting 🚦

API endpoints are rate-limited:
- **Authentication**: 5 requests per minute
- **Data Upload**: 10 requests per hour
- **Model Training**: 5 requests per hour
- **Predictions**: 100 requests per minute

## SDK Examples 💻

### Python SDK
```python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/login', json={
    'email': 'admin@local',
    'password': 'admin'
})
token = response.json()['access_token']

headers = {'Authorization': f'Bearer {token}'}

# Upload data
files = {'file': open('dataset.csv', 'rb')}
response = requests.post(
    'http://localhost:8000/api/data/upload',
    headers=headers,
    files=files
)

# Train model
response = requests.post(
    'http://localhost:8000/api/model/train',
    headers=headers,
    json={
        'filename': 'dataset.csv',
        'target_column': 'target',
        'algorithm': 'random_forest'
    }
)
```

### JavaScript SDK
```javascript
// Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@local',
    password: 'admin'
  })
});
const { access_token } = await loginResponse.json();

// Upload data
const formData = new FormData();
formData.append('file', fileInput.files[0]);
const uploadResponse = await fetch('http://localhost:8000/api/data/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${access_token}` },
  body: formData
});
```

## WebSocket Connection 🔌

Real-time updates are available via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
};
```

### WebSocket Events
- `training_progress` - Model training progress
- `prediction_completed` - Prediction completion
- `system_status` - System status updates

---

For more detailed information, visit the interactive API documentation at `http://localhost:8000/docs`
