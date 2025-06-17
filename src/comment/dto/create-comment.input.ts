import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  text: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  articleId: string;
}
