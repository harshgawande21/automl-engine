# Deployment Guide 🚀

Complete guide for deploying the AutoInsight ML Engine to production.

## Table of Contents
1. [Deployment Overview](#deployment-overview)
2. [Environment Setup](#environment-setup)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Database Setup](#database-setup)
6. [SSL/HTTPS Configuration](#sslhttps-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Performance Optimization](#performance-optimization)
9. [Security Hardening](#security-hardening)
10. [Troubleshooting](#troubleshooting)

## Deployment Overview 📋

### Architecture Options

#### Single Server Deployment
```
┌─────────────────────────────────────┐
│           Server (Docker)           │
│  ┌─────────────┬─────────────────┐   │
│  │   Nginx     │   Frontend      │   │
│  │  (Port 80)  │   (Port 3000)   │   │
│  └─────────────┼─────────────────┤   │
│  │   FastAPI   │   PostgreSQL    │   │
│  │ (Port 8000) │  (Port 5432)   │   │
│  └─────────────┴─────────────────┘   │
└─────────────────────────────────────┘
```

#### Multi-Container Deployment
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Frontend  │  │   Backend   │  │  Database   │
│   (Nginx)   │  │  (FastAPI)  │  │(PostgreSQL) │
│   Port 80   │  │  Port 8000  │  │  Port 5432  │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database set up and migrated
- [ ] SSL certificates installed
- [ ] Firewall rules configured
- [ ] Monitoring and logging enabled
- [ ] Backup strategy implemented
- [ ] Performance testing completed
- [ ] Security audit performed

## Environment Setup 🔧

### System Requirements

#### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Windows Server

#### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Network**: 100Mbps+

### Required Software

#### System Dependencies
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum update
sudo yum install -y docker docker-compose nginx certbot python3-certbot-nginx

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### Node.js & Python
```bash
# Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python 3.9+
sudo apt install -y python3.9 python3.9-pip python3.9-venv

# Verify installations
node --version
npm --version
python3.9 --version
```

### Environment Configuration

#### Backend Environment (.env)
```bash
# Database Configuration
DATABASE_URL=postgresql://ml_user:secure_password@localhost:5432/ml_engine
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=30

# Security
SECRET_KEY=your-very-secure-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
BCRYPT_ROUNDS=12

# CORS Configuration
CORS_ORIGINS=["https://yourdomain.com", "https://www.yourdomain.com"]
CORS_ALLOW_CREDENTIALS=true

# Application Settings
DEBUG=false
ENVIRONMENT=production
LOG_LEVEL=INFO
MAX_FILE_SIZE=104857600  # 100MB

# Redis (for caching)
REDIS_URL=redis://localhost:6379/0

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Storage
UPLOAD_DIR=/app/uploads
MODEL_DIR=/app/models
BACKUP_DIR=/app/backups

# Monitoring
SENTRY_DSN=your-sentry-dsn-here
PROMETHEUS_PORT=9090
```

#### Frontend Environment (.env.production)
```bash
# API Configuration
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws

# Application Settings
VITE_APP_NAME=AutoInsight ML Engine
VITE_APP_VERSION=2.0.0
VITE_ENVIRONMENT=production

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=your-frontend-sentry-dsn

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_MONITORING=true
VITE_ENABLE_DEBUG=false
```

## Docker Deployment 🐳

### Production Dockerfile

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM python:3.9-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV ENVIRONMENT=production

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

#### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Configuration

#### Production Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Frontend (Nginx + React)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl/certs:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - app-network

  # Backend (FastAPI)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://ml_user:${DB_PASSWORD}@db:5432/ml_engine
      - REDIS_URL=redis://redis:6379/0
    volumes:
      - ./uploads:/app/uploads
      - ./models:/app/models
      - ./logs/backend:/app/logs
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Database (PostgreSQL)
  db:
    image: postgres:13-alpine
    environment:
      - POSTGRES_DB=ml_engine
      - POSTGRES_USER=ml_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
      - ./logs/postgres:/var/log/postgresql
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ml_user -d ml_engine"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis (Caching)
  redis:
    image: redis:6-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Monitoring (Prometheus)
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
    restart: unless-stopped
    networks:
      - app-network

  # Monitoring (Grafana)
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:

networks:
  app-network:
    driver: bridge
```

### Deployment Scripts

#### Deploy Script
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting AutoInsight ML Engine deployment..."

# Load environment variables
if [ -f .env.prod ]; then
    export $(cat .env.prod | xargs)
else
    echo "❌ .env.prod file not found!"
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads models backups logs/{nginx,backend,postgres} ssl monitoring

# Build and start services
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.prod.yml exec backend python -m alembic upgrade head

# Create default admin user
echo "👤 Creating default admin user..."
docker-compose -f docker-compose.prod.yml exec backend python -c "
from app.services.auth_service import create_default_user
from app.database.db import get_db
db = next(get_db())
create_default_user(db)
print('✅ Default admin user created: admin@local / admin')
"

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:8000/health; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

if curl -f http://localhost:80; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 Grafana: http://localhost:3001"
echo "📈 Prometheus: http://localhost:9090"
```

## Cloud Deployment ☁️

### AWS Deployment

#### EC2 Setup
```bash
# Create EC2 instance
aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type t3.medium \
    --key-name your-key-pair \
    --security-group-ids sg-xxxxxxxxx \
    --subnet-id subnet-xxxxxxxxx \
    --user-data file://user-data.sh \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=ml-engine}]'

# user-data.sh
#!/bin/bash
yum update -y
yum install -y docker git
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Clone repository
cd /home/ec2-user
git clone https://github.com/your-repo/ml-engine-project.git
cd ml-engine-project

# Deploy
chmod +x deploy.sh
./deploy.sh
```

#### RDS PostgreSQL Setup
```bash
# Create RDS instance
aws rds create-db-instance \
    --db-instance-identifier ml-engine-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username ml_user \
    --master-user-password your-secure-password \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxxxxxx \
    --db-subnet-group-name default \
    --backup-retention-period 7 \
    --multi-az \
    --storage-type gp2 \
    --storage-encrypted
```

#### S3 for File Storage
```bash
# Create S3 bucket
aws s3 mb s3://ml-engine-files

# Set up CORS
aws s3api put-bucket-cors --bucket ml-engine-files --cors-configuration file://cors.json

# cors.json
{
    "CORSRules": [
        {
            "AllowedOrigins": ["https://yourdomain.com"],
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
            "MaxAgeSeconds": 3000
        }
    ]
}
```

### Google Cloud Platform

#### Cloud Run Deployment
```bash
# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable sql-component.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Build and deploy backend
gcloud builds submit --tag gcr.io/PROJECT-ID/ml-engine-backend ./backend

gcloud run deploy ml-engine-backend \
    --image gcr.io/PROJECT-ID/ml-engine-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --memory 1Gi \
    --cpu 1 \
    --max-instances 10

# Deploy frontend
gcloud builds submit --tag gcr.io/PROJECT-ID/ml-engine-frontend ./frontend

gcloud run deploy ml-engine-frontend \
    --image gcr.io/PROJECT-ID/ml-engine-frontend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

### Azure Deployment

#### Container Instances
```bash
# Create resource group
az group create --name ml-engine-rg --location eastus

# Create container registry
az acr create --resource-group ml-engine-rg --name mlengineregistry --sku Basic

# Build and push images
az acr build --registry mlengineregistry --image backend ./backend
az acr build --registry mlengineregistry --image frontend ./frontend

# Deploy containers
az container create \
    --resource-group ml-engine-rg \
    --name ml-engine-backend \
    --image mlengineregistry.azurecr.io/backend \
    --cpu 1 \
    --memory 2 \
    --ports 8000
```

## Database Setup 🗄️

### PostgreSQL Configuration

#### Production Settings
```sql
-- postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

#### Database Creation
```bash
# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE ml_engine;
CREATE USER ml_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ml_engine TO ml_user;
ALTER USER ml_user CREATEDB;
EOF
```

#### Migration Script
```python
# backend/alembic/versions/001_initial.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

def downgrade():
    op.drop_table('users')
```

### Database Backup Strategy

#### Automated Backups
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/app/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="ml_engine"
DB_USER="ml_user"

# Create backup
docker-compose exec db pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "✅ Backup completed: backup_$DATE.sql.gz"
```

#### Restore Script
```bash
#!/bin/bash
# restore.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Restore database
docker-compose exec -T db psql -U ml_user ml_engine < $BACKUP_FILE

echo "✅ Database restored from $BACKUP_FILE"
```

## SSL/HTTPS Configuration 🔒

### Let's Encrypt Setup

#### Automatic Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Nginx SSL Configuration
```nginx
# nginx/nginx.conf
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # WebSocket
    location /ws {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Monitoring & Logging 📊

### Prometheus Configuration

#### prometheus.yml
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'ml-engine-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'nginx'
    static_configs:
      - targets: ['frontend:9113']
    scrape_interval: 30s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
    scrape_interval: 30s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
    scrape_interval: 30s
```

#### Grafana Dashboards
```json
{
  "dashboard": {
    "title": "ML Engine Overview",
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      }
    ]
  }
}
```

### Logging Configuration

#### Backend Logging
```python
# backend/app/core/logging.py
import logging
import sys
from pythonjsonlogger import jsonlogger

def setup_logging():
    # Create logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)

    # Create file handler
    file_handler = logging.FileHandler('/app/logs/app.log')
    file_handler.setLevel(logging.INFO)

    # Create JSON formatter
    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(name)s %(levelname)s %(message)s'
    )

    # Add formatter to handlers
    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)

    # Add handlers to logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
```

#### Log Rotation
```bash
# /etc/logrotate.d/ml-engine
/app/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 app app
    postrotate
        docker-compose exec backend kill -USR1 1
    endscript
}
```

## Performance Optimization ⚡

### Application Optimization

#### Backend Performance
```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()

# Add compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Configure CORS for performance
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Database Optimization
```sql
-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_models_created_by ON models(created_by);
CREATE INDEX CONCURRENTLY idx_predictions_model_id ON predictions(model_id);
CREATE INDEX CONCURRENTLY idx_predictions_created_at ON predictions(created_at);

-- Analyze tables for query optimization
ANALYZE models;
ANALYZE predictions;
ANALYZE users;
```

#### Caching Strategy
```python
# backend/app/services/cache_service.py
import redis
import json
from typing import Any, Optional

class CacheService:
    def __init__(self):
        self.redis_client = redis.Redis(
            host='redis',
            port=6379,
            decode_responses=True
        )
    
    def get(self, key: str) -> Optional[Any]:
        data = self.redis_client.get(key)
        return json.loads(data) if data else None
    
    def set(self, key: str, value: Any, ttl: int = 3600):
        self.redis_client.setex(
            key, 
            ttl, 
            json.dumps(value, default=str)
        )
    
    def delete(self, key: str):
        self.redis_client.delete(key)

# Usage in API endpoints
@router.get("/models/{model_id}")
async def get_model(model_id: str, cache: CacheService = Depends()):
    cache_key = f"model:{model_id}"
    
    # Try cache first
    cached_model = cache.get(cache_key)
    if cached_model:
        return cached_model
    
    # Fetch from database
    model = get_model_from_db(model_id)
    
    # Cache for 1 hour
    cache.set(cache_key, model, ttl=3600)
    
    return model
```

### Frontend Optimization

#### Build Optimization
```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: true,
    port: 3000
  }
});
```

#### Code Splitting
```jsx
// src/routes/AppRoutes.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Lazy load components
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const DataUpload = lazy(() => import('../pages/Data/DataUpload'));
const ModelTraining = lazy(() => import('../pages/Model/ModelTraining'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="/data/upload" element={
          <Suspense fallback={<LoadingSpinner />}>
            <DataUpload />
          </Suspense>
        } />
        <Route path="/model/training" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ModelTraining />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
}
```

## Security Hardening 🔒

### Network Security

#### Firewall Configuration
```bash
# UFW setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# IPTables rules
sudo iptables -A INPUT -p tcp --dport 22 -s YOUR_IP -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j DROP
```

#### Docker Security
```yaml
# docker-compose.prod.yml
services:
  backend:
    # ... other config
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
    user: "1001:1001"
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
```

### Application Security

#### Environment Variable Security
```bash
# Use Docker secrets for sensitive data
echo "your-secret-key" | docker secret create db_password -

# In docker-compose.yml
services:
  backend:
    environment:
      - DATABASE_URL=postgresql://ml_user:${DB_PASSWORD}@db:5432/ml_engine
    secrets:
      - db_password
```

#### Input Validation
```python
# backend/app/utils/validators.py
import re
from typing import Any
from pydantic import validator

class SecurityValidator:
    @staticmethod
    def validate_email(email: str) -> str:
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, email):
            raise ValueError("Invalid email format")
        return email.lower()
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        # Remove path traversal attempts
        filename = filename.replace('..', '').replace('/', '').replace('\\', '')
        # Limit length
        if len(filename) > 255:
            filename = filename[:255]
        return filename
    
    @staticmethod
    def validate_file_content(content: bytes) -> bool:
        # Check for malicious content
        malicious_patterns = [
            b'<script',
            b'javascript:',
            b'vbscript:',
            b'onload=',
            b'onerror='
        ]
        
        for pattern in malicious_patterns:
            if pattern in content.lower():
                return False
        return True
```

## Troubleshooting 🔧

### Common Issues

#### Database Connection Issues
```bash
# Check database status
docker-compose exec db pg_isready -U ml_user

# View database logs
docker-compose logs db

# Test connection from backend
docker-compose exec backend python -c "
from app.database.db import engine
try:
    engine.connect()
    print('✅ Database connection successful')
except Exception as e:
    print(f'❌ Database connection failed: {e}')
"
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Test SSL configuration
sudo nginx -t

# Renew certificate manually
sudo certbot renew --dry-run

# Check nginx logs for SSL errors
sudo tail -f /var/log/nginx/error.log
```

#### Performance Issues
```bash
# Check system resources
docker stats

# Monitor database performance
docker-compose exec db psql -U ml_user -d ml_engine -c "
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
"

# Check application logs
docker-compose logs -f backend
```

### Debug Mode

#### Enable Debug Logging
```python
# backend/app/core/config.py
import logging

DEBUG = os.getenv("DEBUG", "false").lower() == "true"
LOG_LEVEL = "DEBUG" if DEBUG else "INFO"

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

#### Health Check Endpoints
```python
# backend/main.py
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "2.0.0",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

@app.get("/health/detailed")
async def detailed_health_check():
    checks = {
        "database": check_database_health(),
        "redis": check_redis_health(),
        "disk_space": check_disk_space(),
    }
    
    all_healthy = all(checks.values())
    status_code = 200 if all_healthy else 503
    
    return JSONResponse(
        content={
            "status": "healthy" if all_healthy else "unhealthy",
            "checks": checks
        },
        status_code=status_code
    )
```

### Monitoring Alerts

#### Prometheus Alert Rules
```yaml
# monitoring/rules/alerts.yml
groups:
  - name: ml_engine_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: DatabaseDown
        expr: up{job="postgres"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database is down"
          description: "PostgreSQL database has been down for more than 1 minute"

      - alert: HighMemoryUsage
        expr: (container_memory_usage_bytes / container_spec_memory_limit_bytes) > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is above 90% for {{ $labels.container_label_com_docker_compose_service }}"
```

---

For additional support or questions, please refer to the [documentation](../README.md) or create an issue in the project repository.
