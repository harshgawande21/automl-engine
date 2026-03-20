# AutoInsight ML Engine 🚀

A comprehensive no-code Machine Learning platform that empowers users to upload data, train models, and get insights without writing a single line of code.

## 🌟 Features

### 🎯 Core Functionality
- **📊 Data Management**: Upload, preview, and process datasets
- **🤖 Model Training**: Train various ML models with automatic algorithm selection
- **📈 Predictions**: Make single or batch predictions with trained models
- **📋 Visualizations**: Interactive charts and data visualizations
- **🎯 Recommendations**: AI-powered model and feature recommendations
- **📊 Analytics**: Comprehensive model performance analytics
- **🔍 Explainability**: SHAP and LIME-based model explanations
- **📱 Monitoring**: Real-time model drift and performance monitoring

### 🎨 User Experience
- **🌈 Beautiful UI**: Modern light theme with blue, pink, yellow, and green colors
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **♿ Accessible**: WCAG compliant with proper ARIA labels
- **🔄 Real-time Updates**: Live feedback and loading states
- **🔐 Secure Authentication**: JWT-based auth with real-time validation

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python
- **Database**: SQLAlchemy ORM
- **Authentication**: JWT tokens with BCrypt password hashing
- **ML Libraries**: scikit-learn, XGBoost, SHAP, LIME
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

### Frontend (React)
- **Framework**: React 18 with modern hooks
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router v6
- **UI Components**: Custom component library
- **Authentication**: Real-time token validation

### 🎨 Theme Configuration
The application uses a beautiful light theme with:
- **Primary Blue**: `#60A5FA` (Light Blue)
- **Secondary Pink**: `#F472B6` (Pink)
- **Accent Yellow**: `#FDE047` (Yellow)
- **Success Green**: `#4ADE80` (Green)
- **Background**: `#FEFEFE` (Light White)
- **Text**: `#1E293B` (Dark Slate)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ml_engine_project
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Run the Application**
```bash
# From project root
run_app.bat
```

Or manually:

```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🔐 Default Credentials

For immediate access, use the default admin account:
- **Email**: `admin@local`
- **Password**: `admin`

## 📖 User Guide

### 1. Authentication
- **Login**: Navigate to `/login` with your credentials
- **Register**: Create a new account at `/register`
- **Settings**: Manage your profile at `/settings`

### 2. Data Upload
1. Navigate to **Data Upload** (`/data/upload`)
2. Drag & drop or click to upload CSV/Excel files
3. Preview and validate your data
4. Proceed to processing

### 3. Model Training
1. Go to **Model Training** (`/model/training`)
2. Select your target column
3. Choose ML algorithms or let AI recommend
4. Configure hyperparameters
5. Train and evaluate models

### 4. Making Predictions
1. **Single Prediction**: `/prediction/single`
2. **Batch Prediction**: `/prediction/batch`
3. Upload new data or input values manually
4. Get instant predictions with confidence scores

### 5. Analytics & Monitoring
- **Dashboard**: Overview of all models and performance
- **Visualizations**: Interactive charts and graphs
- **Monitoring**: Real-time model drift detection
- **Explainability**: Understand model decisions

## 🛠️ Development

### Project Structure
```
ml_engine_project/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Security and config
│   │   ├── database/       # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── main.py             # FastAPI app entry
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   └── utils/          # Utilities
│   ├── public/             # Static assets
│   └── package.json        # Node dependencies
├── docs/                   # Documentation
└── run_app.bat            # Startup script
```

### Key Components

#### Backend Components
- **Authentication**: JWT-based auth with real-time validation
- **Data Processing**: Automated data cleaning and preprocessing
- **Model Training**: Support for classification, regression, clustering
- **Prediction Engine**: Real-time inference with confidence scoring
- **Explainability**: SHAP and LIME integration

#### Frontend Components
- **Authentication System**: Login, register, settings with real-time validation
- **Data Upload**: Drag-and-drop file upload with progress tracking
- **Model Training**: Interactive model configuration and training
- **Visualization**: Recharts-based interactive charts
- **Settings**: Profile management and security settings

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

#### Data Management
- `POST /api/data/upload` - Upload dataset
- `POST /api/data/preview` - Preview dataset
- `GET /api/data/datasets` - List all datasets

#### Model Operations
- `POST /api/model/train` - Train model
- `POST /api/model/evaluate` - Evaluate model
- `GET /api/model/list` - List trained models

#### Predictions
- `POST /api/prediction/single` - Single prediction
- `POST /api/prediction/batch` - Batch prediction
- `GET /api/prediction/history` - Prediction history

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=sqlite:///./ml_engine.db
SECRET_KEY=your-secret-key-here
DEBUG=True
CORS_ORIGINS=["http://localhost:5173"]
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### Database Setup
The application uses SQLite by default. For production, configure PostgreSQL:

```python
# backend/app/database/db.py
DATABASE_URL = "postgresql://user:password@localhost/ml_engine"
```

## 📊 Supported ML Algorithms

### Classification
- Logistic Regression
- Random Forest
- Gradient Boosting (XGBoost)
- Support Vector Machines
- Neural Networks

### Regression
- Linear Regression
- Random Forest Regressor
- XGBoost Regressor
- SVR
- Neural Networks

### Clustering
- K-Means
- DBSCAN
- Hierarchical Clustering
- Gaussian Mixture Models

## 🎨 Customization

### Theme Customization
Edit `frontend/src/index.css` to customize colors:

```css
:root {
  --color-primary: #60A5FA;    /* Light Blue */
  --color-secondary: #F472B6;  /* Pink */
  --color-accent: #FDE047;     /* Yellow */
  --color-success: #4ADE80;    /* Green */
  --color-background: #FEFEFE; /* Light White */
  --color-text: #1E293B;       /* Dark Slate */
}
```

### Adding New ML Models
1. Update `backend/app/services/model_service.py`
2. Add model configuration in `backend/app/config/models.py`
3. Update frontend model selection in `frontend/src/components/ModelSelector.jsx`

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Production Deployment
1. **Backend**: Deploy to cloud provider (AWS, GCP, Azure)
2. **Frontend**: Deploy to Vercel, Netlify, or AWS S3
3. **Database**: Use PostgreSQL or MySQL for production
4. **Environment**: Set production environment variables

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📈 Performance

### Optimization Features
- **Lazy Loading**: Components loaded on demand
- **Caching**: Redis integration for API responses
- **Database Indexing**: Optimized queries
- **Compression**: Gzip compression for API responses
- **CDN**: Static assets served via CDN

## 🔒 Security

### Security Features
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: BCrypt for password security
- **CORS Protection**: Configurable CORS policies
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: ORM-based database access
- **XSS Protection**: React's built-in XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](./docs/)
- Review the [API docs](http://localhost:8000/docs)

## 🗺️ Roadmap

### Upcoming Features
- [ ] Dark theme support
- [ ] Advanced hyperparameter tuning
- [ ] Model versioning
- [ ] Team collaboration features
- [ ] Advanced monitoring alerts
- [ ] AutoML capabilities
- [ ] Export models to various formats
- [ ] Integration with popular ML platforms

---

**Built with ❤️ using FastAPI, React, and modern ML technologies** 
