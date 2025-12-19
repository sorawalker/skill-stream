import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enrollmentsService } from '../../services/enrollments.service';
import { coursesService } from '../../services/courses.service';
import type { Course, Enrollment } from 'skill-stream-backend/shared/types';
import './CourseModal.scss';

interface CourseModalProps {
  course: Course | null;
  enrollment: Enrollment | null;
  onClose: () => void;
  onGoToCourse: () => void;
}

export const CourseModal = ({ course, onClose, onGoToCourse }: CourseModalProps) => {
  const queryClient = useQueryClient();

  const { data: courseData, refetch: refetchCourse } = useQuery({
    queryKey: ['course', course?.id, 'modal'],
    queryFn: () => {
      if (!course) throw new Error('Course is required');
      return coursesService.findOne(course.id);
    },
    enabled: !!course,
  });

  const { data: enrollmentsData, refetch: refetchEnrollments } = useQuery({
    queryKey: ['enrollments', 'modal'],
    queryFn: () => enrollmentsService.findMany(),
    enabled: !!course,
  });

  useEffect(() => {
    if (course) {
      refetchEnrollments();
      refetchCourse();
    }
  }, [course, refetchEnrollments, refetchCourse]);

  const currentEnrollment: Enrollment | null =
    enrollmentsData?.data.find((e) => e.courseId === course?.id) || null;

  const displayCourse = courseData || course;

  const enrollMutation = useMutation({
    mutationFn: (courseId: number) => enrollmentsService.create(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      refetchEnrollments();
      refetchCourse();
    },
  });

  const unenrollMutation = useMutation({
    mutationFn: (enrollmentId: number) => enrollmentsService.delete(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      refetchEnrollments();
      refetchCourse();
    },
  });

  if (!course || !displayCourse) return null;

  const handleEnroll = () => {
    enrollMutation.mutate(course.id);
  };

  const handleUnenroll = () => {
    if (currentEnrollment && confirm('Are you sure you want to unsubscribe from this course?')) {
      unenrollMutation.mutate(currentEnrollment.id);
    }
  };

  return (
    <div className="course-modal" onClick={onClose}>
      <div className="course-modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="course-modal__header">
          <h2 className="course-modal__title">{displayCourse.title}</h2>
          <button onClick={onClose} className="course-modal__close">
            ×
          </button>
        </div>
        {displayCourse.image && (
          <img
            src={displayCourse.image}
            alt={displayCourse.title}
            className="course-modal__image"
          />
        )}
        <p className="course-modal__description">{displayCourse.description}</p>
        {displayCourse._count && (
          <div className="course-modal__stats">
            <p>Lessons: {displayCourse._count.lessons || 0}</p>
            <p>Enrollments: {displayCourse._count.enrollments || 0}</p>
          </div>
        )}
        <div className="course-modal__actions">
          {currentEnrollment ? (
            <>
              <button
                onClick={onGoToCourse}
                className="course-modal__button course-modal__button--primary"
              >
                Go to Course
              </button>
              <button
                onClick={handleUnenroll}
                disabled={unenrollMutation.isPending}
                className="course-modal__button course-modal__button--danger"
              >
                {unenrollMutation.isPending ? 'Unsubscribing...' : 'Unsubscribe'}
              </button>
            </>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
              className="course-modal__button course-modal__button--success"
            >
              {enrollMutation.isPending ? 'Signing up...' : 'Sign Up'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
