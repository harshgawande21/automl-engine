# 📚 AutoInsight ML Engine Documentation

Welcome to the comprehensive documentation for the AutoInsight ML Engine platform.

## 📖 Documentation Overview

This documentation covers everything you need to know about the AutoInsight ML Engine - from getting started to advanced deployment and development.

### 🚀 Quick Start
- **New to the platform?** Start with the [Main README](../README.md)
- **Need to login immediately?** Use default credentials: `admin@local` / `admin`
- **Want to explore?** Visit `http://localhost:5173` after running the app

## 📋 Documentation Structure

### 📖 [Main README](../README.md)
**🎯 Purpose**: Complete project overview and quick start guide

**📝 Contents**:
- ✨ Feature overview and capabilities
- 🏗️ Architecture and technology stack
- 🚀 Quick start and installation guide
- 🔐 Default credentials and access
- 📊 Supported ML algorithms
- 🎨 Theme customization
- 🚀 Deployment options
- 🔒 Security features
- 🤝 Contributing guidelines

**👥 Audience**: Everyone - Users, Developers, Administrators

---

### 🔌 [API Documentation](./API.md)
**🎯 Purpose**: Complete API reference for developers

**📝 Contents**:
- 🔐 Authentication endpoints (Login, Register, Profile)
- 📊 Data management endpoints (Upload, Preview, List)
- 🤖 Model training endpoints (Train, Evaluate, List)
- 📈 Prediction endpoints (Single, Batch, History)
- 📋 Visualization endpoints (Histograms, Correlation)
- 🎯 Recommendation endpoints (AI suggestions)
- 📱 Monitoring endpoints (Health, Usage)
- 🔌 WebSocket connections
- ⚙️ SDK examples (Python, JavaScript)
- ❌ Error handling and status codes
- 🚦 Rate limiting information

**👥 Audience**: Developers, Integration Specialists

---

### 👤 [User Guide](./USER_GUIDE.md)
**🎯 Purpose**: Step-by-step guide for platform users

**📝 Contents**:
- 🚀 Getting started and first login
- 🔐 Authentication and profile management
- 📊 Data upload and management
- 🤖 Model training process
- 📈 Making predictions (single & batch)
- 📋 Analytics and visualizations
- ⚙️ Settings and preferences
- 💡 Tips and best practices
- ⌨️ Keyboard shortcuts
- 📱 Mobile usage guide
- 🔧 Troubleshooting common issues

**👥 Audience**: End Users, Data Scientists, Business Analysts

---

### 🛠️ [Developer Guide](./DEVELOPER.md)
**🎯 Purpose**: Comprehensive development documentation

**📝 Contents**:
- 🏗️ Architecture overview and system design
- 🔧 Development setup and environment
- ⚙️ Backend development (FastAPI)
- ⚛️ Frontend development (React)
- 🗄️ Database schema and models
- 🔌 API development guidelines
- 🧪 Testing strategies and examples
- 🚀 Deployment procedures
- 🤝 Contributing guidelines
- 📋 Code style and standards
- 🔍 Debugging techniques

**👥 Audience**: Developers, DevOps Engineers, Technical Contributors

---

### 🚀 [Deployment Guide](./DEPLOYMENT.md)
**🎯 Purpose**: Production deployment and operations

**📝 Contents**:
- 📋 Deployment overview and architecture options
- 🔧 Environment setup and requirements
- 🐳 Docker deployment with compose
- ☁️ Cloud deployment (AWS, GCP, Azure)
- 🗄️ Database setup and configuration
- 🔒 SSL/HTTPS configuration
- 📊 Monitoring and logging setup
- ⚡ Performance optimization
- 🔒 Security hardening
- 🔧 Troubleshooting production issues

**👥 Audience**: DevOps Engineers, System Administrators, IT Professionals

---

## 🎯 How to Use This Documentation

### 🆕 New Users
1. **Start with** [Main README](../README.md) for overview
2. **Follow** [User Guide](./USER_GUIDE.md) for step-by-step instructions
3. **Reference** [API Documentation](./API.md) when integrating with other tools

### 🧑‍💻 Developers
1. **Read** [Main README](../README.md) for project context
2. **Follow** [Developer Guide](./DEVELOPER.md) for setup and development
3. **Reference** [API Documentation](./API.md) for endpoint details
4. **Use** [Deployment Guide](./DEPLOYMENT.md) for production setup

### 🔧 System Administrators
1. **Review** [Main README](../README.md) for requirements
2. **Follow** [Deployment Guide](./DEPLOYMENT.md) for production setup
3. **Reference** [API Documentation](./API.md) for monitoring endpoints
4. **Use** [User Guide](./USER_GUIDE.md) to understand user workflows

## 🚀 Quick Reference

### 🔐 Default Access
```
URL: http://localhost:5173
Email: admin@local
Password: admin
```

### 🛠️ Development Commands
```bash
# Start development environment
./run_app.bat

# Or manually:
cd backend && uvicorn main:app --reload --port 8000
cd frontend && npm run dev
```

### 📊 Available Pages
| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/dashboard` | Main overview |
| Data Upload | `/data/upload` | Upload datasets |
| Model Training | `/model/training` | Train ML models |
| Single Prediction | `/prediction/single` | Make predictions |
| Settings | `/settings` | Profile management |

### 🔌 Key API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User authentication |
| `/api/data/upload` | POST | Upload dataset |
| `/api/model/train` | POST | Train model |
| `/api/prediction/single` | POST | Single prediction |
| `/api/monitoring/health` | GET | System health |

## 🎨 Theme Colors

The application uses a beautiful light theme:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#60A5FA` | Main actions, links |
| Secondary Pink | `#F472B6` | Accents, highlights |
| Accent Yellow | `#FDE047` | Warnings, attention |
| Success Green | `#4ADE80` | Success states |
| Background | `#FEFEFE` | Page background |
| Text | `#1E293B` | Main text |

## 📞 Getting Help

### 🆘 Common Issues
- **Login problems**: Check [User Guide - Authentication](./USER_GUIDE.md#authentication)
- **Upload failures**: See [User Guide - Data Management](./USER_GUIDE.md#data-management)
- **Training errors**: Reference [User Guide - Model Training](./USER_GUIDE.md#model-training)
- **API issues**: Check [API Documentation](./API.md#error-responses)

### 📧 Support Channels
- **Documentation**: Browse these guides
- **API Docs**: Visit `/docs` in the application
- **Issues**: Create GitHub issues for bugs
- **Community**: Join user forums for discussions

### 🔄 Documentation Updates
This documentation is regularly updated. Check the version information in each document for the latest updates.

## 🗂️ File Structure

```
docs/
├── README.md              # This file - Documentation index
├── API.md                 # Complete API reference
├── USER_GUIDE.md          # User documentation
├── DEVELOPER.md           # Developer documentation
└── DEPLOYMENT.md          # Deployment guide

../
├── README.md              # Main project README
├── backend/               # FastAPI backend
├── frontend/              # React frontend
├── docker-compose.yml     # Docker configuration
└── run_app.bat           # Development launcher
```

## 🎯 Learning Path

### 🌱 Beginner (1-2 hours)
1. Read [Main README](../README.md) - 15 min
2. Follow [User Guide - Getting Started](./USER_GUIDE.md#getting-started) - 30 min
3. Try data upload and model training - 45 min
4. Make predictions with trained model - 30 min

### 🚀 Intermediate (1 day)
1. Complete beginner path
2. Read [API Documentation](./API.md) - 1 hour
3. Try API endpoints with curl/Postman - 2 hours
4. Review [Developer Guide - Architecture](./DEVELOPER.md#architecture-overview) - 1 hour
5. Set up development environment - 2 hours

### 🔧 Advanced (1 week)
1. Complete intermediate path
2. Read full [Developer Guide](./DEVELOPER.md) - 4 hours
3. Set up local development with Docker - 4 hours
4. Try contributing to the codebase - 8 hours
5. Review [Deployment Guide](./DEPLOYMENT.md) - 4 hours
6. Deploy to staging environment - 8 hours

## 📈 Platform Capabilities

### 🤖 Machine Learning Features
- **Classification**: Logistic Regression, Random Forest, XGBoost, SVM
- **Regression**: Linear Regression, Random Forest, XGBoost, SVR
- **Clustering**: K-Means, DBSCAN, Hierarchical
- **Explainability**: SHAP, LIME integration
- **AutoML**: Algorithm recommendations and hyperparameter tuning

### 📊 Data Management
- **File Formats**: CSV, Excel support
- **Data Preview**: Automatic column detection and statistics
- **Validation**: Data quality checks and error reporting
- **Processing**: Automated cleaning and preprocessing

### 📈 Analytics & Monitoring
- **Visualizations**: Interactive charts and graphs
- **Performance Metrics**: Accuracy, precision, recall, F1-score
- **Real-time Monitoring**: Model drift detection
- **Usage Analytics**: Prediction history and statistics

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based auth
- **Real-time Validation**: Token verification on each request
- **Password Security**: BCrypt hashing with salt
- **Session Management**: Automatic logout and cleanup

---

## 🎉 Start Your Journey

Ready to explore the AutoInsight ML Engine?

1. **📖 Read the [Main README](../README.md)** for project overview
2. **🚀 Follow the [Quick Start Guide](../README.md#quick-start)** to get running
3. **👤 Use the [User Guide](./USER_GUIDE.md)** for step-by-step instructions
4. **🔌 Explore the [API Documentation](./API.md)** for integration options

**Happy machine learning! 🚀**

---

*This documentation is part of the AutoInsight ML Engine project. For the most up-to-date information, always check the main project repository.*
