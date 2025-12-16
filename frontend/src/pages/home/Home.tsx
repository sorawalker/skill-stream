import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';
import { coursesService } from '../../services/courses.service';
import { enrollmentsService } from '../../services/enrollments.service';
import { CourseCard } from '../../components/CourseCard/CourseCard';
import { CourseModal } from '../../components/CourseModal/CourseModal';
import type { Course, Enrollment } from 'skill-stream-backend/shared/types';
import './Home.scss';

export const Home = () => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'home'],
    queryFn: () => coursesService.findMany({ page: 1, limit: 100, order: 'asc', sortBy: 'id' }),
    enabled: isAuthenticated,
  });

  const { data: enrollments } = useQuery({
    queryKey: ['enrollments', 'home'],
    queryFn: () => enrollmentsService.findMany(),
    enabled: isAuthenticated,
  });

  const getEnrollmentForCourse = (courseId: number): Enrollment | null => {
    return enrollments?.data.find((enrollment) => enrollment.courseId === courseId) || null;
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  const handleGoToCourse = () => {
    if (selectedCourse) {
      navigate(`/courses/${selectedCourse.id}`);
      handleCloseModal();
    }
  };

  return (
    <div className="home-page">
      <div className="home-page__container">
        <div className="home-page__header">
        <h1 className="home-page__title">Skill Stream</h1>
          {isAuthenticated && (
            <button onClick={signOut} className="home-page__sign-out">
              Sign Out
            </button>
          )}
        </div>
        {isAuthenticated ? (
          <div className="home-page__content">
            {coursesLoading ? (
              <p className="home-page__loading">Loading courses...</p>
            ) : (
              <>
                <h2 className="home-page__subtitle">Available Courses</h2>
                <div className="home-page__courses-grid">
                  {courses?.data.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => handleCourseClick(course)}
                    />
                  ))}
                </div>
                {courses?.data.length === 0 && (
                  <p className="home-page__empty">No courses available</p>
                )}
              </>
            )}
          </div>
        ) : (
          <p className="home-page__message">Please sign in to continue</p>
        )}
      </div>
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          enrollment={getEnrollmentForCourse(selectedCourse.id)}
          onClose={handleCloseModal}
          onGoToCourse={handleGoToCourse}
        />
      )}
    </div>
  );
};

