# Momentum

## Student Productivity Planner

Momentum is a React-based web application designed to help students manage academic work more effectively. It brings assignments, study planning, and progress tracking into one place so that students can stay organized, reduce deadline stress, and build better study consistency.

This project was created as an end-term submission for the course **Building Web Applications with React**.

## Problem Statement

Students often manage their academic life through scattered tools such as reminder apps, notebooks, chat messages, and separate note-taking platforms. Because of this, it becomes difficult to track assignments properly, plan study time in a structured way, and understand actual progress over the semester.

Momentum solves this problem by providing a single productivity platform where students can:

- manage assignments and academic tasks
- plan and record study sessions
- monitor focus and completion progress
- store their data persistently across sessions

## Target Users

- college and university students
- learners managing multiple subjects, assignments, and deadlines
- students who want a structured academic planning system instead of a basic checklist

## Why This Project Matters

This project addresses a real student problem rather than acting as a simple UI clone. The goal is not just to store tasks, but to help students turn scattered work into a focused weekly plan. It combines planning, tracking, and reflection in one application, which makes it more practical and meaningful than a generic to-do app.

## Features

- User authentication with login and signup
- Protected routes for authenticated users only
- Student dashboard with weekly summary and focus insights
- Task manager with full CRUD operations
- Study planner with session logging
- Analytics dashboard showing workload and study trends
- Profile and preference settings
- Persistent storage support
- Responsive design for desktop and mobile

## Core React Concepts Used

- Functional Components
- Props and component composition
- `useState`
- `useEffect`
- Conditional rendering
- Lists and keys
- Lifting state up
- Controlled components
- Routing using React Router
- Context API for shared global state

## Advanced React Concepts Used

- `useMemo` for derived dashboard and analytics calculations
- `React.lazy` for route-level lazy loading
- `Suspense` for async route rendering
- Component-based architecture for reusability and separation of concerns

## Backend and Persistence

The project supports two modes:

### 1. Local demo mode

If no backend environment variables are provided, the application uses browser `localStorage` for authentication-style session behavior and planner data persistence. This allows the project to run immediately.

### 2. Supabase mode

If Supabase environment variables are configured, the application can use:

- Supabase Authentication
- Supabase database persistence

This makes the project suitable for real backend integration as required by the submission guidelines.

## Tech Stack

- React
- Vite
- React Router
- Context API
- Supabase JavaScript client
- Recharts
- Lucide React
- CSS

## Project Structure

```text
src/
  components/
  context/
  hooks/
  pages/
  services/
  utils/
```

## Setup Instructions

### Run locally

```bash
npm install
npm run dev
```

### Production build

```bash
npm run build
```

## Supabase Setup

If you want to connect a real backend:

1. Create a Supabase project.
2. Copy `.env.example` to `.env`.
3. Add your Supabase project URL and anon key.
4. Run the SQL schema from [supabase-schema.sql](/C:/Users/Krishna/Documents/Codex/2026-04-20-end-term-project-submission-guidelines-course/supabase-schema.sql:1).
5. Enable Email Authentication in Supabase.

## Submission Checklist Mapping

This project includes the key items required in the course guidelines:

- clear real-world problem statement
- authentication system
- dashboard or main screen
- multiple core features
- CRUD functionality
- persistent storage
- routing
- state management using Context API
- responsive UI
- structured project architecture

## Future Improvements

- assignment reminders and notifications
- calendar-based planning view
- deadline prioritization with smarter recommendations
- richer productivity analytics
- collaboration features for student teams

## Conclusion

Momentum is designed as a practical student productivity platform rather than a basic task app. It demonstrates React fundamentals, intermediate concepts, backend integration readiness, and a structured user-focused application flow suitable for academic evaluation and portfolio use.
