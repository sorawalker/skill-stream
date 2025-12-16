import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesService } from '../../services/courses.service';
import { lessonsService } from '../../services/lessons.service';
import type { Lesson } from 'skill-stream-backend/shared/types';
import './Course.scss';

export const Course = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseId = id ? parseInt(id, 10) : null;

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => {
      if (!courseId) throw new Error('Course ID is required');
      return coursesService.findOne(courseId);
    },
    enabled: !!courseId,
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => {
      if (!courseId) throw new Error('Course ID is required');
      return lessonsService.findManyByCourse(courseId, { page: 1, limit: 100, order: 'asc', sortBy: 'order' });
    },
    enabled: !!courseId,
  });

  const handleLessonClick = (lessonId: number) => {
    navigate(`/lessons/${lessonId}`);
  };

  if (courseLoading || lessonsLoading) {
    return (
      <div className="course-page">
        <div className="course-page__container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-page">
        <div className="course-page__container">
          <p>Course not found</p>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="course-page">
      <div className="course-page__container">
        <div className="course-page__header">
          <Link to="/" className="course-page__back">
            ← Back to Courses
          </Link>
          <h1 className="course-page__title">{course.title}</h1>
        </div>
        {course.image && (
          <img
            src={course.image}
            alt={course.title}
            className="course-page__image"
          />
        )}
        <p className="course-page__description">{course.description}</p>
        <div className="course-page__stats">
          <p>Lessons: {course._count?.lessons || 0}</p>
        </div>
        <div className="course-page__lessons">
          <h2 className="course-page__lessons-title">Lessons</h2>
          {lessons?.data && lessons.data.length > 0 ? (
            <div className="course-page__lessons-list">
              {lessons.data.map((lesson: Lesson) => (
                <div
                  key={lesson.id}
                  className="course-page__lesson-card"
                  onClick={() => handleLessonClick(lesson.id)}
                >
                  <div className="course-page__lesson-header">
                    <span className="course-page__lesson-order">Lesson {lesson.order}</span>
                    {lesson._count && lesson._count.quizzes && lesson._count.quizzes > 0 && (
                      <span className="course-page__lesson-quizzes">
                        {lesson._count.quizzes} Quiz{lesson._count.quizzes !== 1 ? 'zes' : ''}
                      </span>
                    )}
                  </div>
                  <h3 className="course-page__lesson-title">{lesson.title}</h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="course-page__no-lessons">No lessons available</p>
          )}
        </div>
      </div>
    </div>
  );
};

