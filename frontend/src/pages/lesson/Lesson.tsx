import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonsService } from '../../services/lessons.service';
import { quizzesService } from '../../services/quizzes.service';
import { ApiErrorHandler } from '../../components/errors';
import { Quiz } from '../../components/Quiz/Quiz';
import type { ApiError } from '../../utils/api';
import './Lesson.scss';

export const Lesson = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lessonId = id ? parseInt(id, 10) : null;

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => {
      if (!lessonId) throw new Error('Lesson ID is required');
      return lessonsService.findOne(lessonId);
    },
    enabled: !!lessonId,
  });

  const { data: quizzes } = useQuery({
    queryKey: ['quizzes', lessonId],
    queryFn: () => {
      if (!lessonId) throw new Error('Lesson ID is required');
      return quizzesService.findManyByLesson(lessonId);
    },
    enabled: !!lessonId,
  });

  const { data: courseLessons } = useQuery({
    queryKey: ['lessons', lesson?.courseId],
    queryFn: () => {
      if (!lesson?.courseId) throw new Error('Course ID is required');
      return lessonsService.findManyByCourse(lesson.courseId, {
        page: 1,
        limit: 100,
        order: 'asc',
        sortBy: 'order',
      });
    },
    enabled: !!lesson?.courseId,
  });

  const currentLessonIndex = courseLessons?.data.findIndex((l) => l.id === lessonId) ?? -1;
  const previousLesson = currentLessonIndex > 0 ? courseLessons?.data[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < (courseLessons?.data.length ?? 0) - 1
      ? courseLessons?.data[currentLessonIndex + 1]
      : null;
  const isLastLesson = currentLessonIndex >= 0 && currentLessonIndex === (courseLessons?.data.length ?? 0) - 1;

  const handleFinishCourse = () => {
    if (lesson?.courseId) {
      navigate(`/courses/${lesson.courseId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="lesson-page">
        <div className="lesson-page__container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ApiErrorHandler
        error={error}
        customMessages={{
          403: 'You must be enrolled in this course to access lessons',
          404: 'Lesson not found',
        }}
      />
    );
  }

  if (!lesson) {
    return (
      <ApiErrorHandler
        error={{ status: 404, message: 'Lesson not found' } as ApiError}
        customMessages={{
          404: 'Lesson not found',
        }}
      />
    );
  }

  return (
    <div className="lesson-page">
      <div className="lesson-page__container">
        <div className="lesson-page__header">
          <button
            onClick={() => navigate(-1)}
            className="lesson-page__back"
          >
            ← Back
          </button>
          <h1 className="lesson-page__title">{lesson.title}</h1>
        </div>
        <div className="lesson-page__content">
          <div
            className="lesson-page__text"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>

        {quizzes && quizzes.data.length > 0 && (
          <div className="lesson-page__quizzes-section">
            <h2 className="lesson-page__quizzes-title">Quizzes</h2>
            {quizzes.data.map((quiz) => (
              <Quiz key={quiz.id} quizId={quiz.id} />
            ))}
          </div>
        )}

        <div className="lesson-page__navigation">
          <button
            className="lesson-page__nav-button lesson-page__nav-button--previous"
            onClick={() => previousLesson && navigate(`/lessons/${previousLesson.id}`)}
            disabled={!previousLesson}
          >
            ← Previous Lesson
          </button>
          {isLastLesson ? (
            <button
              className="lesson-page__nav-button lesson-page__nav-button--finish"
              onClick={handleFinishCourse}
            >
              Finish Course
            </button>
          ) : (
            <button
              className="lesson-page__nav-button lesson-page__nav-button--next"
              onClick={() => nextLesson && navigate(`/lessons/${nextLesson.id}`)}
              disabled={!nextLesson}
            >
              Next Lesson →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

