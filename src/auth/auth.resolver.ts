import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';
import { LoginResponse } from './dto/login-response';
import { LoginInput } from './dto/login-input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.signIn(loginInput.email, loginInput.password);
  }
}
