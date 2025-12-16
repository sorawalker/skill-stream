import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { coursesService } from '../../../services/courses.service';

export const Courses = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', page, limit, search],
    queryFn: () => coursesService.findMany({ page, limit, search, order: 'asc', sortBy: 'id' }),
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
    mutationFn: ({ id, courseData }: { id: number; courseData: Partial<{ title: string; description: string; image: string }> }) =>
      coursesService.update(id, courseData),
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

  const handleEdit = (course: { id: number; title: string; description: string; image: string }) => {
    setEditingCourseId(course.id);
    setEditCourse({ title: course.title, description: course.description, image: course.image });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourseId) {
      updateMutation.mutate({ id: editingCourseId, courseData: editCourse });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;

  return (
    <div>
      <h1>Course Management</h1>
      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Cancel' : 'Create New Course'}
      </button>
      {showCreateForm && (
        <form onSubmit={handleCreate}>
          <div>
            <label>
              Title:
              <input
                type="text"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <textarea
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Image URL:
              <input
                type="text"
                value={newCourse.image}
                onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                required
              />
            </label>
          </div>
          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      )}
      <div>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button onClick={() => setPage(1)}>Search</button>
      </div>
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
              {editingCourseId === course.id ? (
                <>
                  <td>{course.id}</td>
                  <td>
                    <input
                      type="text"
                      value={editCourse.title}
                      onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                      required
                    />
                  </td>
                  <td>
                    <textarea
                      value={editCourse.description}
                      onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                      required
                    />
                  </td>
                  <td>{course._count?.lessons || 0}</td>
                  <td>{course._count?.enrollments || 0}</td>
                  <td>
                    <button onClick={handleUpdate} disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => {
                      setEditingCourseId(null);
                      setEditCourse({ title: '', description: '', image: '' });
                    }}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{course.id}</td>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>{course._count?.lessons || 0}</td>
                  <td>{course._count?.enrollments || 0}</td>
                  <td>
                    <button onClick={() => handleEdit(course)}>Edit</button>
                    <button onClick={() => handleDelete(course.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {data?.meta && (
        <div>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <button
            disabled={page >= data.meta.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

