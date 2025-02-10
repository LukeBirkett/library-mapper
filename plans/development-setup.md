# Development Environment Setup

## 1. Project Structure
```
library-mapper/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── environment.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── libraryController.js
│   │   │   ├── userController.js
│   │   │   └── mediaController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── validation.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Library.js
│   │   │   ├── Comment.js
│   │   │   └── Rating.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── libraries.js
│   │   │   ├── users.js
│   │   │   └── media.js
│   │   ├── utils/
│   │   │   ├── validation.js
│   │   │   └── errorResponse.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── README.md
└── frontend/
    └── ... (we'll focus on this later)
```

## 2. Initial Setup Steps

1. Create project directory and initialize:
```bash
mkdir library-mapper
cd library-mapper
mkdir backend
cd backend
npm init -y
```

2. Install core dependencies:
```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cors helmet express-rate-limit express-validator
```

3. Install development dependencies:
```bash
npm install --save-dev nodemon eslint prettier
```

4. Create .env file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0...
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## 3. Initial Backend Files

### app.js
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/libraries', require('./routes/libraries'));
app.use('/api/users', require('./routes/users'));
app.use('/api/media', require('./routes/media'));

// Error Handler
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
```

### config/database.js
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### middleware/auth.js
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = { protect };
``` 