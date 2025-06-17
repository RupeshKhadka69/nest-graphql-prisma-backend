import { CreateArticleInput } from './create-article.input';
import { PartialType } from '@nestjs/mapped-types';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
