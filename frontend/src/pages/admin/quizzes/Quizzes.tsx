import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { quizzesService } from '../../../services/quizzes.service';
import { lessonsService } from '../../../services/lessons.service';
import { coursesService } from '../../../services/courses.service';
import { AdminModal } from '../../../components/AdminModal/AdminModal';
import '../admin-common.scss';

export const Quizzes = () => {
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesService.findMany({ page: 1, limit: 100, order: 'asc', sortBy: 'id' }),
  });

  const { data: lessons } = useQuery({
    queryKey: ['lessons', selectedCourseId],
    queryFn: () => {
      if (!selectedCourseId) return Promise.resolve({ data: [], meta: { total: 0, page: 1, limit: 100, totalPages: 0 } });
      return lessonsService.findManyByCourse(selectedCourseId, { page: 1, limit: 100, order: 'asc', sortBy: 'order' });
    },
    enabled: !!selectedCourseId,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['quizzes', selectedLessonId],
    queryFn: () => {
      if (!selectedLessonId) return Promise.resolve({ data: [], meta: { total: 0 } });
      return quizzesService.findManyByLesson(selectedLessonId);
    },
    enabled: !!selectedLessonId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => quizzesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    questions: [{ question: '', rightAnswer: '', variants: [''] }],
  });
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [editQuiz, setEditQuiz] = useState({
    title: '',
    questions: [{ question: '', rightAnswer: '', variants: [''] }],
  });

  const createMutation = useMutation({
    mutationFn: (quizData: {
      title: string;
      questions: Array<{ question: string; rightAnswer: string; variants: string[] }>;
    }) => {
      if (!selectedLessonId) throw new Error('Please select a lesson');
      return quizzesService.create(selectedLessonId, quizData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      setShowCreateForm(false);
      setNewQuiz({ title: '', questions: [{ question: '', rightAnswer: '', variants: [''] }] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quizData }: { id: number; quizData: Partial<{ title: string; questions: Array<{ question: string; rightAnswer: string; variants: string[] }> }> }) =>
      quizzesService.update(id, quizData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      setEditingQuizId(null);
      setEditQuiz({ title: '', questions: [{ question: '', rightAnswer: '', variants: [''] }] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newQuiz);
  };

  const handleEdit = (quiz: { id: number; title: string }) => {
    setEditingQuizId(quiz.id);
    setEditQuiz({ title: quiz.title, questions: [] });
  };

  const handleUpdate = () => {
    if (editingQuizId) {
      updateMutation.mutate({ id: editingQuizId, quizData: { title: editQuiz.title } });
    }
  };

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { question: '', rightAnswer: '', variants: [''] }],
    });
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const updated = [...newQuiz.questions];
    updated[index] = { ...updated[index], [field]: value };
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const addVariant = (questionIndex: number) => {
    const updated = [...newQuiz.questions];
    updated[questionIndex].variants.push('');
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const updateVariant = (questionIndex: number, variantIndex: number, value: string) => {
    const updated = [...newQuiz.questions];
    updated[questionIndex].variants[variantIndex] = value;
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="admin-page__loading">Loading...</div>;
  if (error) return <div className="admin-page__error">Error loading quizzes</div>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Quiz Management</h1>
      </div>
      <div className="admin-page__form-group">
        <label className="admin-page__form-label">
          Select Course:
          <select
            className="admin-page__form-input"
            value={selectedCourseId || ''}
            onChange={(e) => {
              setSelectedCourseId(e.target.value ? parseInt(e.target.value) : null);
              setSelectedLessonId(null);
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
        {selectedCourseId && (
          <label className="admin-page__form-label">
            Select Lesson:
            <select
              className="admin-page__form-input"
              value={selectedLessonId || ''}
              onChange={(e) => {
                setSelectedLessonId(e.target.value ? parseInt(e.target.value) : null);
              }}
            >
              <option value="">Select a lesson</option>
              {lessons?.data.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {selectedLessonId && (
        <>
          <div className="admin-page__actions">
            <button
              className="admin-page__button admin-page__button--secondary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : 'Create New Quiz'}
            </button>
          </div>
          <AdminModal
            isOpen={showCreateForm}
            onClose={() => {
              setShowCreateForm(false);
              setNewQuiz({ title: '', questions: [{ question: '', rightAnswer: '', variants: [''] }] });
            }}
            title="Create New Quiz"
            size="large"
          >
            <form className="admin-page__form" onSubmit={handleCreate}>
              <div className="admin-page__form-group">
                <label className="admin-page__form-label">
                  Title:
                  <input
                    className="admin-page__form-input"
                    type="text"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    required
                  />
                </label>
              </div>
              {newQuiz.questions.map((q, qIndex) => (
                <div key={qIndex} className="admin-page__form-group" style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h3 style={{ marginBottom: '12px' }}>Question {qIndex + 1}</h3>
                  <div className="admin-page__form-group">
                    <label className="admin-page__form-label">
                      Question:
                      <input
                        className="admin-page__form-input"
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div className="admin-page__form-group">
                    <label className="admin-page__form-label">
                      Right Answer:
                      <input
                        className="admin-page__form-input"
                        type="text"
                        value={q.rightAnswer}
                        onChange={(e) => updateQuestion(qIndex, 'rightAnswer', e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div className="admin-page__form-group">
                    <label className="admin-page__form-label">Variants:</label>
                    {q.variants.map((variant, vIndex) => (
                      <input
                        key={vIndex}
                        className="admin-page__form-input"
                        style={{ marginBottom: '8px' }}
                        type="text"
                        value={variant}
                        onChange={(e) => updateVariant(qIndex, vIndex, e.target.value)}
                        required
                      />
                    ))}
                    <button
                      className="admin-page__button admin-page__button--secondary"
                      type="button"
                      onClick={() => addVariant(qIndex)}
                    >
                      Add Variant
                    </button>
                  </div>
                </div>
              ))}
              <div className="admin-page__form-actions">
                <button
                  className="admin-page__button admin-page__button--secondary"
                  type="button"
                  onClick={addQuestion}
                >
                  Add Question
                </button>
                <button
                  className="admin-page__button admin-page__button--primary"
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </AdminModal>

          <AdminModal
            isOpen={editingQuizId !== null}
            onClose={() => {
              setEditingQuizId(null);
              setEditQuiz({ title: '', questions: [{ question: '', rightAnswer: '', variants: [''] }] });
            }}
            title="Edit Quiz"
          >
            <form className="admin-page__form" onSubmit={handleUpdate}>
              <div className="admin-page__form-group">
                <label className="admin-page__form-label">
                  Title:
                  <input
                    className="admin-page__form-input"
                    type="text"
                    value={editQuiz.title}
                    onChange={(e) => setEditQuiz({ ...editQuiz, title: e.target.value })}
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
                    setEditingQuizId(null);
                    setEditQuiz({ title: '', questions: [{ question: '', rightAnswer: '', variants: [''] }] });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </AdminModal>
          <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Questions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((quiz) => (
              <tr key={quiz.id}>
                <td>{quiz.id}</td>
                <td>{quiz.title}</td>
                <td>{quiz.questions.length}</td>
                <td>
                  <button
                    className="admin-page__button admin-page__button--primary"
                    onClick={() => handleEdit(quiz)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-page__button admin-page__button--danger"
                    onClick={() => handleDelete(quiz.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
    </div>
  );
};

