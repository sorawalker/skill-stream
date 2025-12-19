import { useState, useMemo } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { quizzesService } from '../../services/quizzes.service';
import { quizAttemptsService } from '../../services/quiz-attempts.service';
import { progressService } from '../../services/progress.service';
import type { QuizAttemptResult } from 'skill-stream-backend/shared/types';
import './Quiz.scss';

interface QuizProps {
  quizId: number;
  quizTitle?: string;
  onCompleted?: () => void;
}

export const Quiz = ({
  quizId,
  quizTitle,
  onCompleted,
}: QuizProps) => {
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSelectedAnswers, setNewSelectedAnswers] =
    useState<Record<string, string>>({});
  const [mutationResult, setMutationResult] =
    useState<QuizAttemptResult | null>(null);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => quizzesService.findOne(quizId, false),
    enabled: isExpanded,
  });

  const {
    data: previousAttempt,
    isLoading: isLoadingAttempt,
  } = useQuery({
    queryKey: ['quiz-user-attempt', quizId],
    queryFn: () =>
      quizAttemptsService.findUserAttempt(quizId),
    retry: false,
    throwOnError: false,
  });

  const attemptResult = useMemo(() => {
    return mutationResult || previousAttempt || null;
  }, [mutationResult, previousAttempt]);

  const selectedAnswers = useMemo(() => {
    if (previousAttempt) {
      const answers: Record<string, string> = {};
      previousAttempt.correctAnswersList.forEach((item) => {
        answers[item.question] = item.userAnswer;
      });
      return answers;
    }
    return newSelectedAnswers;
  }, [previousAttempt, newSelectedAnswers]);

  const attemptMutation = useMutation({
    mutationFn: (
      answers: Array<{ question: string; answer: string }>,
    ) => quizAttemptsService.create(quizId, { answers }),
    onSuccess: async (result) => {
      setMutationResult(result);

      onCompleted?.();

      if (quiz?.lessonId) {
        try {
          const existingProgress =
            await progressService.findByLesson(
              quiz.lessonId,
            );

          if (existingProgress) {
            await progressService.update(
              existingProgress.id,
              {
                completed: result.attempt.score === 100,
                progress: Math.max(
                  existingProgress.progress,
                  result.attempt.score,
                ),
              },
            );
          } else {
            await progressService.create(quiz.lessonId, {
              completed: result.attempt.score === 100,
              progress: result.attempt.score,
            });
          }

          queryClient.setQueryData(
            ['quiz-user-attempt', quizId],
            result,
          );

          queryClient.invalidateQueries({
            queryKey: ['progress'],
          });
          queryClient.invalidateQueries({
            queryKey: ['enrollments'],
          });
          queryClient.invalidateQueries({
            queryKey: ['quiz-user-attempt', quizId],
          });
          queryClient.invalidateQueries({
            queryKey: ['progress', 'lesson'],
          });
        } catch (error) {
          console.error(
            'Failed to update progress:',
            error,
          );
        }
      }
    },
  });

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAnswerChange = (
    question: string,
    answer: string,
  ) => {
    if (!previousAttempt && !mutationResult) {
      setNewSelectedAnswers((prev) => ({
        ...prev,
        [question]: answer,
      }));
    }
  };

  const handleSubmit = () => {
    if (!quiz || attemptResult) return;

    const answers = quiz.questions.map((q) => ({
      question: q.question,
      answer: newSelectedAnswers[q.question] || '',
    }));

    attemptMutation.mutate(answers);
  };

  if ((isLoading || isLoadingAttempt) && isExpanded) {
    return (
      <div className="quiz">
        <div
          className="quiz__header"
          onClick={handleToggle}
        >
          <h3 className="quiz__title">Loading quiz...</h3>
          <span className="quiz__toggle">
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </div>
    );
  }

  if (!quiz && isExpanded) {
    return (
      <div className="quiz">
        <div
          className="quiz__header"
          onClick={handleToggle}
        >
          <h3 className="quiz__title">Quiz not found</h3>
          <span className="quiz__toggle">
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </div>
    );
  }

  const hasPreviousAttempt = !!previousAttempt;
  const hasAnswered = attemptResult !== null;

  return (
    <div className="quiz">
      <div className="quiz__header" onClick={handleToggle}>
        <h3 className="quiz__title">
          {quiz?.title || quizTitle || 'Quiz'}
        </h3>
        <span className="quiz__toggle">
          {isExpanded ? '−' : '+'}
        </span>
      </div>

      {isExpanded && quiz && (
        <div className="quiz__content">
          {quiz.questions.map((question, index) => {
            const userAnswer =
              selectedAnswers[question.question];
            const result =
              attemptResult?.correctAnswersList.find(
                (r) => r.question === question.question,
              );
            const isCorrect = result?.isCorrect ?? false;
            const correctAnswer = result?.correctAnswer;

            return (
              <div key={index} className="quiz__question">
                <h4 className="quiz__question-title">
                  {index + 1}. {question.question}
                </h4>

                <div className="quiz__options">
                  {question.variants.map(
                    (variant, variantIndex) => {
                      const isUserAnswer =
                        variant === userAnswer;
                      const isCorrectAnswer =
                        variant === correctAnswer;
                      const isIncorrect =
                        hasAnswered &&
                        isUserAnswer &&
                        !isCorrect;

                      return (
                        <label
                          key={variantIndex}
                          className={`quiz__option ${
                            hasAnswered ||
                            hasPreviousAttempt
                              ? isCorrectAnswer
                                ? 'quiz__option--correct'
                                : isIncorrect
                                  ? 'quiz__option--incorrect'
                                  : ''
                              : isUserAnswer
                                ? 'quiz__option--selected'
                                : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={variant}
                            checked={isUserAnswer}
                            onChange={() =>
                              handleAnswerChange(
                                question.question,
                                variant,
                              )
                            }
                            disabled={
                              hasAnswered ||
                              hasPreviousAttempt
                            }
                          />
                          <span>{variant}</span>
                        </label>
                      );
                    },
                  )}
                </div>
              </div>
            );
          })}

          {!hasAnswered && !hasPreviousAttempt && (
            <div className="quiz__submit">
              <button
                className="quiz__button quiz__button--submit"
                onClick={handleSubmit}
                disabled={
                  attemptMutation.isPending ||
                  quiz.questions.some(
                    (q) => !selectedAnswers[q.question],
                  )
                }
              >
                {attemptMutation.isPending
                  ? 'Submitting...'
                  : 'Submit Answers'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
