import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { CurrentUser } from './current.decorator';
import { LoginResponse } from './dto/login-response';
import { LoginInput } from './dto/login-input';
import { Public } from './auth.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }
  @Public()
  @Mutation(() => LoginResponse)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.usersService.signIn(loginInput.email, loginInput.password);
  }
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }
  @Query(() => User, { name: 'me' })
  getMyProfile(@CurrentUser() user) {
    return this.usersService.findOneById(user.sub);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  // Additional query to find user by email
  @Query(() => User, { name: 'userByEmail', nullable: true })
  findByEmail(@Args('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
