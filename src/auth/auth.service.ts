// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    try {
      // Use findByEmail instead of findOne
      const user = await this.usersService.findByEmail(email);

      // Verify password with bcrypt
      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        sub: user.id,
        email: user.email,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log('errors', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
