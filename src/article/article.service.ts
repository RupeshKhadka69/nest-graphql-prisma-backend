import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleInput: CreateArticleInput, userId: string) {
    const { imageUrls, ...articleData } = createArticleInput;
    const category = await this.prisma.category.findUnique({
      where: { id: createArticleInput.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category Not found');
    }
    const article = await this.prisma.article.create({
      data: {
        ...articleData,
        ArticleImage: imageUrls?.length
          ? {
              create: imageUrls.map((url) => ({
                imageUrl: url,
              })),
            }
          : undefined,
      },
      include: {
        Category: true,
        ArticleImage: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return this.mapArticleWithCounts(article);
  }

  async findAll(skip = 0, take = 10, categoryId?: string, searchItem?: string) {
    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (searchItem) {
      where.OR = [
        { title: { contains: searchItem, mode: 'insensitive' } },
        { content: { contains: searchItem, mode: 'insensitive' } },
      ];
    }

    const articles = await this.prisma.article.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        Category: true,
        ArticleImage: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        likes: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return articles.map((article) => this.mapArticleWithCounts(article));
  }

  async findOne(id: string, incrementViews = false) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        Category: true,
        ArticleImage: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        likes: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article Not found');
    }

    if (incrementViews) {
      await this.prisma.article.update({
        where: { id },
        data: {
          views: {
            increment: 1,
          },
        },
      });
      article.views += 1;
    }
   return this.mapArticleWithCounts(article);
  }

  async update(
    id: string,
    updateArticleInput: UpdateArticleInput,
    userId?: string,
  ) {
    const { imageUrls, ...updateData } = updateArticleInput;

    // Check if article exists
    const existingArticle = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      throw new NotFoundException('Article not found');
    }

    // If categoryId is being updated, verify new category exists
    if (updateData.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateData.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const updatePayload: any = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Handle image updates if provided
    if (imageUrls !== undefined) {
      updatePayload.ArticleImage = {
        deleteMany: {}, // Delete existing images
        create: imageUrls.map((url) => ({
          imageUrl: url,
        })),
      };
    }

    const article = await this.prisma.article.update({
      where: { id },
      data: updatePayload,
      include: {
        Category: true,
        ArticleImage: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return this.mapArticleWithCounts(article);
  }

  async remove(id: string, userId?: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });

    if (!article) {
      throw new NotFoundException('Article not found to delete');
    }
    await this.prisma.article.delete({ where: { id } });

    return true;
  }

  async findByCategory(categoryId: string, skip = 0, take = 10) {
    return this.findAll(skip, take, categoryId);
  }

  async getMostViewed(take = 10) {
    const articles = await this.prisma.article.findMany({
      take,
      orderBy: {
        views: 'desc',
      },
      include: {
        Category: true,
        ArticleImage: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return articles.map((article) => this.mapArticleWithCounts(article));
  }

  async getMostLiked(take = 10) {
    const articles = await this.prisma.article.findMany({
      take,
      include: {
        Category: true,
        ArticleImage: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: {
        likes: {
          _count: 'desc',
        },
      },
    });

    return articles.map((article) => this.mapArticleWithCounts(article));
  }

  private mapArticleWithCounts(article: any) {
    return {
      ...article,
      category: article.Category,
      images: article.ArticleImage,
      commentCount: article._count?.comments || 0,
      likeCount: article._count?.likes || 0,
    };
  }
}
