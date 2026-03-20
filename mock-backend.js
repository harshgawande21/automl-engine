const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 8000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());

// Mock database
let users = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@local',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'admin' hashed
        role: 'admin',
        organization: 'AutoInsight',
        createdAt: new Date().toISOString()
    }
];

let models = [];
let datasets = [];
let predictions = [];

// JWT Secret
const JWT_SECRET = 'your-secret-key-change-in-production';

// Helper functions
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ detail: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ detail: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'AutoInsight ML Engine API', 
        status: 'running',
        version: '1.0.0'
    });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ detail: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
            role: 'user',
            organization: '',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        res.json({
            message: 'Registration successful',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ detail: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ detail: 'Invalid email or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ detail: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            access_token: token,
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                organization: user.organization
            }
        });
    } catch (error) {
        res.status(500).json({ detail: 'Login failed' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ detail: 'User not found' });
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization
    });
});

app.put('/api/auth/profile', authenticateToken, (req, res) => {
    const { name, organization, role } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
        return res.status(404).json({ detail: 'User not found' });
    }

    users[userIndex] = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        organization: organization || users[userIndex].organization,
        role: role || users[userIndex].role
    };

    res.json({
        message: 'Profile updated successfully',
        user: {
            id: users[userIndex].id,
            name: users[userIndex].name,
            email: users[userIndex].email,
            role: users[userIndex].role,
            organization: users[userIndex].organization
        }
    });
});

// Data Routes
app.get('/api/data/datasets', authenticateToken, (req, res) => {
    res.json(datasets);
});

app.post('/api/data/upload', authenticateToken, (req, res) => {
    const { name, size, type } = req.body;
    const newDataset = {
        id: datasets.length + 1,
        name,
        size: size || '0 MB',
        type: type || 'csv',
        status: 'ready',
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.user.id
    };
    
    datasets.push(newDataset);
    res.json({ message: 'Dataset uploaded successfully', dataset: newDataset });
});

// Model Routes
app.get('/api/model/list', authenticateToken, (req, res) => {
    res.json(models);
});

app.post('/api/model/train', authenticateToken, (req, res) => {
    const { taskType, algorithm, targetColumn, testSize } = req.body;
    
    const newModel = {
        id: models.length + 1,
        name: `${algorithm}_${Date.now()}`,
        algorithm,
        taskType,
        accuracy: Math.random() * 0.3 + 0.7, // Random accuracy between 0.7-1.0
        status: 'completed',
        createdAt: new Date().toISOString(),
        createdBy: req.user.id
    };
    
    models.push(newModel);
    res.json({ message: 'Model trained successfully', model: newModel });
});

// Prediction Routes
app.post('/api/prediction/single', authenticateToken, (req, res) => {
    const { features, model_id } = req.body;
    
    const prediction = {
        id: predictions.length + 1,
        prediction: Math.random().toFixed(2),
        confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
        features,
        modelId: model_id || 'latest',
        createdAt: new Date().toISOString(),
        userId: req.user.id
    };
    
    predictions.push(prediction);
    res.json({ message: 'Prediction completed', prediction });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ detail: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ detail: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Mock Backend Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`🔧 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
