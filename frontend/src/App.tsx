import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login/Login.tsx';
import { Register } from './pages/register/Register.tsx';
import { Home } from './pages/home/Home.tsx';
import { MyCourses } from './pages/my-courses/MyCourses.tsx';
import { Course } from './pages/course/Course.tsx';
import { Lesson } from './pages/lesson/Lesson.tsx';
import { AdminLayout } from './components/AdminLayout/AdminLayout.tsx';
import { RoleProtectedRoute } from './components/RoleProtectedRoute/RoleProtectedRoute.tsx';
import { Users } from './pages/admin/users/Users.tsx';
import { Courses } from './pages/admin/courses/Courses.tsx';
import { Lessons } from './pages/admin/lessons/Lessons.tsx';
import { Quizzes } from './pages/admin/quizzes/Quizzes.tsx';
import { Enrollments } from './pages/admin/enrollments/Enrollments.tsx';
import { Progress } from './pages/admin/progress/Progress.tsx';
import { QuizAttempts } from './pages/admin/quiz-attempts/QuizAttempts.tsx';
import { Dashboard } from './pages/admin/Dashboard.tsx';
import { useAuthContext } from './contexts/auth.context';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <Course />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/:id"
          element={
            <ProtectedRoute>
              <Lesson />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <AdminLayout />
            </RoleProtectedRoute>
          }
        >
          <Route
            index
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <Dashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <RoleProtectedRoute allowedRoles="ADMIN">
                <Users />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="courses"
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <Courses />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="lessons"
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <Lessons />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="quizzes"
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <Quizzes />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="enrollments"
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <Enrollments />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="progress"
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <Progress />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="quiz-attempts"
            element={
              <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <QuizAttempts />
              </RoleProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
