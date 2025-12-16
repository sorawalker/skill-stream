import type { Course } from 'skill-stream-backend/shared/types';
import './CourseCard.scss';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export const CourseCard = ({ course, onClick }: CourseCardProps) => {
  return (
    <div className="course-card" onClick={onClick}>
      {course.image && (
        <img src={course.image} alt={course.title} className="course-card__image" />
      )}
      <h3 className="course-card__title">{course.title}</h3>
      <p className="course-card__description">{course.description}</p>
      {course._count && (
        <div className="course-card__stats">
          <span>Lessons: {course._count.lessons || 0}</span>
        </div>
      )}
    </div>
  );
};

