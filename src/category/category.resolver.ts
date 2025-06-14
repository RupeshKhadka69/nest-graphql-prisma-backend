import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/auth.guard';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  @UseGuards(AuthGuard)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => Category)
  @UseGuards(AuthGuard)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation(() => Category)
  @UseGuards(AuthGuard)
  removeCategory(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.categoryService.remove(id);
  }
}
