import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './auth.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
interface JwtPayload {
  sub: string;
  email: string;
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Handle both REST and GraphQL
    let request: Request;
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else {
      // GraphQL
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req as Request;
    }
    console.log('requestt', request);
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('payload', payload);
      // Attach user to request object for later use
      request['user'] = payload;
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException('Invalid authentication token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log('type', type);
    console.log('token', token);
    return type === 'Bearer' ? token : undefined;
  }
}
