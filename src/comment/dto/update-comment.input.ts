import { CreateCommentInput } from './create-comment.input';
import { InputType, ID, Field, Int, PartialType } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsString } from 'class-validator';
@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  text?: string;
}
