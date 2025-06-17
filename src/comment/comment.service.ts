import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async create(
    createCommentInput: CreateCommentInput,
    userId: string,
  ): Promise<Comment> {
    const article = await this.prisma.article.findUnique({
      where: { id: createCommentInput.articleId },
    });
    if (!article) {
      throw new NotFoundException('Article not found to comment');
    }

    const comment = await this.prisma.comment.create({
      data: {
        text: createCommentInput.text,
        articleId: createCommentInput.articleId,
        userId,
      },
      include: {
        user: true,
        article: true,
      },
    });
    // if (!comment) {
    //   throw new Error('failed to create comment');
    // }

    return comment;
  }
  async findByArticle(articleId: string, skip = 0, take = 10) {
    return this.prisma.comment.findMany({
      where: { articleId },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });
  }
  async findByUser(userId: string, skip = 0, take = 10) {
    return this.prisma.comment.findMany({
      where: { userId },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        article: {
          include: {
            Category: true,
          },
        },
      },
    });
  }

  async findAll(skip = 0, take = 10) {
    return this.prisma.comment.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        article: true,
      },
    });
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: true,
        article: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
  async update(
    updateCommentInput: UpdateCommentInput,
    userId: string,
  ): Promise<Comment> {
    const { id, ...updateData } = updateCommentInput;

    // Check if comment exists and belongs to user
    const existingComment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    if (existingComment.userId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    const comment = await this.prisma.comment.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        user: true,
        article: true,
      },
    });

    return comment;
  }

  async remove(id: string, userId: string): Promise<boolean> {
    // Check if comment exists and belongs to user
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.comment.delete({
      where: { id },
    });

    return true;
  }

  async getCommentCount(articleId: string): Promise<number> {
    return this.prisma.comment.count({
      where: { articleId },
    });
  }
}
