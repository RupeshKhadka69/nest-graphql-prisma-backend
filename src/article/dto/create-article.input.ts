import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
@InputType()
export class CreateArticleInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
