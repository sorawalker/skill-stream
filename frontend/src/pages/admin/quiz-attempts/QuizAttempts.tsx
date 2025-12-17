import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { quizAttemptsService } from '../../../services/quiz-attempts.service';
import '../admin-common.scss';

export const QuizAttempts = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz-attempts', page, limit],
    queryFn: () => quizAttemptsService.findMany({ page, limit, order: 'desc', sortBy: 'attemptedAt' }),
  });

  if (isLoading) return <div className="admin-page__loading">Loading...</div>;
  if (error) return <div className="admin-page__error">Error loading quiz attempts</div>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Quiz Attempts</h1>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Quiz</th>
            <th>Score</th>
            <th>Attempted At</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((attempt) => (
            <tr key={attempt.id}>
              <td>{attempt.id}</td>
              <td>{attempt.user?.name || 'N/A'}</td>
              <td>{attempt.quiz?.title || 'N/A'}</td>
              <td>{attempt.score.toFixed(2)}%</td>
              <td>{new Date(attempt.attemptedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data?.meta && (
        <div className="admin-page__pagination">
          <button
            className="admin-page__pagination-button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="admin-page__pagination-info">
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <button
            className="admin-page__pagination-button"
            onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
            disabled={page >= data.meta.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

