import type { User } from './user.types';
import type { Course } from './course.types';
import type { Lesson } from './lesson.types';
import type { Enrollment } from './enrollment.types';
import type { UserProgress } from './progress.types';
import type { Quiz, QuizQuestion } from './quiz.types';
import type { FindManyUsersDto } from '../../users/dto/find-many-user.dto';
import type { FindManyCoursesDto } from '../../courses/dto/find-many-courses.dto';
import type { FindManyLessonsDto } from '../../lessons/dto/find-many-lessons.dto';

// User API responses
export type CreateUserResponse = User;

export interface FindManyUsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type FindOneUserResponse = User;

export type UpdateUserResponse = User;

export type DeleteUserResponse = User;

export type FindManyUsersRequest = FindManyUsersDto;

// Course API responses
export type CreateCourseResponse = Course;

export interface FindManyCoursesResponse {
  data: Course[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type FindOneCourseResponse = Course;

export type UpdateCourseResponse = Course;

export type DeleteCourseResponse = Course;

export type FindManyCoursesRequest = FindManyCoursesDto;

// Lesson API responses
export type CreateLessonResponse = Lesson;

export interface FindManyLessonsResponse {
  data: Lesson[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type FindOneLessonResponse = Lesson;

export type UpdateLessonResponse = Lesson;

export type DeleteLessonResponse = Lesson;

export type FindManyLessonsRequest = FindManyLessonsDto;

// Enrollment API responses
export type CreateEnrollmentResponse = Enrollment;

export interface FindManyEnrollmentsResponse {
  data: Enrollment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type FindOneEnrollmentResponse = Enrollment;

export type UpdateEnrollmentResponse = Enrollment;

export type DeleteEnrollmentResponse = Enrollment;

// Progress API responses
export type CreateProgressResponse = UserProgress;

export interface FindManyProgressResponse {
  data: UserProgress[];
  meta: {
    total: number;
  };
}

export type FindOneProgressResponse = UserProgress | null;

export type UpdateProgressResponse = UserProgress;

// Quiz API responses
export type CreateQuizResponse = Quiz;

export interface FindManyQuizzesResponse {
  data: Quiz[];
  meta: {
    total: number;
  };
}

export type FindOneQuizResponse =
  | Quiz
  | {
      id: number;
      lessonId: number;
      title: string;
      questions: Array<Omit<QuizQuestion, 'rightAnswer'>>;
      createdAt: Date | string;
      updatedAt: Date | string;
    };

export type UpdateQuizResponse = Quiz;

export type DeleteQuizResponse = Quiz;
