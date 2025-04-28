import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleTypes } from '../../common/enums/role-types.enum';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  userRoleId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  userStatus?: string;

  @Field(() => RoleTypes, { nullable: true })
  @IsOptional()
  roleType?: RoleTypes;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
