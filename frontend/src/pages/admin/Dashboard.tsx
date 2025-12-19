import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { usersService } from '../../services/users.service';
import { coursesService } from '../../services/courses.service';
import { enrollmentsService } from '../../services/enrollments.service';
import { progressService } from '../../services/progress.service';
import { quizAttemptsService } from '../../services/quiz-attempts.service';
import '../admin/admin-common.scss';
import './Dashboard.scss';

export const Dashboard = () => {
  const { data: usersData } = useQuery({
    queryKey: ['users', 'stats'],
    queryFn: () => usersService.findMany({ page: 1, limit: 1, order: 'asc', sortBy: 'id' }),
  });

  const { data: coursesData } = useQuery({
    queryKey: ['courses', 'stats'],
    queryFn: () => coursesService.findMany({ page: 1, limit: 1, order: 'asc', sortBy: 'id' }),
  });

  const { data: enrollmentsData } = useQuery({
    queryKey: ['enrollments', 'stats'],
    queryFn: () => enrollmentsService.findMany(),
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress', 'stats'],
    queryFn: () => progressService.findMany(),
  });

  const { data: quizAttemptsData } = useQuery({
    queryKey: ['quiz-attempts', 'stats'],
    queryFn: () => quizAttemptsService.findMany(),
  });

  const stats = [
    {
      title: 'Total Users',
      value: usersData?.meta.total || 0,
      link: '/admin/users',
      color: 'primary',
    },
    {
      title: 'Total Courses',
      value: coursesData?.meta.total || 0,
      link: '/admin/courses',
      color: 'success',
    },
    {
      title: 'Total Enrollments',
      value: enrollmentsData?.meta?.total || enrollmentsData?.data?.length || 0,
      link: '/admin/enrollments',
      color: 'secondary',
    },
    {
      title: 'Progress Records',
      value: progressData?.meta?.total || progressData?.data?.length || 0,
      link: '/admin/progress',
      color: 'warning',
    },
    {
      title: 'Quiz Attempts',
      value: quizAttemptsData?.meta?.total || quizAttemptsData?.data?.length || 0,
      link: '/admin/quiz-attempts',
      color: 'danger',
    },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Admin Dashboard</h1>
        <div className="admin-page__actions">
          <Link to="/" className="admin-page__button admin-page__button--primary">
            Go to Main Site
          </Link>
        </div>
      </div>

      <div className="dashboard">
        <div className="dashboard__welcome">
          <h2>Welcome to the Admin Panel</h2>
          <p>
            Manage your learning platform from here. Use the navigation menu to access different
            sections.
          </p>
        </div>

        <div className="dashboard__stats">
          {stats.map((stat) => (
            <Link
              key={stat.title}
              to={stat.link}
              className={`dashboard__stat dashboard__stat--${stat.color}`}
            >
              <div className="dashboard__stat-value">{stat.value}</div>
              <div className="dashboard__stat-title">{stat.title}</div>
            </Link>
          ))}
        </div>

        <div className="dashboard__quick-links">
          <h3>Quick Links</h3>
          <div className="dashboard__links">
            <Link to="/admin/courses" className="dashboard__link">
              Manage Courses
            </Link>
            <Link to="/admin/lessons" className="dashboard__link">
              Manage Lessons
            </Link>
            <Link to="/admin/quizzes" className="dashboard__link">
              Manage Quizzes
            </Link>
            <Link to="/admin/enrollments" className="dashboard__link">
              View Enrollments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
