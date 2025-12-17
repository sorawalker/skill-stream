import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { enrollmentsService } from '../../services/enrollments.service';
import { CourseCard } from '../../components/CourseCard/CourseCard';
import { Header } from '../../components/Header/Header';
import './MyCourses.scss';

export const MyCourses = () => {
  const navigate = useNavigate();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['enrollments', 'my-courses'],
    queryFn: () => enrollmentsService.findMany(),
  });

  if (isLoading) {
    return (
      <div className="my-courses-page">
        <Header />
        <div className="my-courses-page__container">
          <p className="my-courses-page__loading">Loading your courses...</p>
        </div>
      </div>
    );
  }

  const enrolledCourses = enrollments?.data || [];

  return (
    <div className="my-courses-page">
      <Header />
      <div className="my-courses-page__container">
        <h1 className="my-courses-page__title">My Courses</h1>
        {enrolledCourses.length === 0 ? (
          <div className="my-courses-page__empty">
            <p>You haven't enrolled in any courses yet.</p>
            <button
              className="my-courses-page__browse-button"
              onClick={() => navigate('/')}
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="my-courses-page__courses-grid">
            {enrolledCourses.map((enrollment) => {
              if (!enrollment.course) return null;
              
              return (
                <CourseCard
                  key={enrollment.id}
                  course={enrollment.course}
                  progress={enrollment.progress}
                  onClick={() => navigate(`/courses/${enrollment.courseId}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

