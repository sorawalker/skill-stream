import type { Course } from 'skill-stream-backend/shared/types';
import './CourseCard.scss';

interface CourseCardProps {
  course:
    | Course
    | {
        id: number;
        title: string;
        description: string;
        image: string;
        createdAt?: string | Date;
        updatedAt?: string | Date;
        _count?: {
          lessons?: number;
        };
      };
  progress?: number;
  onClick: () => void;
}

export const CourseCard = ({ course, progress, onClick }: CourseCardProps) => {
  const showProgress = progress !== undefined && progress !== null;

  return (
    <div className="course-card" onClick={onClick}>
      {course.image && <img src={course.image} alt={course.title} className="course-card__image" />}
      <div className="course-card__content">
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__description">{course.description}</p>
        {course._count && (
          <div className="course-card__stats">
            <span>Lessons: {course._count.lessons || 0}</span>
          </div>
        )}
        {showProgress && (
          <div className="course-card__progress">
            <div className="course-card__progress-header">
              <span className="course-card__progress-label">Progress</span>
              <span className="course-card__progress-percentage">{Math.round(progress)}%</span>
            </div>
            <div className="course-card__progress-bar">
              <div
                className="course-card__progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
