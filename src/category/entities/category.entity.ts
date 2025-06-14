import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Int, { nullable: true })
  articleCount: number;
}
