import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { quizzesService } from '../../services/quizzes.service';
import { quizAttemptsService } from '../../services/quiz-attempts.service';
import type { QuizAttemptResult } from 'skill-stream-backend/shared/types';
import './Quiz.scss';

interface QuizProps {
  quizId: number;
}

export const Quiz = ({ quizId }: QuizProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [attemptResult, setAttemptResult] = useState<QuizAttemptResult | null>(null);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => quizzesService.findOne(quizId, false),
    enabled: isExpanded,
  });

  const { data: previousAttempt, isLoading: isLoadingAttempt } = useQuery({
    queryKey: ['quiz-user-attempt', quizId],
    queryFn: () => quizAttemptsService.findUserAttempt(quizId),
    enabled: isExpanded,
    retry: false,
  });

  useEffect(() => {
    if (previousAttempt) {
      setAttemptResult(previousAttempt);
      // Pre-fill selected answers from previous attempt
      const answers: Record<string, string> = {};
      previousAttempt.correctAnswersList.forEach((item) => {
        answers[item.question] = item.userAnswer;
      });
      setSelectedAnswers(answers);
    }
  }, [previousAttempt]);

  const attemptMutation = useMutation({
    mutationFn: (answers: Array<{ question: string; answer: string }>) =>
      quizAttemptsService.create(quizId, { answers }),
    onSuccess: (result) => {
      setAttemptResult(result);
    },
  });

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAnswerChange = (question: string, answer: string) => {
    // Only allow changes if there's no previous attempt
    if (!previousAttempt) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [question]: answer,
      }));
    }
  };

  const handleSubmit = () => {
    if (!quiz || previousAttempt) return;

    const answers = quiz.questions.map((q) => ({
      question: q.question,
      answer: selectedAnswers[q.question] || '',
    }));

    attemptMutation.mutate(answers);
  };

  if ((isLoading || isLoadingAttempt) && isExpanded) {
    return (
      <div className="quiz">
        <div className="quiz__header" onClick={handleToggle}>
          <h3 className="quiz__title">Loading quiz...</h3>
          <span className="quiz__toggle">{isExpanded ? '−' : '+'}</span>
        </div>
      </div>
    );
  }

  if (!quiz && isExpanded) {
    return (
      <div className="quiz">
        <div className="quiz__header" onClick={handleToggle}>
          <h3 className="quiz__title">Quiz not found</h3>
          <span className="quiz__toggle">{isExpanded ? '−' : '+'}</span>
        </div>
      </div>
    );
  }

  const hasPreviousAttempt = !!previousAttempt;
  const hasAnswered = attemptResult !== null;

  return (
    <div className="quiz">
      <div className="quiz__header" onClick={handleToggle}>
        <h3 className="quiz__title">{quiz?.title || 'Quiz'}</h3>
        <span className="quiz__toggle">{isExpanded ? '−' : '+'}</span>
      </div>

      {isExpanded && quiz && (
        <div className="quiz__content">
          {hasPreviousAttempt && (
            <div className="quiz__previous-attempt-notice">
              You have already completed this quiz. Your previous answers are shown below.
            </div>
          )}
          {quiz.questions.map((question, index) => {
            const userAnswer = selectedAnswers[question.question];
            const result = attemptResult?.correctAnswersList.find(
              (r) => r.question === question.question,
            );
            const isCorrect = result?.isCorrect ?? false;

            return (
              <div key={index} className="quiz__question">
                <h4 className="quiz__question-title">
                  {index + 1}. {question.question}
                </h4>

                <div className="quiz__options">
                  {question.variants.map((variant, variantIndex) => (
                    <label
                      key={variantIndex}
                      className={`quiz__option ${
                        hasAnswered && variant === userAnswer
                          ? isCorrect
                            ? 'quiz__option--correct'
                            : 'quiz__option--incorrect'
                          : ''
                      } ${!hasAnswered && variant === userAnswer ? 'quiz__option--selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={variant}
                        checked={userAnswer === variant}
                        onChange={() => handleAnswerChange(question.question, variant)}
                        disabled={hasAnswered || hasPreviousAttempt}
                      />
                      <span>{variant}</span>
                    </label>
                  ))}
                </div>

                {hasAnswered && (
                  <div className="quiz__result">
                    {isCorrect ? (
                      <div className="quiz__result-message quiz__result-message--correct">
                        ✓ Well done, the answer is correct!
                      </div>
                    ) : (
                      <div className="quiz__result-message quiz__result-message--incorrect">
                        ✗ Incorrect answer
                        {result && (
                          <div className="quiz__correct-answer">
                            Correct answer: <strong>{result.correctAnswer}</strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
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
                  quiz.questions.some((q) => !selectedAnswers[q.question])
                }
              >
                {attemptMutation.isPending ? 'Submitting...' : 'Submit Answers'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

