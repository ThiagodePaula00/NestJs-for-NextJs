import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser | null | undefined,
    info: unknown,
    context: ExecutionContext,
    status?: number,
  ): TUser {
    if (err) {
      return super.handleRequest<TUser>(err, user, info, context, status);
    }

    if (!user || info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Você precisa fazer login');
    }

    return super.handleRequest<TUser>(err, user, info, context, status);
  }
}
