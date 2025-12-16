import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsService } from '../../../services/enrollments.service';

export const Enrollments = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentsService.findMany(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => enrollmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading enrollments</div>;

  return (
    <div>
      <h1>Enrollment Management</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Course</th>
            <th>Progress</th>
            <th>Completed</th>
            <th>Enrolled At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((enrollment) => (
            <tr key={enrollment.id}>
              <td>{enrollment.id}</td>
              <td>{enrollment.user?.name || 'N/A'}</td>
              <td>{enrollment.course?.title || 'N/A'}</td>
              <td>{enrollment.progress}%</td>
              <td>{enrollment.completed ? 'Yes' : 'No'}</td>
              <td>{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(enrollment.id)}>Delete</button>
              </td>
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

