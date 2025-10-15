# Contributing to StartWise

Thank you for your interest in contributing to StartWise! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/startwise.git
   cd startwise
   ```
3. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

## 🔧 Development Setup

1. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

2. **Set up database**
   ```bash
   cd backend
   node setup-admin-database.js
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

## 📋 Code Standards

### Frontend (React)
- Use functional components with hooks
- Follow component naming conventions
- Use Tailwind CSS for styling
- Write unit tests for new components

### Backend (Node.js)
- Use async/await for database operations
- Implement proper error handling
- Use parameterized queries for SQL
- Write API tests for new endpoints

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

## 📝 Commit Message Format

Use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## 🧪 Testing

- Frontend tests: `cd frontend && npm test`
- Backend tests: `cd backend && npm test`
- All tests: `npm test`

## 📖 Documentation

- Update README.md for major changes
- Comment complex code sections
- Update API documentation for endpoint changes

## 🚨 Reporting Issues

Use the issue templates:
- Bug reports: Use the bug report template
- Feature requests: Use the feature request template

## 💡 Questions?

Feel free to open an issue for questions or reach out to the maintainers.

## 🏆 Recognition

Contributors will be added to the README.md file.

Thank you for contributing to StartWise! 🎉