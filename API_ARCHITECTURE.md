# API Architecture & Endpoints

## Overview
RESTful API design for the Builder App with clear endpoint structure, authentication, and best practices.

---

## Base URL
```
Production: https://api.builderapps.com/v1
Staging: https://staging-api.builderapps.com/v1
Development: http://localhost:3000/api/v1
```

---

## Authentication

### JWT Token-Based Authentication

**Headers Required**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Token Structure**:
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "client|designer|builder|admin",
  "exp": 1234567890
}
```

---

## API Endpoints

### 1. Authentication & Users

#### POST /auth/register
Register a new user account.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "client"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "client"
    },
    "token": "jwt_token_here"
  }
}
```

---

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "client"
    },
    "token": "jwt_token_here"
  }
}
```

---

#### POST /auth/logout
Invalidate current session.

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### POST /auth/forgot-password
Request password reset.

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

#### GET /users/me
Get current user profile.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "client",
    "avatarUrl": "https://cdn.example.com/avatars/user.jpg",
    "notificationPreferences": {
      "email": true,
      "sms": false,
      "push": true
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

#### PATCH /users/me
Update current user profile.

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "notificationPreferences": {
    "email": true,
    "sms": true,
    "push": true
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "data": { /* updated user object */ }
}
```

---

### 2. Projects

#### GET /projects
List all projects for current user.

**Query Parameters**:
- `status` (optional): filter by status
- `page` (optional): page number (default: 1)
- `limit` (optional): items per page (default: 20)
- `sort` (optional): sort field (default: createdAt)
- `order` (optional): asc|desc (default: desc)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "projectName": "Dream Home 2024",
        "projectType": "new_construction",
        "status": "design",
        "address": "123 Main St, City, State",
        "budgetMin": 300000,
        "budgetMax": 400000,
        "totalSqft": 2500,
        "thumbnailUrl": "https://cdn.example.com/projects/thumb.jpg",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

#### POST /projects
Create a new project.

**Request Body**:
```json
{
  "projectName": "My Dream Home",
  "projectType": "new_construction",
  "address": "123 Main St, City, State",
  "lotSizeSqft": 10000,
  "budgetMin": 300000,
  "budgetMax": 400000,
  "description": "Modern 3-bedroom home with open floor plan"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": { /* created project object */ }
}
```

---

#### GET /projects/:projectId
Get detailed project information.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectName": "Dream Home 2024",
    "projectType": "new_construction",
    "status": "design",
    "address": "123 Main St, City, State",
    "lotSizeSqft": 10000,
    "budgetMin": 300000,
    "budgetMax": 400000,
    "description": "Modern home with open floor plan",
    "owner": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "teamMembers": [
      {
        "id": "uuid",
        "firstName": "Jane",
        "lastName": "Designer",
        "role": "lead_designer"
      }
    ],
    "activeDesign": {
      "id": "uuid",
      "designName": "Version 3",
      "totalSqft": 2500,
      "numBedrooms": 3,
      "numBathrooms": 2.5
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

---

#### PATCH /projects/:projectId
Update project details.

**Request Body**:
```json
{
  "projectName": "Updated Name",
  "status": "construction",
  "estimatedCompletionDate": "2025-06-01"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": { /* updated project object */ }
}
```

---

#### DELETE /projects/:projectId
Delete a project (soft delete).

**Response** (200):
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

### 3. Designs

#### GET /projects/:projectId/designs
List all design versions for a project.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "designs": [
      {
        "id": "uuid",
        "versionNumber": 3,
        "designName": "Modern Ranch v3",
        "totalSqft": 2500,
        "numBedrooms": 3,
        "numBathrooms": 2.5,
        "numStories": 1,
        "style": "modern",
        "isActive": true,
        "isApproved": false,
        "thumbnailUrl": "https://cdn.example.com/designs/thumb.jpg",
        "createdAt": "2024-01-10T00:00:00Z"
      }
    ]
  }
}
```

---

#### POST /projects/:projectId/designs
Create a new design version.

**Request Body**:
```json
{
  "designName": "Modern Ranch v4",
  "description": "Updated layout with expanded kitchen",
  "numBedrooms": 3,
  "numBathrooms": 2.5,
  "numStories": 1,
  "style": "modern"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": { /* created design object */ }
}
```

---

#### GET /designs/:designId
Get detailed design information.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "versionNumber": 3,
    "designName": "Modern Ranch v3",
    "description": "Open concept with large kitchen",
    "totalSqft": 2500,
    "numBedrooms": 3,
    "numBathrooms": 2.5,
    "numStories": 1,
    "style": "modern",
    "isActive": true,
    "isApproved": false,
    "floorPlans": [
      {
        "id": "uuid",
        "floorNumber": 1,
        "floorName": "Main Floor",
        "thumbnailUrl": "https://cdn.example.com/floors/thumb.jpg"
      }
    ],
    "materialSelections": [
      {
        "id": "uuid",
        "areaType": "flooring",
        "material": {
          "id": "uuid",
          "materialName": "Oak Hardwood",
          "thumbnailUrl": "https://cdn.example.com/materials/oak.jpg"
        }
      }
    ],
    "createdAt": "2024-01-10T00:00:00Z"
  }
}
```

---

#### PATCH /designs/:designId
Update design details.

**Request Body**:
```json
{
  "designName": "Updated Design Name",
  "isActive": true
}
```

---

#### POST /designs/:designId/approve
Approve a design.

**Request Body**:
```json
{
  "comments": "Approved with minor notes"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "isApproved": true,
    "approvedBy": "uuid",
    "approvedAt": "2024-01-15T00:00:00Z"
  }
}
```

---

### 4. Floor Plans

#### GET /designs/:designId/floor-plans
Get all floor plans for a design.

---

#### POST /designs/:designId/floor-plans
Create a new floor plan.

**Request Body**:
```json
{
  "floorNumber": 1,
  "floorName": "Main Floor",
  "floorData": {
    "walls": [/* wall data */],
    "doors": [/* door data */],
    "windows": [/* window data */],
    "rooms": [/* room data */]
  }
}
```

---

#### GET /floor-plans/:floorPlanId
Get detailed floor plan data.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "designId": "uuid",
    "floorNumber": 1,
    "floorName": "Main Floor",
    "floorData": {
      "walls": [
        {
          "id": "wall-1",
          "startX": 0,
          "startY": 0,
          "endX": 100,
          "endY": 0,
          "thickness": 6
        }
      ],
      "rooms": [
        {
          "id": "room-1",
          "name": "Living Room",
          "type": "living",
          "polygon": [[0,0], [100,0], [100,80], [0,80]],
          "sqft": 300
        }
      ]
    },
    "thumbnailUrl": "https://cdn.example.com/floors/thumb.jpg",
    "createdAt": "2024-01-10T00:00:00Z"
  }
}
```

---

#### PATCH /floor-plans/:floorPlanId
Update floor plan data.

**Request Body**:
```json
{
  "floorData": {
    /* updated floor plan JSON */
  }
}
```

---

### 5. Materials

#### GET /materials
Get materials library with filtering.

**Query Parameters**:
- `categoryId` (optional): filter by category
- `search` (optional): search by name
- `minPrice` (optional): minimum price
- `maxPrice` (optional): maximum price
- `available` (optional): only available materials
- `page` (optional): page number
- `limit` (optional): items per page

**Response** (200):
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "id": "uuid",
        "materialName": "Oak Hardwood Flooring",
        "manufacturer": "Premium Wood Co",
        "modelNumber": "OAK-123",
        "description": "Beautiful natural oak hardwood",
        "pricePerUnit": 8.50,
        "unitType": "sqft",
        "color": "Natural",
        "finish": "Matte",
        "thumbnailUrl": "https://cdn.example.com/materials/oak.jpg",
        "imageUrls": [
          "https://cdn.example.com/materials/oak1.jpg",
          "https://cdn.example.com/materials/oak2.jpg"
        ],
        "sustainabilityRating": "FSC Certified",
        "isAvailable": true,
        "isPremium": false,
        "category": {
          "id": "uuid",
          "categoryName": "Flooring"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

#### GET /materials/:materialId
Get detailed material information.

---

#### GET /material-categories
Get all material categories.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "categoryName": "Flooring",
        "description": "All flooring materials",
        "iconUrl": "https://cdn.example.com/icons/flooring.svg",
        "subcategories": [
          {
            "id": "uuid",
            "categoryName": "Hardwood",
            "parentCategoryId": "uuid"
          }
        ]
      }
    ]
  }
}
```

---

#### POST /designs/:designId/material-selections
Select material for a design area.

**Request Body**:
```json
{
  "roomId": "uuid",
  "areaType": "flooring",
  "materialId": "uuid",
  "quantity": 500,
  "notes": "Main floor living areas"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": { /* material selection object */ }
}
```

---

#### GET /designs/:designId/material-selections
Get all material selections for a design.

---

### 6. Budget

#### GET /projects/:projectId/budget
Get project budget details.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "totalBudget": 400000,
    "contingencyPercentage": 10,
    "items": [
      {
        "id": "uuid",
        "category": "materials",
        "subcategory": "flooring",
        "description": "Oak hardwood flooring",
        "estimatedCost": 12000,
        "actualCost": 11500,
        "paidAmount": 11500,
        "vendor": "Premium Wood Co"
      }
    ],
    "summary": {
      "totalEstimated": 380000,
      "totalActual": 320000,
      "totalPaid": 280000,
      "remaining": 80000,
      "percentComplete": 80
    }
  }
}
```

---

#### POST /projects/:projectId/budget
Create or update budget.

**Request Body**:
```json
{
  "totalBudget": 400000,
  "contingencyPercentage": 10
}
```

---

#### POST /budgets/:budgetId/items
Add budget line item.

**Request Body**:
```json
{
  "category": "materials",
  "subcategory": "flooring",
  "description": "Oak hardwood flooring installation",
  "estimatedCost": 12000,
  "vendor": "Premium Wood Co",
  "notes": "Includes installation"
}
```

---

#### PATCH /budget-items/:itemId
Update budget item.

---

### 7. Milestones

#### GET /projects/:projectId/milestones
Get project milestones.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "milestones": [
      {
        "id": "uuid",
        "milestoneName": "Foundation Complete",
        "description": "Foundation poured and cured",
        "category": "construction",
        "plannedStartDate": "2024-03-01",
        "plannedEndDate": "2024-03-15",
        "actualStartDate": "2024-03-02",
        "actualEndDate": null,
        "status": "in_progress",
        "completionPercentage": 60,
        "assignedTo": {
          "id": "uuid",
          "firstName": "Mike",
          "lastName": "Builder"
        }
      }
    ]
  }
}
```

---

#### POST /projects/:projectId/milestones
Create new milestone.

---

#### PATCH /milestones/:milestoneId
Update milestone.

**Request Body**:
```json
{
  "status": "completed",
  "actualEndDate": "2024-03-14",
  "completionPercentage": 100
}
```

---

### 8. Documents

#### GET /projects/:projectId/documents
List project documents.

**Query Parameters**:
- `type` (optional): filter by document type
- `tags` (optional): filter by tags
- `search` (optional): search document names

**Response** (200):
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "uuid",
        "documentName": "Construction Contract",
        "documentType": "contract",
        "fileUrl": "https://cdn.example.com/docs/contract.pdf",
        "fileSizeBytes": 524288,
        "mimeType": "application/pdf",
        "versionNumber": 1,
        "tags": ["legal", "signed"],
        "uploadedBy": {
          "id": "uuid",
          "firstName": "John",
          "lastName": "Doe"
        },
        "createdAt": "2024-01-05T00:00:00Z"
      }
    ]
  }
}
```

---

#### POST /projects/:projectId/documents
Upload new document.

**Request** (multipart/form-data):
- `file`: document file
- `documentName`: document name
- `documentType`: document type
- `description`: optional description
- `tags`: optional tags array

**Response** (201):
```json
{
  "success": true,
  "data": { /* uploaded document object */ }
}
```

---

#### GET /documents/:documentId
Get document details and download URL.

---

#### DELETE /documents/:documentId
Delete document.

---

### 9. Communications

#### GET /projects/:projectId/communications
Get project communications.

**Query Parameters**:
- `messageType` (optional): filter by type
- `unreadOnly` (optional): only unread messages

**Response** (200):
```json
{
  "success": true,
  "data": {
    "communications": [
      {
        "id": "uuid",
        "sender": {
          "id": "uuid",
          "firstName": "Jane",
          "lastName": "Designer"
        },
        "messageType": "message",
        "subject": "Design Update",
        "messageBody": "I've updated the floor plan based on your feedback",
        "attachments": [
          {
            "fileName": "floor_plan_v3.pdf",
            "fileUrl": "https://cdn.example.com/attachments/plan.pdf"
          }
        ],
        "isRead": false,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

#### POST /projects/:projectId/communications
Send new message.

**Request Body**:
```json
{
  "messageType": "message",
  "subject": "Question about materials",
  "messageBody": "Can we discuss alternative flooring options?",
  "attachments": []
}
```

---

#### PATCH /communications/:communicationId/read
Mark message as read.

---

### 10. Notifications

#### GET /notifications
Get user notifications.

**Query Parameters**:
- `unreadOnly` (optional): only unread notifications
- `limit` (optional): items per page

**Response** (200):
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "notificationType": "milestone_completed",
        "title": "Milestone Completed",
        "message": "Foundation work has been completed",
        "actionUrl": "/projects/uuid/milestones",
        "isRead": false,
        "createdAt": "2024-01-15T14:20:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

---

#### PATCH /notifications/:notificationId/read
Mark notification as read.

---

#### POST /notifications/mark-all-read
Mark all notifications as read.

---

### 11. Inspiration Gallery

#### GET /gallery
Browse inspiration gallery.

**Query Parameters**:
- `styles` (optional): filter by style tags
- `sizeCategory` (optional): filter by size
- `budgetRange` (optional): filter by budget
- `featured` (optional): only featured projects

**Response** (200):
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "title": "Modern Coastal Home",
        "description": "Beautiful 3-bedroom coastal design",
        "styleTags": ["modern", "coastal"],
        "sizeCategory": "medium",
        "budgetRange": "luxury",
        "featuredImageUrl": "https://cdn.example.com/gallery/coastal1.jpg",
        "galleryImages": [/* array of images */],
        "projectStats": {
          "sqft": 2800,
          "bedrooms": 3,
          "bathrooms": 2.5
        },
        "isFeatured": true,
        "viewCount": 1250,
        "likeCount": 89
      }
    ]
  }
}
```

---

#### POST /gallery/:projectId/like
Like a gallery project.

---

### 12. Analytics & Reporting

#### GET /projects/:projectId/analytics
Get project analytics.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "budget": {
      "percentSpent": 75,
      "remainingBudget": 100000,
      "projectedOverage": 5000
    },
    "timeline": {
      "percentComplete": 60,
      "daysElapsed": 45,
      "daysRemaining": 75,
      "onSchedule": true
    },
    "milestones": {
      "total": 15,
      "completed": 9,
      "inProgress": 3,
      "pending": 3
    }
  }
}
```

---

## Error Handling

All errors follow consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      /* Additional error details */
    }
  }
}
```

**Common Error Codes**:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

---

## Rate Limiting

- **Standard**: 1000 requests per hour per user
- **Upload endpoints**: 100 requests per hour
- **Public endpoints**: 100 requests per hour per IP

Headers included in response:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1234567890
```

---

## Pagination

Standard pagination for list endpoints:

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format**:
```json
{
  "data": { /* results */ },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Webhooks (Optional)

Support for real-time event notifications:

**Supported Events**:
- `project.created`
- `design.approved`
- `milestone.completed`
- `budget.exceeded`
- `document.uploaded`
- `message.received`

**Webhook Payload**:
```json
{
  "event": "milestone.completed",
  "timestamp": "2024-01-15T14:20:00Z",
  "data": {
    "projectId": "uuid",
    "milestoneId": "uuid",
    "milestoneName": "Foundation Complete"
  }
}
```

---

## Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Use pagination** for list endpoints
3. **Implement retry logic** with exponential backoff
4. **Cache responses** where appropriate
5. **Handle rate limits** gracefully
6. **Validate input** on client side before sending
7. **Use HTTPS** in production
8. **Monitor API health** and error rates

---

## SDK Support

Official SDKs available for:
- JavaScript/TypeScript (npm: `@builderapps/sdk`)
- Python (pip: `builderapps-sdk`)
- Swift (iOS)
- Kotlin (Android)

---

## API Versioning

- Version included in URL: `/v1/`
- Breaking changes require new version
- Deprecated versions supported for 12 months
- Migration guides provided for version updates
