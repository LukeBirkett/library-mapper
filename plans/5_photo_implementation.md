# Photo Management System Implementation Plan

## Overview
The photo management system allows users to add, update, and delete photos for libraries, ensuring proper storage, retrieval, and association with libraries and users.

## Technical Requirements

### 1. Storage System
- Cloud storage (AWS S3) for:
  - Secure file storage
  - CDN delivery
  - Backup and redundancy
  - Cost-effective scaling

### 2. File Handling
- File types: jpg, jpeg, png
- Max file size: 5MB
- Image optimization
- Unique filename generation
- Temporary local storage

### 3. API Endpoints
```
POST   /api/libraries/:id/photos       - Upload photo
DELETE /api/libraries/:id/photos/:photoId  - Delete photo
PATCH  /api/libraries/:id/photos/:photoId/main - Set as main photo
GET    /api/libraries/:id/photos       - Get all photos
```

### 4. Implementation Steps

1. **Setup Phase**
   - [ ] Install dependencies
     - multer (file handling)
     - aws-sdk (S3 integration)
     - sharp (image processing)
   - [ ] Configure S3 bucket
   - [ ] Set up environment variables

2. **Middleware Creation**
   - [ ] File upload middleware
     - File size validation
     - File type validation
     - Temporary storage
   - [ ] Image processing middleware
     - Resize images
     - Optimize quality
     - Generate thumbnails

3. **Controller Implementation**
   ```javascript
   // Photo upload
   exports.uploadPhoto = async (req, res) => {
     // Handle file upload
     // Process image
     // Upload to S3
     // Save URL to database
   }

   // Delete photo
   exports.deletePhoto = async (req, res) => {
     // Delete from S3
     // Remove from database
   }

   // Set main photo
   exports.setMainPhoto = async (req, res) => {
     // Update isMain flags
   }

   // Get photos
   exports.getPhotos = async (req, res) => {
     // Return photo list
   }
   ```

4. **Model Updates**
   ```javascript
   photos: [{
     url: String,
     thumbnailUrl: String,
     uploadedBy: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
     },
     uploadDate: Date,
     isMain: Boolean,
     size: Number,
     mimeType: String
   }]
   ```

5. **Authorization Rules**
   - Any authenticated user can add photos
   - Only photo uploader or library creator can delete
   - Library creator can set main photo
   - Public access for viewing

### 5. Testing Plan

1. **Unit Tests**
   - File validation
   - Image processing
   - S3 integration
   - Database updates

2. **Integration Tests**
   ```bash
   # Upload photo
   curl -X POST /api/libraries/:id/photos \
     -H "Authorization: Bearer $TOKEN" \
     -F "photo=@/path/to/photo.jpg"

   # Delete photo
   curl -X DELETE /api/libraries/:id/photos/:photoId \
     -H "Authorization: Bearer $TOKEN"

   # Set main photo
   curl -X PATCH /api/libraries/:id/photos/:photoId/main \
     -H "Authorization: Bearer $TOKEN"
   ```

3. **Error Cases**
   - Invalid file types
   - File too large
   - Unauthorized access
   - Invalid library ID
   - S3 upload failures

### 6. Security Considerations
- Secure URL generation
- File type validation
- User authorization
- Rate limiting
- Virus scanning
- CORS configuration

### 7. Performance Optimization
- Image compression
- Thumbnail generation
- CDN integration
- Caching strategies
- Batch operations

## Implementation Order
1. Basic file upload
2. S3 integration
3. Image processing
4. Database integration
5. Authorization rules
6. Error handling
7. Testing
8. Performance optimization 