import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

// Define an interface for the user payload from JWT
interface UserPayload {
  id: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserPayload => {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      return request.user as UserPayload;
    }

    // GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request;
    return request.user as UserPayload;
  },
);
