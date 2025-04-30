import { Module, BadRequestException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
// import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      playground: process.env.ENV === 'dev',
      context: ({ req }: { req: Request }) => ({ request: req }),
      formatError: (error) => {
        const originalError = error.extensions?.originalError;

        if (originalError instanceof BadRequestException) {
          return {
            message: originalError.message,
            code: 'BAD_REQUEST',
            status: originalError.getStatus(),
          };
        }

        return {
          message: error.message,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          path: error.path,
        };
      },
    }),
    PrismaModule,
    UsersModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
