import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { lessonsService } from '../../services/lessons.service';
import { quizzesService } from '../../services/quizzes.service';
import { progressService } from '../../services/progress.service';
import { quizAttemptsService } from '../../services/quiz-attempts.service';
import { ApiErrorHandler } from '../../components/errors';
import { Quiz } from '../../components/Quiz/Quiz';
import { Header } from '../../components/Header/Header';
import type { ApiError } from '../../utils/api';
import './Lesson.scss';

export const Lesson = () => {
  const queryClient = useQueryClient();
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

  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
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

  const { data: lessonProgress } = useQuery({
    queryKey: ['progress', 'lesson', lessonId],
    queryFn: () => {
      if (!lessonId) throw new Error('Lesson ID is required');
      return progressService.findByLesson(lessonId);
    },
    enabled: !!lessonId,
  });

  const hasQuizzes = (quizzes?.data.length ?? 0) > 0;
  
  const quizAttemptsQueries = useQueries({
    queries: hasQuizzes
      ? (quizzes?.data || []).map((quiz) => ({
          queryKey: ['quiz-user-attempt', quiz.id],
          queryFn: () => quizAttemptsService.findUserAttempt(quiz.id),
          enabled: true,
          retry: false,
        }))
      : [],
  });

  const allQuizzesAnswered = hasQuizzes
    ? quizAttemptsQueries.every(
        (query) => query.isSuccess && (query.data !== null && query.data !== undefined),
      )
    : true;

  const canFinishLesson = !hasQuizzes || allQuizzesAnswered;

  const finishLessonMutation = useMutation({
    mutationFn: async () => {
      if (!lessonId || !lesson?.courseId) {
        throw new Error('Lesson ID and Course ID are required');
      }

      if (lessonProgress) {
        await progressService.update(lessonProgress.id, {
          completed: true,
          progress: 100,
        });
      } else {
        await progressService.create(lessonId, {
          completed: true,
          progress: 100,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onSuccess: () => {
      if (isLastLesson && lesson?.courseId) {
        navigate(`/courses/${lesson.courseId}`);
      } else if (nextLesson) {
        navigate(`/lessons/${nextLesson.id}`);
      }
    },
  });

  const handleFinishLesson = () => {
    finishLessonMutation.mutate();
  };

  useEffect(() => {
    if (
      !hasQuizzes &&
      !lessonProgress?.completed &&
      !finishLessonMutation.isPending &&
      !finishLessonMutation.isSuccess &&
      lessonId &&
      quizzes !== undefined &&
      !isLoadingQuizzes
    ) {
      finishLessonMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasQuizzes, lessonProgress?.completed, isLoadingQuizzes, quizzes?.data]);

  if (isLoading) {
    return (
      <div className="lesson-page">
        <Header />
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
      <Header />
      <div className="lesson-page__container">
        <div className="lesson-page__header">
          <button
            onClick={() => navigate(-1)}
            className="lesson-page__back"
          >
            Back
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
          <div className="lesson-page__nav-actions">
            {isLastLesson ? (
              <button
                className="lesson-page__nav-button lesson-page__nav-button--finish"
                onClick={handleFinishLesson}
                disabled={finishLessonMutation.isPending}
              >
                {finishLessonMutation.isPending ? 'Finishing...' : 'Finish Course'}
              </button>
            ) : canFinishLesson ? (
              <button
                className="lesson-page__nav-button lesson-page__nav-button--finish"
                onClick={handleFinishLesson}
                disabled={finishLessonMutation.isPending}
              >
                {finishLessonMutation.isPending ? 'Finishing...' : 'Finish Lesson'}
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
    </div>
  );
};

