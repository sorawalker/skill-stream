import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { SelfOrAdminGuard } from './guards/self-or-admin.guard';
import { EnrollmentGuard } from './guards/enrollment.guard';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';
import { LessonsModule } from 'src/lessons/lessons.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => EnrollmentsModule),
    forwardRef(() => LessonsModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    SelfOrAdminGuard,
    EnrollmentGuard,
  ],
  exports: [JwtAuthGuard, RolesGuard, SelfOrAdminGuard, EnrollmentGuard],
})
export class AuthModule {}
