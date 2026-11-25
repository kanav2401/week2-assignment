
# StaffHub - Employee Management System

## Week 2 - Task 2 | Full Stack Development Internship

StaffHub is a modern, responsive Employee Management System built using the MERN stack. It provides an HR administration interface for managing employee records, monitoring workforce statistics, and performing CRUD operations with persistent cloud database storage.

## Features

- Interactive HR dashboard
- Total employee and department statistics
- Total and average salary calculations
- Department-wise employee distribution
- Recently added employees
- Add new employees
- View employee records
- Edit existing employee information
- Delete employees with confirmation
- Real-time search with debouncing
- Department-based filtering
- Ascending and descending sorting
- Sortable table columns
- Frontend and backend form validation
- Loading indicators
- Success and error notifications
- Responsive desktop and mobile interface
- Persistent MongoDB Atlas database
- RESTful API architecture
- Postman API testing

## Technology Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Lucide React
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- Mongoose
- CORS
- dotenv
- Nodemon

### Database

- MongoDB Atlas

### Development and Testing Tools

- Visual Studio Code
- Postman
- Git
- GitHub
- Chrome Developer Tools

## Project Structure

```text
employee-management/
|
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |   `-- db.js
|   |   |-- controllers/
|   |   |   `-- employeeController.js
|   |   |-- middleware/
|   |   |   `-- errorMiddleware.js
|   |   |-- models/
|   |   |   `-- Employee.js
|   |   |-- routes/
|   |   |   `-- employeeRoutes.js
|   |   `-- server.js
|   |-- package.json
|   `-- package-lock.json
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- Sidebar.jsx
|   |   |   |-- Navbar.jsx
|   |   |   |-- SearchBar.jsx
|   |   |   |-- EmployeeTable.jsx
|   |   |   |-- EmployeeForm.jsx
|   |   |   `-- ConfirmDialog.jsx
|   |   |-- pages/
|   |   |   |-- Dashboard.jsx
|   |   |   |-- Employees.jsx
|   |   |   `-- AddEmployee.jsx
|   |   |-- services/
|   |   |   `-- employeeService.js
|   |   |-- styles/
|   |   |   |-- index.css
|   |   |   |-- App.css
|   |   |   `-- components.css
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- index.html
|   |-- package.json
|   `-- package-lock.json
|
|-- postman/
|   `-- employee-management-api.json
|
|-- screenshots/
`-- README.md
```

## System Architecture

```text
React Frontend
      |
      | HTTP Requests (Axios)
      |
Express REST API
      |
Employee Routes
      |
Employee Controller
      |
Mongoose Model
      |
MongoDB Atlas
```

The application follows a client-server architecture with separate frontend and backend layers. The backend handles database operations, validation, API requests, and centralized error handling.

## Database Schema

Collection: `employees`

| Field | Data Type | Validation |
|---|---|---|
| _id | ObjectId | Automatically generated |
| name | String | Required, 2-100 characters |
| department | String | Required, maximum 100 characters |
| role | String | Required, maximum 100 characters |
| salary | Number | Required, non-negative |
| joinDate | Date | Required, valid date |
| createdAt | Date | Automatically generated |
| updatedAt | Date | Automatically updated |

The schema is defined using Mongoose in:

`backend/src/models/Employee.js`

MongoDB indexes are defined for employee name and department.

## REST API Endpoints

Base URL:

`http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Check server and database health |
| GET | /employees | Retrieve all employees |
| GET | /employees/:id | Retrieve an employee by ID |
| POST | /employees | Create a new employee |
| PUT | /employees/:id | Update an employee |
| DELETE | /employees/:id | Delete an employee |

### Search, Filter and Sort

Search employees:

```http
GET /api/employees?search=Rahul
```

Filter by department:

```http
GET /api/employees?department=Engineering
```

Sort by salary:

```http
GET /api/employees?sortBy=salary&order=desc
```

Combined query:

```http
GET /api/employees?department=Engineering&sortBy=salary&order=asc
```

Supported sorting fields:

- name
- department
- role
- salary
- joinDate
- createdAt
- updatedAt

### Sample POST Request

```json
{
  "name": "Rahul Sharma",
  "department": "Engineering",
  "role": "Software Developer",
  "salary": 45000,
  "joinDate": "2026-06-15"
}
```

### HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Successful request |
| 201 | Employee created successfully |
| 400 | Invalid request or validation error |
| 404 | Resource not found |
| 409 | Duplicate resource conflict |
| 500 | Internal server error |
| 503 | Database service unavailable |

## Installation and Setup

### Prerequisites

- Node.js compatible with the installed Vite version
- npm
- Git
- MongoDB Atlas account
- Postman (optional, for API testing)

### 1. Clone the Repository

Clone this Week 2 assignment repository using its GitHub clone URL.

Navigate to the project:

```bash
cd week2-assignment/employee-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Replace the placeholder MongoDB URI with your own valid connection string.

Configure a database user and allow your current IP address in MongoDB Atlas Network Access.

Start the backend server:

```bash
npm run dev
```

Backend URL:

http://localhost:5000

Health check:

http://localhost:5000/api/health

### 3. Frontend Setup

Open a separate terminal from the employee-management directory.

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory.

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the application:

http://localhost:5173

Keep both frontend and backend servers running.

## Application Pages

| Route | Description |
|---|---|
| / | Workforce dashboard |
| /employees | Employee directory |
| /employees/add | Add employee form |
| /employees/edit/:id | Edit employee form |

## API Testing with Postman

The Postman collection is available in the `postman` directory.

To test the APIs:

1. Start the backend server.
2. Open Postman.
3. Import `employee-management-api.json`.
4. Execute the Create Employee request.
5. Copy the generated employee ID.
6. Replace any saved employee IDs in the GET, PUT and DELETE requests with the newly generated ID.
7. Execute the remaining requests.

Test scenarios include:

- Create employee
- Retrieve all employees
- Retrieve employee by ID
- Update employee
- Search employees
- Filter employees
- Sort employees
- Invalid input validation
- Delete employee
- Verify deleted employee returns 404

## Application Screenshots

### Dashboard

![Dashboard](screenshots/01-dashboard.png)

### Add Employee Form

![Add Employee](screenshots/02-add-employee-form.png)

### Employee Created Successfully

![Employee Created](screenshots/03-employee-added-successfully.png)

### Employee Directory

![Employee Directory](screenshots/04-employee-directory.png)

### Edit Employee

![Edit Employee](screenshots/05-edit-employee-form.png)

### Employee Updated Successfully

![Employee Updated](screenshots/06-employee-updated-successfully.png)

### Search Functionality

![Search Employees](screenshots/07-search-employees.png)

### Department Filtering

![Department Filter](screenshots/08-department-filter.png)

### Salary Sorting

![Salary Sorting](screenshots/09-salary-sorting.png)

### Delete Confirmation

![Delete Confirmation](screenshots/10-delete-confirmation.png)

### Employee Deleted Successfully

![Employee Deleted](screenshots/11-employee-deleted-successfully.png)

### Form Validation

![Form Validation](screenshots/12-form-validation.png)

### Mobile Dashboard

![Mobile Dashboard](screenshots/13-mobile-dashboard.png)

### Mobile Employee Directory

![Mobile Employee Directory](screenshots/14-mobile-employee-directory.png)

### Mobile Add Employee Form

![Mobile Add Employee](screenshots/15-mobile-add-employee.png)

## Functional Testing

| Test Case | Status |
|---|---|
| Dashboard statistics | Passed |
| Create employee | Passed |
| Retrieve employee records | Passed |
| Update employee | Passed |
| Delete confirmation | Passed |
| Delete employee | Passed |
| Search functionality | Passed |
| Department filtering | Passed |
| Sorting functionality | Passed |
| Form validation | Passed |
| Database persistence | Passed |
| Mobile responsiveness | Passed |
| Production compilation | Passed |

## Production Build

Navigate to the frontend directory:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview -- --port 5173 --strictPort
```

The development server must be stopped before starting the preview on the same port.

### Build Results

| Metric | Result |
|---|---|
| Build status | Successful |
| Build time | 1.14 seconds |
| Modules transformed | 2226 |
| CSS bundle | 42.48 kB |
| JavaScript bundle | 369.56 kB |
| Gzipped CSS | 7.83 kB |
| Gzipped JavaScript | 116.68 kB |

## Security and Validation

- Database credentials stored in environment variables
- Environment files excluded from version control
- Server-side field validation
- Client-side form validation
- MongoDB ObjectId validation
- Allowed-field filtering for API requests
- Centralized error-handling middleware
- Configured CORS origin
- Delete confirmation before destructive operations

This project is a local internship demonstration. Authentication and authorization are not implemented in this task. These features must be added before exposing employee records through a public deployment.

## Learning Outcomes

- Developing full-stack MERN applications
- Designing RESTful APIs
- Performing CRUD operations
- Integrating MongoDB Atlas
- Creating reusable React components
- Implementing client-side routing
- Managing asynchronous API requests
- Handling loading and error states
- Implementing search, filtering and sorting
- Designing responsive user interfaces
- Testing APIs using Postman
- Creating production builds
- Maintaining projects using Git and GitHub

## Future Enhancements

- JWT authentication
- Role-based access control
- Employee profile pictures
- Pagination
- CSV and Excel export
- Attendance management
- Leave management
- Payroll management
- Advanced workforce analytics

## Developer

**Kanav Sharma**

B.Tech - Computer Science and Engineering

Punjabi University, Patiala

GitHub: [kanav2401](https://github.com/kanav2401)

## Internship Information

- Domain: Full Stack Development
- Organization: WeIntern
- Week: 2
- Task: 2
- Project: StaffHub - Employee Management System

---

Developed as part of the Full Stack Development Internship.
