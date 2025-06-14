import { IsNotEmpty, IsOptional, isString, IsUUID } from 'class-validator';
import { CreateCategoryInput } from './create-category.input';
import { InputType, Field, Int, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
