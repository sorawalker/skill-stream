import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { quizzesService } from '../../../services/quizzes.service';
import { lessonsService } from '../../../services/lessons.service';
import { coursesService } from '../../../services/courses.service';

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading quizzes</div>;

  return (
    <div>
      <h1>Quiz Management</h1>
      <div>
        <label>
          Select Course:
          <select
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
          <label>
            Select Lesson:
            <select
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
          <button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Create New Quiz'}
          </button>
          {showCreateForm && (
            <form onSubmit={handleCreate}>
              <div>
                <label>
                  Title:
                  <input
                    type="text"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    required
                  />
                </label>
              </div>
              {newQuiz.questions.map((q, qIndex) => (
                <div key={qIndex}>
                  <h3>Question {qIndex + 1}</h3>
                  <div>
                    <label>
                      Question:
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Right Answer:
                      <input
                        type="text"
                        value={q.rightAnswer}
                        onChange={(e) => updateQuestion(qIndex, 'rightAnswer', e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label>Variants:</label>
                    {q.variants.map((variant, vIndex) => (
                      <input
                        key={vIndex}
                        type="text"
                        value={variant}
                        onChange={(e) => updateVariant(qIndex, vIndex, e.target.value)}
                        required
                      />
                    ))}
                    <button type="button" onClick={() => addVariant(qIndex)}>
                      Add Variant
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addQuestion}>
                Add Question
              </button>
              <button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Quiz'}
              </button>
            </form>
          )}
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
                {editingQuizId === quiz.id ? (
                  <>
                    <td>{quiz.id}</td>
                    <td>
                      <input
                        type="text"
                        value={editQuiz.title}
                        onChange={(e) => setEditQuiz({ ...editQuiz, title: e.target.value })}
                        required
                      />
                    </td>
                    <td>{quiz.questions.length}</td>
                    <td>
                      <button onClick={handleUpdate} disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => {
                        setEditingQuizId(null);
                        setEditQuiz({ title: '', questions: [{ question: '', rightAnswer: '', variants: [''] }] });
                      }}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{quiz.id}</td>
                    <td>{quiz.title}</td>
                    <td>{quiz.questions.length}</td>
                    <td>
                      <button onClick={() => handleEdit(quiz)}>Edit</button>
                      <button onClick={() => handleDelete(quiz.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
    </div>
  );
};

