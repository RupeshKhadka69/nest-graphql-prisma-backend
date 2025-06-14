// category/dto/create-category-input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;
}
