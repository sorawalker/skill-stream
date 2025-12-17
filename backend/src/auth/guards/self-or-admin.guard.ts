import {
  ExecutionContext,
  Injectable,
  ForbiddenException,
  CanActivate,
} from '@nestjs/common';
import { RequestWithUser } from '../types/jwt-payload.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithUser & { params: { id?: string } }>();
    const { userId } = request.user;
    const requestedUserId = parseInt(request.params.id || '', 10);

    if (isNaN(requestedUserId)) {
      throw new ForbiddenException('Invalid user ID');
    }

    if (userId === requestedUserId) {
      return true;
    }

    const user = await this.usersService.findById(userId);
    if (user && user.role === 'ADMIN') {
      return true;
    }

    throw new ForbiddenException(
      'You can only edit your own profile unless you are an admin',
    );
  }
}
