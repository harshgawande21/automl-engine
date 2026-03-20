# Developer Guide 🛠️

Complete developer documentation for the AutoInsight ML Engine.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Development Setup](#development-setup)
3. [Backend Development](#backend-development)
4. [Frontend Development](#frontend-development)
5. [Database Schema](#database-schema)
6. [API Development](#api-development)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Contributing Guidelines](#contributing-guidelines)

## Architecture Overview 🏗️

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│  (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - UI Components │    │ - API Routes    │    │ - User Data     │
│ - State Mgmt    │    │ - ML Engine     │    │ - Models        │
│ - Routing       │    │ - Auth Service  │    │ - Predictions   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Backend
- **Framework**: FastAPI 0.104+
- **Python**: 3.8+
- **Database**: PostgreSQL (production), SQLite (development)
- **ORM**: SQLAlchemy 2.0+
- **Authentication**: JWT + BCrypt
- **ML Libraries**: scikit-learn, XGBoost, SHAP, LIME
- **Async**: asyncio for concurrent operations

#### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Animations**: Framer Motion

### Project Structure
```
ml_engine_project/
├── backend/
│   ├── app/
│   │   ├── api/                 # API route definitions
│   │   │   ├── __init__.py
│   │   │   ├── auth_routes.py   # Authentication endpoints
│   │   │   ├── data_routes.py   # Data management
│   │   │   ├── model_routes.py  # ML operations
│   │   │   └── predict_routes.py # Predictions
│   │   ├── core/                # Core application logic
│   │   │   ├── __init__.py
│   │   │   ├── config.py        # Configuration settings
│   │   │   ├── security.py      # Authentication & security
│   │   │   └── logging.py       # Logging configuration
│   │   ├── database/            # Database layer
│   │   │   ├── __init__.py
│   │   │   ├── db.py           # Database connection
│   │   │   ├── models.py       # SQLAlchemy models
│   │   │   └── schemas.py      # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py # Authentication logic
│   │   │   ├── ml_service.py   # ML operations
│   │   │   └── data_service.py # Data processing
│   │   └── utils/               # Utilities
│   │       ├── __init__.py
│   │       ├── helpers.py      # Helper functions
│   │       └── validators.py   # Input validation
│   ├── main.py                  # FastAPI application entry
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/         # Generic components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Badge.jsx
│   │   │   ├── forms/          # Form components
│   │   │   │   ├── InputField.jsx
│   │   │   │   ├── SelectField.jsx
│   │   │   │   └── FileUpload.jsx
│   │   │   ├── layout/         # Layout components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── tables/         # Data tables
│   │   │       ├── DataTable.jsx
│   │   │       ├── MetricsTable.jsx
│   │   │       └── PredictionTable.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Auth/           # Authentication pages
│   │   │   ├── Dashboard/      # Main dashboard
│   │   │   ├── Data/           # Data management
│   │   │   ├── Model/          # ML operations
│   │   │   └── Prediction/     # Predictions
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useApi.js
│   │   │   └── useWebSocket.js
│   │   ├── services/           # API services
│   │   │   ├── api.js          # Axios configuration
│   │   │   ├── authService.js
│   │   │   └── dataService.js
│   │   ├── store/              # Redux store
│   │   │   ├── authSlice.js    # Authentication state
│   │   │   ├── dataSlice.js    # Data management
│   │   │   └── uiSlice.js      # UI state
│   │   ├── utils/              # Utility functions
│   │   │   ├── constants.js    # App constants
│   │   │   ├── helpers.js      # Helper functions
│   │   │   └── validators.js   # Form validation
│   │   ├── styles/             # Styling
│   │   │   └── index.css       # Global styles + theme
│   │   ├── App.jsx             # Main React app
│   │   └── main.jsx            # App entry point
│   ├── public/                 # Static assets
│   ├── package.json            # Node dependencies
│   └── vite.config.js          # Vite configuration
├── docs/                       # Documentation
├── docker-compose.yml          # Docker configuration
└── run_app.bat                # Development launcher
```

## Development Setup 🔧

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git
- PostgreSQL (for production)
- Docker (optional)

### Environment Setup

#### Backend Environment
```bash
# Create virtual environment
cd backend
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment variables
cp .env.example .env
# Edit .env with your configuration
```

#### Frontend Environment
```bash
# Install dependencies
cd frontend
npm install

# Environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Database Setup

#### Development (SQLite)
```bash
# SQLite is used by default
# Database file: backend/app.db
```

#### Production (PostgreSQL)
```bash
# Install PostgreSQL
# Create database
createdb ml_engine

# Update .env file
DATABASE_URL=postgresql://user:password@localhost/ml_engine
```

### Running the Application

#### Development Mode
```bash
# Start backend
cd backend
uvicorn main:app --reload --port 8000

# Start frontend (new terminal)
cd frontend
npm run dev
```

#### Using Docker
```bash
# Build and start all services
docker-compose up --build

# Stop services
docker-compose down
```

## Backend Development 🔧

### Adding New API Endpoints

#### 1. Create Route Module
```python
# backend/app/api/new_routes.py
from fastapi import APIRouter, Depends
from app.database.db import get_db
from app.utils.response_builder import success_response

router = APIRouter(prefix="/api/new", tags=["new_feature"])

@router.get("/items")
def get_items(db: Session = Depends(get_db)):
    # Your logic here
    return success_response(data, "Items retrieved successfully")
```

#### 2. Register Routes
```python
# backend/main.py
from app.api import new_routes

app.include_router(new_routes.router)
```

#### 3. Add Business Logic
```python
# backend/app/services/new_service.py
from sqlalchemy.orm import Session
from app.database.models import Item

def get_items_service(db: Session):
    return db.query(Item).all()
```

### Database Models

#### Define Models
```python
# backend/app/database/models.py
from sqlalchemy import Column, String, Integer, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Item(Base):
    __tablename__ = "items"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
```

#### Database Migrations
```python
# Create migration script
from app.database.db import engine
from app.database.models import Base

Base.metadata.create_all(bind=engine)
```

### Pydantic Schemas

#### Request/Response Models
```python
# backend/app/database/schemas.py
from pydantic import BaseModel
from datetime import datetime

class ItemCreate(BaseModel):
    name: str

class ItemResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True
```

### Authentication & Authorization

#### Protected Routes
```python
from app.core.security import get_current_user

@router.get("/protected")
def protected_route(user: dict = Depends(get_current_user)):
    return success_response({"message": "Access granted"})
```

#### Role-based Access
```python
from app.core.security import require_role

@router.get("/admin")
def admin_route(user: dict = Depends(require_role("admin"))):
    return success_response({"message": "Admin access"})
```

### Error Handling

#### Custom Exceptions
```python
# backend/app/utils/exceptions.py
from fastapi import HTTPException

class ItemNotFoundError(HTTPException):
    def __init__(self, item_id: str):
        super().__init__(
            status_code=404,
            detail=f"Item {item_id} not found"
        )
```

#### Global Exception Handler
```python
# backend/main.py
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(ItemNotFoundError)
async def item_not_found_handler(request: Request, exc: ItemNotFoundError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": {"message": exc.detail}}
    )
```

### ML Service Integration

#### Adding New Models
```python
# backend/app/services/ml_service.py
from sklearn.ensemble import RandomForestClassifier
import joblib

class ModelService:
    def train_model(self, data, target, algorithm="random_forest"):
        if algorithm == "random_forest":
            model = RandomForestClassifier()
        
        X = data.drop(columns=[target])
        y = data[target]
        
        model.fit(X, y)
        return model
    
    def save_model(self, model, model_id):
        joblib.dump(model, f"models/{model_id}.pkl")
```

## Frontend Development ⚛️

### Component Development

#### Creating Components
```jsx
// src/components/common/NewComponent.jsx
import { cn } from '../../utils/helpers';

export default function NewComponent({ 
  children, 
  variant = 'default', 
  className,
  ...props 
}) {
  return (
    <div 
      className={cn(
        'base-styles',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

const variants = {
  default: 'default-styles',
  primary: 'primary-styles',
  secondary: 'secondary-styles',
};
```

#### Using Components
```jsx
import NewComponent from '../components/common/NewComponent';

function ParentComponent() {
  return (
    <NewComponent variant="primary" className="additional-styles">
      Content here
    </NewComponent>
  );
}
```

### State Management with Redux

#### Creating Slices
```javascript
// src/store/newSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newItem, getItems } from '../services/newService';

export const fetchItems = createAsyncThunk(
  'new/fetchItems',
  async () => {
    const response = await getItems();
    return response.data;
  }
);

const newSlice = createSlice({
  name: 'new',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = newSlice.actions;
export default newSlice.reducer;
```

#### Using State in Components
```jsx
import { useSelector, useDispatch } from 'react-redux';
import { fetchItems } from '../store/newSlice';

function ItemsComponent() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.new);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Custom Hooks

#### API Hook
```javascript
// src/hooks/useApi.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(url, options);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

#### WebSocket Hook
```javascript
// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => setIsConnected(true);
    ws.current.onclose = () => setIsConnected(false);
    ws.current.onmessage = (event) => {
      setLastMessage(JSON.parse(event.data));
    };

    return () => {
      ws.current.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, lastMessage, sendMessage };
}
```

### Routing

#### Protected Routes
```jsx
// src/components/layout/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const { isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

#### Route Configuration
```jsx
// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import NewPage from '../pages/NewPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/new" element={
        <ProtectedRoute>
          <NewPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

### Styling with Tailwind CSS

#### Custom Components
```jsx
// Use utility classes directly
<div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
  <h2 className="text-lg font-semibold text-blue-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>
```

#### Custom CSS Variables
```css
/* src/styles/index.css */
:root {
  --color-primary: #60A5FA;
  --color-secondary: #F472B6;
  --color-accent: #FDE047;
  --color-success: #4ADE80;
}

.custom-class {
  background-color: var(--color-primary);
  color: var(--color-text);
}
```

## Database Schema 🗄️

### User Management
```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Data Storage
```sql
CREATE TABLE datasets (
    id VARCHAR PRIMARY KEY,
    filename VARCHAR NOT NULL,
    original_filename VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    file_size INTEGER NOT NULL,
    columns JSONB NOT NULL,
    row_count INTEGER NOT NULL,
    uploaded_by VARCHAR REFERENCES users(id),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Model Storage
```sql
CREATE TABLE models (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    algorithm VARCHAR NOT NULL,
    target_column VARCHAR NOT NULL,
    hyperparameters JSONB,
    metrics JSONB NOT NULL,
    model_path VARCHAR NOT NULL,
    dataset_id VARCHAR REFERENCES datasets(id),
    created_by VARCHAR REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Predictions
```sql
CREATE TABLE predictions (
    id VARCHAR PRIMARY KEY,
    model_id VARCHAR REFERENCES models(id),
    input_data JSONB NOT NULL,
    prediction JSONB NOT NULL,
    confidence FLOAT,
    created_by VARCHAR REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Development 🔌

### RESTful API Design

#### Resource Naming
```
GET    /api/models          # List models
POST   /api/models          # Create model
GET    /api/models/{id}     # Get specific model
PUT    /api/models/{id}     # Update model
DELETE /api/models/{id}     # Delete model
```

#### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { ... }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### API Documentation

#### OpenAPI/Swagger
FastAPI automatically generates API docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

#### Custom Documentation
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="AutoInsight API",
    description="ML Engine API Documentation",
    version="2.0.0"
)

class ItemCreate(BaseModel):
    """Request model for creating items"""
    name: str
    description: str = None
    
    class Config:
        schema_extra = {
            "example": {
                "name": "Example Item",
                "description": "Item description"
            }
        }

@app.post("/items/", response_model=ItemResponse)
async def create_item(item: ItemCreate):
    """
    Create a new item.
    
    - **name**: Item name (required)
    - **description**: Item description (optional)
    """
    # Implementation here
    pass
```

## Testing 🧪

### Backend Testing

#### Unit Tests
```python
# tests/test_services.py
import pytest
from app.services.ml_service import ModelService

def test_model_training():
    service = ModelService()
    # Mock data
    data = {...}
    target = "target"
    
    model = service.train_model(data, target)
    assert model is not None

def test_invalid_data():
    service = ModelService()
    with pytest.raises(ValueError):
        service.train_model(None, "target")
```

#### Integration Tests
```python
# tests/test_api.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_item():
    response = client.post(
        "/api/items/",
        json={"name": "Test Item"}
    )
    assert response.status_code == 201
    assert response.json()["success"] is True

def test_get_items():
    response = client.get("/api/items/")
    assert response.status_code == 200
    assert "data" in response.json()
```

#### Test Database
```python
# conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.db import get_db, Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
```

### Frontend Testing

#### Component Tests
```jsx
// src/components/__tests__/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../common/Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### Hook Tests
```javascript
// src/hooks/__tests__/useApi.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from '../useApi';

// Mock axios
jest.mock('../services/api');

test('fetches data successfully', async () => {
  const mockData = { items: [] };
  api.get.mockResolvedValue({ data: mockData });

  const { result } = renderHook(() => useApi('/items'));

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
  });
});
```

#### Integration Tests
```jsx
// src/pages/__tests__/LoginPage.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../store';
import Login from '../Login';

test('login form submission', async () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password' }
  });

  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  await waitFor(() => {
    expect(screen.getByText(/login successful/i)).toBeInTheDocument();
  });
});
```

### Running Tests

#### Backend Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_services.py

# Run with verbose output
pytest -v
```

#### Frontend Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test Button.test.jsx
```

## Deployment 🚀

### Environment Configuration

#### Production Environment Variables
```bash
# Backend .env
DATABASE_URL=postgresql://user:password@localhost/ml_engine
SECRET_KEY=your-very-secure-secret-key
DEBUG=False
CORS_ORIGINS=["https://yourdomain.com"]
ENVIRONMENT=production

# Frontend .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws
```

### Docker Deployment

#### Multi-stage Dockerfile
```dockerfile
# Backend Dockerfile
FROM python:3.9-slim as backend

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Frontend Dockerfile
FROM node:16-alpine as frontend-build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=frontend-build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/ml_engine
    depends_on:
      - db
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=ml_engine
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Cloud Deployment

#### AWS Deployment
```bash
# Build and push to ECR
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker build -t ml-engine-backend ./backend
docker tag ml-engine-backend:latest $ECR_REGISTRY/ml-engine-backend:latest
docker push $ECR_REGISTRY/ml-engine-backend:latest

# Deploy to ECS
aws ecs update-service --cluster ml-engine --service backend-service --force-new-deployment
```

#### Environment-specific Builds
```bash
# Production build
cd frontend
npm run build

# Stage build for testing
npm run build:stage

# Development build
npm run build:dev
```

## Contributing Guidelines 🤝

### Code Style

#### Python (Backend)
- Follow PEP 8
- Use Black for formatting
- Use isort for import sorting
- Use type hints

```bash
# Format code
black app/
isort app/

# Type checking
mypy app/
```

#### JavaScript (Frontend)
- Use ESLint + Prettier
- Follow React best practices
- Use functional components with hooks

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Git Workflow

#### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `refactor/description` - Code refactoring

#### Commit Messages
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
```
feat(auth): add JWT token refresh
fix(api): handle null values in response
docs(readme): update installation instructions
```

### Pull Request Process

#### Before Submitting
1. **Test your changes**: Ensure all tests pass
2. **Update documentation**: Add docs for new features
3. **Code review**: Self-review your changes
4. **Clean history**: Squash related commits

#### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Code Review Guidelines

#### Review Checklist
- **Functionality**: Does it work as expected?
- **Performance**: Any performance implications?
- **Security**: Any security concerns?
- **Testing**: Are tests comprehensive?
- **Documentation**: Is code well-documented?
- **Style**: Does it follow project conventions?

#### Review Process
1. **Automated checks**: CI/CD pipeline validation
2. **Peer review**: At least one team member review
3. **Testing**: Verify tests pass in review environment
4. **Approval**: Merge after approval and checks pass

---

For questions or support, please contact the development team or create an issue in the project repository.
