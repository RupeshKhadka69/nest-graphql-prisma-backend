import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ArticleResolver, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
