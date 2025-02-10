# Library Mapper - Technical Architecture

## 1. Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // hashed
  name: String,
  joinDate: Date,
  isVerified: Boolean,
  contributions: {
    libraries: [ObjectId],
    comments: [ObjectId],
    ratings: [ObjectId]
  }
}
```

### Libraries Collection
```javascript
{
  _id: ObjectId,
  name: String,
  address: {
    street: String,
    city: String,
    postcode: String,
    borough: String
  },
  location: {
    type: "Point",
    coordinates: [Number, Number] // [longitude, latitude]
  },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    // ... rest of week
  },
  contactDetails: {
    phone: String,
    email: String,
    website: String
  },
  photos: [{
    url: String,
    uploadedBy: ObjectId,
    uploadDate: Date,
    isMain: Boolean
  }],
  description: String,
  addedBy: ObjectId,
  addedDate: Date,
  lastUpdated: Date,
  averageRating: Number,
  ratingCount: Number
}
```

### Comments Collection
```javascript
{
  _id: ObjectId,
  libraryId: ObjectId,
  userId: ObjectId,
  content: String,
  timestamp: Date,
  isEdited: Boolean,
  reports: [{
    userId: ObjectId,
    reason: String,
    timestamp: Date
  }]
}
```

### Ratings Collection
```javascript
{
  _id: ObjectId,
  libraryId: ObjectId,
  userId: ObjectId,
  rating: Number, // 1-5
  timestamp: Date
}
```

## 2. API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/reset-password
GET    /api/auth/verify-email/:token
```

### Users
```
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/:id/contributions
PUT    /api/users/password
```

### Libraries
```
GET    /api/libraries
GET    /api/libraries/:id
POST   /api/libraries
PUT    /api/libraries/:id
GET    /api/libraries/search
GET    /api/libraries/nearby
```

### Media
```
POST   /api/libraries/:id/photos
DELETE /api/libraries/:id/photos/:photoId
```

### Comments
```
GET    /api/libraries/:id/comments
POST   /api/libraries/:id/comments
PUT    /api/comments/:id
DELETE /api/comments/:id
POST   /api/comments/:id/report
```

### Ratings
```
POST   /api/libraries/:id/ratings
PUT    /api/libraries/:id/ratings
GET    /api/libraries/:id/ratings/summary
```

## 3. Technology Stack

### Frontend
- HTML5/CSS3
- Vanilla JavaScript
- Leaflet.js for mapping
- Stadia Maps for map tiles

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

### Storage
- MongoDB Atlas for database
- Cloud storage (e.g., AWS S3) for images

### Development Tools
- Git for version control
- ESLint for code linting
- npm for package management

### Security
- bcrypt for password hashing
- helmet for HTTP headers
- cors for Cross-Origin Resource Sharing
- rate-limiting for API protection
``` 