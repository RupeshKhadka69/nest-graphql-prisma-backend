import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './entities/like.entity';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/auth.guard';
import { CurrentUser } from 'src/users/current.decorator';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => Like)
  @UseGuards(AuthGuard)
  createLike(
    @Args('createLikeInput') createLikeInput: CreateLikeInput,
    @CurrentUser() user: any,
  ) {
    return this.likeService.create(createLikeInput, user);
  }

  @Query(() => [Like], { name: 'like' })
  findAll() {
    return this.likeService.findAll();
  }

  @Query(() => Like, { name: 'like' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.likeService.findOne(id);
  }

  @Mutation(() => Like)
  updateLike(@Args('updateLikeInput') updateLikeInput: UpdateLikeInput) {
    return this.likeService.update(updateLikeInput.id, updateLikeInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  removeLike(
    @Args('articleId', { type: () => ID }) articleId: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.likeService.remove(articleId, user.id);
  }
  @Query(() => [Like], { name: 'articleLikes' })
  async findByArticle(
    @Args('articleId', { type: () => ID }) articleId: string,
  ): Promise<Like[]> {
    return this.likeService.findByArticle(articleId);
  }
  @Query(() => [Like], { name: 'userLikes' })
  @UseGuards(AuthGuard)
  async findByUser(@CurrentUser() user: any): Promise<Like[]> {
    return this.likeService.findByUser(user.id);
  }
  @Query(() => Boolean, { name: 'hasUserLiked' })
  @UseGuards(AuthGuard)
  async checkUserLiked(
    @Args('articleId', { type: () => ID }) articleId: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.likeService.checkUserLiked(articleId, user.id);
  }

  @Query(() => Number, { name: 'likeCount' })
  async getLikeCount(
    @Args('articleId', { type: () => ID }) articleId: string,
  ): Promise<number> {
    return this.likeService.getLikeCount(articleId);
  }
}
