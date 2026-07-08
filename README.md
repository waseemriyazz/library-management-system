# Library Management System

A full-stack CRUD (Create, Read, Update, Delete) application for managing library resources.

## Features

- **Book Management**: Add, update, view, and delete books
- **Author Management**: Manage author information
- **Category Management**: Organize books by categories
- **Borrowing System**: Track book borrowing and returns
- **Member Management**: Manage library members
- **Modern UI**: Responsive web interface with Next.js

## Tech Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: SQLite (easily configurable to PostgreSQL/MySQL)
- **ORM**: TypeORM
- **Validation**: class-validator
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

## Project Structure

```
library-management-system/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── books/
│   │   ├── authors/
│   │   ├── categories/
│   │   ├── members/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/                # Next.js App
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local
├── README.md
└── .gitignore
```

## Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Git

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/waseemriyazz/library-management-system.git
cd library-management-system
```

2. Navigate to backend and install dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure the database connection in `backend/.env` file

5. Start the backend server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend folder (in a new terminal):
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3001`

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Test
```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Endpoints

### Books
- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Create a new book
- `PUT /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book

### Authors
- `GET /authors` - Get all authors
- `GET /authors/:id` - Get author by ID
- `POST /authors` - Create a new author
- `PUT /authors/:id` - Update an author
- `DELETE /authors/:id` - Delete an author

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create a new category
- `PUT /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

### Members
- `GET /members` - Get all members
- `GET /members/:id` - Get member by ID
- `POST /members` - Create a new member
- `PUT /members/:id` - Update a member
- `DELETE /members/:id` - Delete a member

## Backend API Endpoints

### Books
- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Create a new book
- `PUT /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book

### Authors
- `GET /authors` - Get all authors
- `GET /authors/:id` - Get author by ID
- `POST /authors` - Create a new author
- `PUT /authors/:id` - Update an author
- `DELETE /authors/:id` - Delete an author

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create a new category
- `PUT /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

### Members
- `GET /members` - Get all members
- `GET /members/:id` - Get member by ID
- `POST /members` - Create a new member
- `PUT /members/:id` - Update a member
- `DELETE /members/:id` - Delete a member

### API Documentation
- Swagger UI: `http://localhost:3000/api`

## Database Schema

### Books
- id
- title
- isbn
- publishedDate
- authorId (foreign key)
- categoryId (foreign key)
- availableCopies
- totalCopies

### Authors
- id
- firstName
- lastName
- email
- biography

### Categories
- id
- name
- description

### Members
- id
- firstName
- lastName
- email
- membershipDate
- active

## Frontend Features

- Dashboard with statistics
- Book listing with search and filters
- Book detail view
- Add/Edit book forms
- Author management
- Category management
- Member management
- Borrowing/Return tracking
- Responsive design for mobile and desktop

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm run test
npm run test:e2e
npm run test:cov
```

### Building for Production
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

- Waseem Riyaz

## Support

For support, email waseemriyazz@gmail.com or open an issue on GitHub.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

- Waseem Riyaz

## Support

For support, email waseemriyazz@gmail.com or open an issue on GitHub.