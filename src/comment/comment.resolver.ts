import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  NumberScalarMode,
} from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { CurrentUser } from 'src/users/current.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/auth.guard';
@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => Comment)
  @UseGuards(AuthGuard)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() user: any,
  ) {
    return this.commentService.create(createCommentInput, user.id);
  }

  @Query(() => [Comment], { name: 'comments' })
  findAll(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ) {
    return this.commentService.findAll(skip, take);
  }

  @Query(() => Comment, { name: 'articleComments' })
  async findByArticle(
    @Args('articleId', { type: () => ID }) articleId: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ) {
    return this.commentService.findByArticle(articleId, skip, take);
  }

  @Query(() => Comment, { name: 'userComments' })
  @UseGuards(AuthGuard)
  async findByUser(
    @CurrentUser() user: any,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ) {
    return this.commentService.findByUser(user.id, skip, take);
  }

  @Query(() => Comment, { name: 'comment' })
  @UseGuards(AuthGuard)
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.commentService.findOne(id);
  }

  @Mutation(() => Comment)
  @UseGuards(AuthGuard)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @CurrentUser() user: any,
  ) {
    return this.commentService.update(updateCommentInput, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  removeComment(
    @Args('id', { type: () => Int }) id: string,
    @CurrentUser() user: any,
  ) {
    return this.commentService.remove(id, user.id);
  }
}
