import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UsersResolver,
    UsersService,
  ],
  exports: [UsersService], // Export UsersService so it can be used by other modules like Auth
})
export class UsersModule {}
