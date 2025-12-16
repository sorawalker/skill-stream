import {
  ExecutionContext,
  Injectable,
  ForbiddenException,
  CanActivate,
} from '@nestjs/common';
import { EnrollmentsService } from '../../enrollments/enrollments.service';
import { LessonsService } from '../../lessons/lessons.service';
import { UsersService } from '../../users/users.service';
import { RequestWithUser } from '../types/jwt-payload.interface';

@Injectable()
export class EnrollmentGuard implements CanActivate {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly lessonsService: LessonsService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithUser & { params: { id?: string } }>();

    if (!request.user || !request.user.userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const { userId } = request.user;

    // Get user to check role
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.role === 'ADMIN' || user.role === 'MANAGER') {
      return true;
    }

    const lessonIdParam = request.params?.id;
    if (!lessonIdParam) {
      throw new ForbiddenException('Invalid lesson ID');
    }

    const lessonId = parseInt(lessonIdParam, 10);

    if (!lessonId || isNaN(lessonId)) {
      throw new ForbiddenException('Invalid lesson ID');
    }

    const lesson = await this.lessonsService.findById(lessonId);

    if (!lesson || !lesson.courseId) {
      throw new ForbiddenException('Lesson not found');
    }

    const enrollment = await this.enrollmentsService.findByCourseAndUser(
      lesson.courseId,
      userId,
    );

    if (!enrollment) {
      throw new ForbiddenException(
        'You must be enrolled in this course to access lessons',
      );
    }

    return true;
  }
}
