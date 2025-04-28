import {
  Body,
  Controller,
  //   Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() // Mark this endpoint as public
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  //   @Get('profile')
  //   getProfile(
  //     @Request() req: { user: { id: string; email: string; username: string } },
  //   ) {
  //     return req.user;
  //   }
}
