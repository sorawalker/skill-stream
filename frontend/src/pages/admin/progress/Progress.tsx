import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { progressService } from '../../../services/progress.service';
import '../admin-common.scss';

export const Progress = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['progress', page, limit],
    queryFn: () => progressService.findMany({ page, limit, order: 'desc', sortBy: 'updatedAt' }),
  });

  if (isLoading) return <div className="admin-page__loading">Loading...</div>;
  if (error) return <div className="admin-page__error">Error loading progress</div>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Progress Tracking</h1>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Lesson</th>
            <th>Progress</th>
            <th>Completed</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((progress) => (
            <tr key={progress.id}>
              <td>{progress.id}</td>
              <td>{progress.user?.name || 'N/A'}</td>
              <td>{progress.lesson?.title || 'N/A'}</td>
              <td>{progress.progress}%</td>
              <td>{progress.completed ? 'Yes' : 'No'}</td>
              <td>{new Date(progress.updatedAt).toLocaleDateString()}</td>
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
