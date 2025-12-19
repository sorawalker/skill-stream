import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useDeferredValue, useMemo, useCallback } from 'react';
import { coursesService } from '../../../services/courses.service';
import { AdminModal } from '../../../components/AdminModal/AdminModal';
import '../admin-common.scss';

export const Courses = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', page, limit, deferredSearch],
    queryFn: () =>
      coursesService.findMany({ page, limit, search: deferredSearch, order: 'asc', sortBy: 'id' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => coursesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', image: '' });
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editCourse, setEditCourse] = useState({ title: '', description: '', image: '' });

  const createMutation = useMutation({
    mutationFn: (courseData: { title: string; description: string; image: string }) =>
      coursesService.create(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setShowCreateForm(false);
      setNewCourse({ title: '', description: '', image: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      courseData,
    }: {
      id: number;
      courseData: Partial<{ title: string; description: string; image: string }>;
    }) => coursesService.update(id, courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setEditingCourseId(null);
      setEditCourse({ title: '', description: '', image: '' });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newCourse);
  };

  const handleEdit = (course: {
    id: number;
    title: string;
    description: string;
    image: string;
  }) => {
    setEditingCourseId(course.id);
    setEditCourse({ title: course.title, description: course.description, image: course.image });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourseId) {
      updateMutation.mutate({ id: editingCourseId, courseData: editCourse });
    }
  };

  const handleDelete = useCallback(
    (id: number) => {
      if (confirm('Are you sure you want to delete this course?')) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation],
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const tableContent = useMemo(() => {
    if (isLoading) return <div className="admin-page__loading">Loading...</div>;
    if (error) return <div className="admin-page__error">Error loading courses</div>;

    return (
      <>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Lessons</th>
              <th>Enrollments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course._count?.lessons || 0}</td>
                <td>{course._count?.enrollments || 0}</td>
                <td>
                  <button
                    className="admin-page__button admin-page__button--primary"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-page__button admin-page__button--danger"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.meta && (
          <div className="admin-page__pagination">
            <button
              className="admin-page__pagination-button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="admin-page__pagination-info">
              Page {data.meta.page} of {data.meta.totalPages}
            </span>
            <button
              className="admin-page__pagination-button"
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  }, [isLoading, error, data, page, handleDelete]);

  if (isLoading && !data) return <div className="admin-page__loading">Loading...</div>;
  if (error && !data) return <div className="admin-page__error">Error loading courses</div>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Course Management</h1>
        <div className="admin-page__actions">
          <button
            className="admin-page__button admin-page__button--secondary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create New Course'}
          </button>
        </div>
      </div>
      <AdminModal
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setNewCourse({ title: '', description: '', image: '' });
        }}
        title="Create New Course"
      >
        <form className="admin-page__form" onSubmit={handleCreate}>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Title:
              <input
                className="admin-page__form-input"
                type="text"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Description:
              <textarea
                className="admin-page__form-textarea"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Image URL:
              <input
                className="admin-page__form-input"
                type="text"
                value={newCourse.image}
                onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="admin-page__form-actions">
            <button
              className="admin-page__button admin-page__button--primary"
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        isOpen={editingCourseId !== null}
        onClose={() => {
          setEditingCourseId(null);
          setEditCourse({ title: '', description: '', image: '' });
        }}
        title="Edit Course"
      >
        <form className="admin-page__form" onSubmit={handleUpdate}>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Title:
              <input
                className="admin-page__form-input"
                type="text"
                value={editCourse.title}
                onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Description:
              <textarea
                className="admin-page__form-textarea"
                value={editCourse.description}
                onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Image URL:
              <input
                className="admin-page__form-input"
                type="text"
                value={editCourse.image}
                onChange={(e) => setEditCourse({ ...editCourse, image: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="admin-page__form-actions">
            <button
              className="admin-page__button admin-page__button--success"
              type="submit"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              className="admin-page__button admin-page__button--secondary"
              type="button"
              onClick={() => {
                setEditingCourseId(null);
                setEditCourse({ title: '', description: '', image: '' });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
      <div className="admin-page__search">
        <input
          className="admin-page__search-input"
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      {tableContent}
    </div>
  );
};
