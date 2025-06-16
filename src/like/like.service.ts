import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Like } from '@prisma/client';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}
  async create(
    createLikeInput: CreateLikeInput,
    userId: string,
  ): Promise<Like> {
    const article = await this.prisma.article.findUnique({
      where: { id: createLikeInput.articleId },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId,
        articleId: createLikeInput.articleId,
      },
    });

    if (existingLike) {
      throw new ConflictException('You have already liked this article');
    }

    const like = await this.prisma.like.create({
      data: {
        userId,
        articleId: createLikeInput.articleId,
      },
      include: {
        user: true,
        article: true,
      },
    });

    return like;
  }

  findAll() {
    return `This action returns all like`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeInput: UpdateLikeInput) {
    return `This action updates a #${id} like`;
  }
  async findByArticle(articleId: string): Promise<Like[]> {
    return this.prisma.like.findMany({
      where: { articleId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async findByUser(userId: string): Promise<Like[]> {
    return this.prisma.like.findMany({
      where: { userId },
      include: {
        article: {
          include: {
            Category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(articleId: string, userId) {
    const like = await this.prisma.like.findFirst({
      where: { userId, articleId },
    });
    if (!like) {
      throw new NotFoundException('user like not found');
    }
    await this.prisma.like.delete({
      where: { id: like.id },
    });

    return true;
  }

  async checkUserLiked(articleId: string, userId: string): Promise<boolean> {
    const like = await this.prisma.like.findFirst({
      where: {
        userId,
        articleId,
      },
    });

    return !!like;
  }

  async getLikeCount(articleId: string): Promise<number> {
    return this.prisma.like.count({
      where: { articleId },
    });
  }
}
