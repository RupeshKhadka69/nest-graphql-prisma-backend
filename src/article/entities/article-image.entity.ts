import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ArticleImage {
  @Field(() => ID)
  id: string;

  @Field()
  articleId: string;

  @Field()
  imageUrl: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
