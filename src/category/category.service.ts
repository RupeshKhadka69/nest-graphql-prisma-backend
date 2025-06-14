import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryInput: CreateCategoryInput) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: createCategoryInput.name },
    });
    if (existingCategory) {
      throw new ConflictException('category with this name already exits');
    }
    const category = await this.prisma.category.create({
      data: createCategoryInput,
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return {
      ...category,
      articleCount: category._count.articles,
    };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return categories.map((category) => ({
      ...category,
      articleCount: category._count.articles,
    }));
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });
    if (!category) {
      throw new NotFoundException('category not found');
    }

    return {
      ...category,
      articleCount: category._count.articles,
    };
  }

  async update(id: string, updateCategoryInput: UpdateCategoryInput) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException('The requested category not found!');
    }
    if (updateCategoryInput.name) {
      const nameConflict = await this.prisma.category.findFirst({
        where: { name: updateCategoryInput.name, NOT: { id } },
      });
      if (nameConflict) {
        throw new ConflictException('Category with this name already Exists');
      }
    }
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...updateCategoryInput,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    return {
      ...category,
      articleCount: category._count.articles,
    };
  }

  async remove(id: string) {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found to delete');
    }

    // Check if category has articles
    if (category._count.articles > 0) {
      throw new ConflictException('Cannot delete category that has articles');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return true;
  }
}
