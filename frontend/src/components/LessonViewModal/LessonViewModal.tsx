import { useQuery } from '@tanstack/react-query';
import { lessonsService } from '../../services/lessons.service';
import { quizzesService } from '../../services/quizzes.service';
import { AdminModal } from '../AdminModal/AdminModal';
import { Quiz } from '../Quiz/Quiz';
import './LessonViewModal.scss';

interface LessonViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number | null;
}

export const LessonViewModal = ({
  isOpen,
  onClose,
  lessonId,
}: LessonViewModalProps) => {
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId, 'view'],
    queryFn: () => {
      if (!lessonId)
        throw new Error('Lesson ID is required');
      return lessonsService.findOne(lessonId);
    },
    enabled: isOpen && !!lessonId,
  });

  const { data: quizzes } = useQuery({
    queryKey: ['quizzes', lessonId, 'view'],
    queryFn: () => {
      if (!lessonId)
        throw new Error('Lesson ID is required');
      return quizzesService.findManyByLesson(lessonId);
    },
    enabled: isOpen && !!lessonId,
  });

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={lesson?.title || 'Lesson Content'}
      size="large"
    >
      {isLoading ? (
        <div className="lesson-view-modal__loading">
          Loading lesson...
        </div>
      ) : lesson ? (
        <div className="lesson-view-modal">
          <div className="lesson-view-modal__content">
            <div
              className="lesson-view-modal__text"
              dangerouslySetInnerHTML={{
                __html: lesson.content,
              }}
            />
          </div>

          {quizzes && quizzes.data.length > 0 && (
            <div className="lesson-view-modal__quizzes">
              <h3 className="lesson-view-modal__quizzes-title">
                Quizzes
              </h3>
              {quizzes.data.map((quiz) => (
                <Quiz key={quiz.id} quizId={quiz.id} />
              ))}
            </div>
          )}

          {(!quizzes || quizzes.data.length === 0) && (
            <div className="lesson-view-modal__no-quizzes">
              No quizzes available for this lesson
            </div>
          )}
        </div>
      ) : (
        <div className="lesson-view-modal__error">
          Lesson not found
        </div>
      )}
    </AdminModal>
  );
};
