import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { ArticleImage } from './article-image.entity';
@ObjectType()
export class Article {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;
  @Field()
  content: string;
  @Field(() => Int)
  views: number;
  @Field()
  categoryId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Category)
  category: Category;

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => [ArticleImage], { nullable: true })
  images: ArticleImage[];

  @Field(() => Int)
  commentCount?: number;

  @Field(() => Int)
  likeCount?: number;
}
