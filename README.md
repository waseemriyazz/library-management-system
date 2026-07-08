# Library Management System

A basic CRUD (Create, Read, Update, Delete) application built with NestJS for managing library resources.

## Features

- **Book Management**: Add, update, view, and delete books
- **Author Management**: Manage author information
- **Category Management**: Organize books by categories
- **Borrowing System**: Track book borrowing and returns
- **Member Management**: Manage library members

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: SQLite (easily configurable to PostgreSQL/MySQL)
- **ORM**: TypeORM
- **Validation**: class-validator
- **API Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/waseemriyazz/library-management-system.git
cd library-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure the database connection in `.env` file

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

## Project Structure

```
src/
├── books/              # Book module
│   ├── dto/
│   ├── entities/
│   ├── books.controller.ts
│   ├── books.service.ts
│   └── books.module.ts
├── authors/            # Author module
├── categories/         # Category module
├── members/            # Member module
├── app.module.ts
└── main.ts
```

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

- Waseem Riyaz

## Support

For support, email waseemriyazz@gmail.com or open an issue on GitHub.