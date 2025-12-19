import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { lessonsService } from '../../../services/lessons.service';
import { coursesService } from '../../../services/courses.service';
import { AdminModal } from '../../../components/AdminModal/AdminModal';
import { LessonViewModal } from '../../../components/LessonViewModal/LessonViewModal';
import '../admin-common.scss';

export const Lessons = () => {
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesService.findMany({ page: 1, limit: 100, order: 'asc', sortBy: 'id' }),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['lessons', selectedCourseId, page, limit],
    queryFn: () => {
      if (!selectedCourseId)
        return Promise.resolve({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
      return lessonsService.findManyByCourse(selectedCourseId, {
        page,
        limit,
        order: 'asc',
        sortBy: 'order',
      });
    },
    enabled: !!selectedCourseId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => lessonsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', content: '', order: 1 });
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [editLesson, setEditLesson] = useState({ title: '', content: '', order: 1 });
  const [viewingLessonId, setViewingLessonId] = useState<number | null>(null);

  const createMutation = useMutation({
    mutationFn: (lessonData: { title: string; content: string; order: number }) => {
      if (!selectedCourseId) throw new Error('Please select a course');
      return lessonsService.create(selectedCourseId, lessonData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      setShowCreateForm(false);
      setNewLesson({ title: '', content: '', order: 1 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      lessonData,
    }: {
      id: number;
      lessonData: Partial<{ title: string; content: string; order: number }>;
    }) => lessonsService.update(id, lessonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      setEditingLessonId(null);
      setEditLesson({ title: '', content: '', order: 1 });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newLesson);
  };

  const handleEdit = (lesson: { id: number; title: string; content: string; order: number }) => {
    setEditingLessonId(lesson.id);
    setEditLesson({ title: lesson.title, content: lesson.content, order: lesson.order });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLessonId) {
      updateMutation.mutate({ id: editingLessonId, lessonData: editLesson });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="admin-page__loading">Loading...</div>;
  if (error) return <div className="admin-page__error">Error loading lessons</div>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Lesson Management</h1>
      </div>
      <div className="admin-page__form-group">
        <label className="admin-page__form-label">
          Select Course:
          <select
            className="admin-page__form-input"
            value={selectedCourseId || ''}
            onChange={(e) => {
              setSelectedCourseId(e.target.value ? parseInt(e.target.value) : null);
              setPage(1);
            }}
          >
            <option value="">Select a course</option>
            {courses?.data.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      {selectedCourseId && (
        <>
          <div className="admin-page__actions">
            <button
              className="admin-page__button admin-page__button--secondary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : 'Create New Lesson'}
            </button>
          </div>
          <AdminModal
            isOpen={showCreateForm}
            onClose={() => {
              setShowCreateForm(false);
              setNewLesson({ title: '', content: '', order: 1 });
            }}
            title="Create New Lesson"
            size="large"
          >
            <form className="admin-page__form" onSubmit={handleCreate}>
              <div className="admin-page__form-group">
                <label className="admin-page__form-label">
                  Title:
                  <input
                    className="admin-page__form-input"
                    type="text"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    required
                  />
                </label>
              </div>
              <div className="admin-page__form-group">
                <label className="admin-page__form-label">
                  Content:
                  <textarea
                    className="admin-page__form-textarea"
                    value={newLesson.content}
                    onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                    required
                    rows={10}
                  />
                </label>
              </div>
              <div className="admin-page__form-group">
                <label className="admin-page__form-label">
                  Order:
                  <input
                    className="admin-page__form-input"
                    type="number"
                    value={newLesson.order}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, order: parseInt(e.target.value) || 1 })
                    }
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
                  {createMutation.isPending ? 'Creating...' : 'Create Lesson'}
                </button>
              </div>
            </form>
          </AdminModal>

          <AdminModal
            isOpen={editingLessonId !== null}
            onClose={() => {
              setEditingLessonId(null);
              setEditLesson({ title: '', content: '', order: 1 });
            }}
            title="Edit Lesson"
            size="large"
          >
            <form className="admin-page__form" onSubmit={handleUpdate}>
              <div className="admin-page__form-group">
                <label className="admin-page__form-label">
                  Title:
                  <input
                    className="admin-page__form-input"
                    type="text"
                    value={editLesson.title}
                    onChange={(e) => setEditLesson({ ...editLesson, title: e.target.value })}
                    required
                  />
                </label>
              </div>
              <div className="admin-page__form-group">
                <label className="admin-page__form-label">
                  Content:
                  <textarea
                    className="admin-page__form-textarea"
                    value={editLesson.content}
                    onChange={(e) => setEditLesson({ ...editLesson, content: e.target.value })}
                    required
                    rows={10}
                  />
                </label>
              </div>
              <div className="admin-page__form-group">
                <label className="admin-page__form-label">
                  Order:
                  <input
                    className="admin-page__form-input"
                    type="number"
                    value={editLesson.order}
                    onChange={(e) =>
                      setEditLesson({ ...editLesson, order: parseInt(e.target.value) || 1 })
                    }
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
                    setEditingLessonId(null);
                    setEditLesson({ title: '', content: '', order: 1 });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </AdminModal>

          <LessonViewModal
            isOpen={viewingLessonId !== null}
            onClose={() => setViewingLessonId(null)}
            lessonId={viewingLessonId}
          />
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Order</th>
                <th>Quizzes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((lesson) => (
                <tr key={lesson.id}>
                  <td>{lesson.id}</td>
                  <td>{lesson.title}</td>
                  <td>{lesson.order}</td>
                  <td>{lesson._count?.quizzes || 0}</td>
                  <td>
                    <button
                      className="admin-page__button admin-page__button--primary"
                      onClick={() => setViewingLessonId(lesson.id)}
                    >
                      View
                    </button>
                    <button
                      className="admin-page__button admin-page__button--primary"
                      onClick={() => handleEdit(lesson)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-page__button admin-page__button--danger"
                      onClick={() => handleDelete(lesson.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.meta && data.meta.totalPages > 0 && (
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
      )}
    </div>
  );
};
