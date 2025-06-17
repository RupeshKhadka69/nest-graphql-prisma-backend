import { ObjectType, Field, ID } from '@nestjs/graphql';
import { RoleTypes } from '@prisma/client';
@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  // Password is excluded from GraphQL schema for security
  password: string;

  @Field()
  userRoleId: string;

  @Field({ defaultValue: 'Active' })
  userStatus: string;

  @Field(() => RoleTypes, { defaultValue: 'READER', nullable: true })
  roleType: RoleTypes | null;

  @Field({ nullable: true })
  phoneNumber?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations - not directly exposed in GraphQL schema
  // but can be accessed through resolvers
}
