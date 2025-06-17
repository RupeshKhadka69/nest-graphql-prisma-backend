import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/users/current.decorator';
import { Article } from './entities/article.entity';

@Resolver(Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) { }

  @Mutation(() => Article)
  @UseGuards(AuthGuard)
  async create(
    @Args('createArticleInput') createArticleInput: CreateArticleInput,
    @CurrentUser() user: any,
  ) {
    return this.articleService.create(createArticleInput, user.id);
  }

  @Query(() => Article, { name: 'articles' })
  async findAll(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
    @Args('categoryId', { type: () => String, nullable: true })
    categoryId?: string,
    @Args('searchTerm', { type: () => String, nullable: true })
    searchTerm?: string,
  ) {
    return this.articleService.findAll(skip, take, categoryId, searchTerm);
  }

  @Query(() => Article, { name: 'article' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @Args('incrementViews', { type: () => Boolean, defaultValue: false })
    incrementViews: boolean,
  ) {
    return this.articleService.findOne(id, incrementViews);
  }

  @Query(() => [Article], { name: 'articlesByCategory' })
  async findByCategory(
    @Args('categoryId', { type: () => String }) categoryId: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ) {
    return this.articleService.findByCategory(categoryId, skip, take);
  }

  @Query(() => [Article], { name: 'mostViewedArticles' })
  async getMostViewed(
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ) {
    return this.articleService.getMostViewed(take);
  }

  @Query(() => [Article], { name: 'mostLikedArticles' })
  async getMostLiked(
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ) {
    return this.articleService.getMostLiked(take);
  }

  @Mutation(() => Article)
  @UseGuards(AuthGuard)
  async update(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateArticleInput') updateArticleInput: UpdateArticleInput,
    @CurrentUser() user: any,
  ) {
    return this.articleService.update(id, updateArticleInput, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async remove(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ) {
    return this.articleService.remove(id, user.id);
  }
}
