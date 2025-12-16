import { useQuery } from '@tanstack/react-query';
import { quizAttemptsService } from '../../../services/quiz-attempts.service';

export const QuizAttempts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz-attempts'],
    queryFn: () => quizAttemptsService.findMany(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading quiz attempts</div>;

  return (
    <div>
      <h1>Quiz Attempts</h1>
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
        <div>
          <p>Total: {data.meta.total}</p>
        </div>
      )}
    </div>
  );
};

