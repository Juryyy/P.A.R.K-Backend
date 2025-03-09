# P.A.R.K. Admin Backend

A comprehensive RESTful API server for P.A.R.K. language examination management and administration. This backend supports the Vue.js frontend application and provides endpoints for scheduling exams, managing availability of examiners and invigilators, and handling exam-related resources.

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication with refresh tokens and 2FA
- **Email**: Microsoft Graph API for email services
- **File Storage**: OneDrive integration for document management
- **PDF Generation**: PDF-make for creating reports
- **Validation**: Zod for schema validation
- **Logging**: Winston for logging

## Development Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone [repository-url]
   cd park-admin-backend
   ```

2. Install dependencies
   ```bash
   npm install
   # or with yarn
   yarn
   ```

3. Set up environment variables
   Create a `.env` file in the project root with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/parkadmin
   JWT_SECRET=your-jwt-secret
   JWT_SALT=your-jwt-salt
   NODE_ENV=development
   EXP_ACCESS=1h
   EXP_REFRESH=7d
   FRONTEND_URL=http://localhost:8080
   PORT=4000
   SITE_ID=your-onedrive-site-id
   EMAIL_SENDER_PARK=your-email-sender
   EMAIL_SENDER_NAME_PARK=your-email-sender-name
   CLIENT_ID=your-microsoft-app-client-id
   TENANT_ID=your-microsoft-tenant-id
   CLIENT_SECRET=your-microsoft-app-client-secret
   ```

4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server
   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

## Project Structure

```
src/
├── configs/            # Configuration files
│   ├── env-config.ts   # Environment variables handling
│   ├── jwt-config.ts   # JWT authentication configuration
│   ├── mail-config.ts  # Email service configuration
│   └── ...
├── controllers/        # Request handlers
│   ├── admin/          # Admin-specific controllers
│   ├── auth-controller.ts
│   ├── dayOfExams-controller.ts
│   ├── exam-controller.ts
│   └── ...
├── helpers/            # Helper utilities
│   ├── Schemas/        # Zod validation schemas
│   ├── format-date.ts
│   ├── mail-helper.ts
│   └── ...
├── middlewares/        # Express middlewares
│   ├── admin/          # Admin-specific middlewares
│   ├── tokenVerify-middleware.ts
│   ├── pdf-middleware.ts
│   └── ...
├── routes/             # API endpoint routes
│   ├── admin/          # Admin-specific routes
│   ├── auth-router.ts
│   ├── dayOfExams-router.ts
│   └── ...
├── scheduler/          # Scheduled tasks
│   ├── dailyLock.ts
│   └── totaraReset.ts
├── services/           # Business logic layer
│   ├── auth-service.ts
│   ├── dayOfExams-service.ts
│   ├── exam-service.ts
│   └── ...
├── tests/              # Test files
│   ├── Integration/    # Integration tests
│   ├── Unit/           # Unit tests
│   └── ...
├── types/              # TypeScript type definitions
├── app.ts              # Express application setup
└── router.ts           # Main router configuration
```

## Key Features

- **Authentication**: Secure JWT-based authentication with refresh tokens and email 2FA
- **User Management**: Multi-role support (Office, Supervisor, Invigilator, Examiner, Developer)
- **Exam Management**: Create, schedule, assign staff, track preparation and completion status
- **Availability System**: Users indicate availability (Yes, AM, PM, No) for specific dates by center
- **Substitution System**: Staff can request and apply for substitutions with approval workflow
- **File Management**: Upload and download files with OneDrive integration
- **PDF Generation**: Create exam day reports with PDF-make
- **Email Notifications**: Send notifications for important events using Microsoft Graph API
- **Center-Based Administration**: Support for multiple examination centers

## API Endpoints

### Authentication
- `POST /api/auth/login`: Login with email and password
- `POST /api/auth/verify`: Verify 2FA code
- `POST /api/auth/refresh-token`: Refresh authentication tokens
- `DELETE /api/auth/logout`: Logout user
- `POST /api/auth/password-update`: Update user password
- `POST /api/auth/password-reset`: Reset user password

### User Management
- `GET /api/users/allUsers`: Get all users
- `GET /api/users/profile/:id`: Get user profile
- `GET /api/users/userInfo`: Get current user info
- `PUT /api/users/update`: Update user profile
- `POST /api/users/upload`: Upload user avatar

### Exam Days
- `POST /api/examDays/create`: Create a new exam day
- `GET /api/examDays/examDays`: Get upcoming exam days
- `DELETE /api/examDays/delete/:id`: Delete an exam day
- `PUT /api/examDays/changeLock/:id`: Toggle lock status of an exam day
- `POST /api/examDays/informUsers`: Send availability notification to users

### Exams
- `POST /api/exams/createExam`: Create a new exam
- `GET /api/exams/allExams`: Get all exams
- `GET /api/exams/upcomingExams`: Get upcoming exams with details
- `GET /api/exams/:id`: Get exam by ID
- `DELETE /api/exams/:id`: Delete an exam
- `POST /api/exams/addWorker`: Add a worker to an exam
- `POST /api/exams/removeWorker`: Remove a worker from an exam
- `POST /api/exams/createDayReport`: Create a day report for an exam
- `PUT /api/exams/updateExam`: Update exam details
- `PUT /api/exams/updateCompleted`: Update exam completion status
- `PUT /api/exams/updatePrepared`: Update exam preparation status

### Responses
- `PUT /api/responses/update`: Update user responses
- `GET /api/responses/responses`: Get responses for current user
- `GET /api/responses/responsesExamDay/:id`: Get all responses for a specific exam day

### Posts
- `POST /api/posts/create`: Create a new post
- `GET /api/posts/posts`: Get posts for current user
- `DELETE /api/posts/delete/:id`: Delete a post

### Substitutions
- `POST /api/substitutions/create`: Create a substitution request
- `GET /api/substitutions`: Get substitutions for current user
- `POST /api/substitutions/apply/:substitutionId`: Apply for a substitution
- `DELETE /api/substitutions/cancel/:substitutionId`: Cancel a substitution request
- `DELETE /api/substitutions/withdraw/:id`: Withdraw a substitution application

### Admin
- `POST /api/office/registerUser`: Register a new user
- `POST /api/office/updateUserRole`: Update user roles
- `POST /api/office/updateUserLevel`: Update user level
- `GET /api/office/locationsWithVenues`: Get locations with venues
- `POST /api/office/addLocation`: Add a new location
- `POST /api/office/addVenue`: Add a new venue

## Authentication Flow

1. User logs in with email and password (`/api/auth/login`)
2. System sends a verification code to user's email
3. User verifies the code (`/api/auth/verify`)
4. System issues JWT access and refresh tokens
5. Tokens are stored as HTTP-only cookies
6. Access token is used for API requests
7. Refresh token is used to obtain new tokens when access token expires

## Role-Based Access

- Route guards are implemented in middleware functions
- User roles determine available API endpoints and permissions
- Office and Developer roles have access to admin functions
- Exam access is restricted to assigned staff or admin users

## Development Guidelines

### Adding New Features

1. Define new types in `types/` if necessary
2. Implement service functions in appropriate service file
3. Create or update controllers for new business logic
4. Define routes in the appropriate router file
5. Update relevant validation schemas if needed
6. Add tests for new functionality

### API Integration

- All database operations should go through service layer
- Use Zod schemas for request validation
- Follow the established patterns in existing controllers
- Use try/catch blocks for error handling

### Error Handling

- Use appropriate HTTP status codes
- Return consistent error response format
- Log errors with Winston logger
- Include helpful error messages for debugging

## Build and Deployment

### Building for Production

```bash
npm run build
# or with yarn
yarn build
```

For production deployment:
1. Set `NODE_ENV=production` in the `.env` file
2. Configure proper security measures (HTTPS, rate limiting, etc.)
3. Set up a process manager like PM2
4. Configure reverse proxy with Nginx

### PM2 Deployment

```bash
pm2 start dist/app.js --name park-backend
```

## Testing

The project includes both unit tests and integration tests.

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration
```

## Version History

The application follows semantic versioning. Current version: 0.1.5.

## Contact

For questions or support, contact the development team.

---

© 2025 P.A.R.K. Exams Centre