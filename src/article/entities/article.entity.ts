import { ObjectType, Field, ID } from '@nestjs/graphql';
@ObjectType()
export class Article {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;
  @Field()
  content: string;
  @Field()
  views: number;
  @Field()
  categoryId: string;
}
