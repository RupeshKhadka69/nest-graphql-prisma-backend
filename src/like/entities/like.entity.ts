import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Like {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  articleId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Article, { nullable: true })
  article?: Article;
}
