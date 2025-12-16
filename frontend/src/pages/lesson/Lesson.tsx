import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { lessonsService } from '../../services/lessons.service';
import './Lesson.scss';

export const Lesson = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lessonId = id ? parseInt(id, 10) : null;

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => {
      if (!lessonId) throw new Error('Lesson ID is required');
      return lessonsService.findOne(lessonId);
    },
    enabled: !!lessonId,
  });

  if (isLoading) {
    return (
      <div className="lesson-page">
        <div className="lesson-page__container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="lesson-page">
        <div className="lesson-page__container">
          <p>Lesson not found</p>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
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
        {typeof lesson._count?.quizzes === 'number' && lesson._count.quizzes > 0 && (
          <div className="lesson-page__quizzes">
            <p>This lesson has {lesson._count.quizzes} quiz{lesson._count.quizzes !== 1 ? 'zes' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
};

