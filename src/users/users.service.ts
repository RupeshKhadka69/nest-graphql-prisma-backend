import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    // If no role ID is provided, find or create a default 'READER' role
    const { userRoleId, roleType, ...datas } = createUserInput;
    let roleId = userRoleId;
    if (!roleId && roleType) {
      const role = await this.prisma.role.findFirst({
        where: { roleType },
      });

      if (!role) {
        throw new BadRequestException(`Role with type ${roleType} not found`);
      }

      roleId = role.id;
    }

    if (!roleId) {
      throw new BadRequestException(
        'Either userRoleId or roleType must be provided',
      );
    }
    const hashedPassword = await bcrypt.hash(datas.password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          ...datas,
          userRoleId: roleId,
          roleType,
          password: hashedPassword,
        },
      });
    } catch (error) {
      // Handle Prisma unique constraint error (P2002)
      if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }
  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    try {
      // Use findByEmail instead of findOne
      const user = await this.prisma.user.findFirst({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

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
  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${email} not found`);
    }

    return user;
  }
  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hash(
        updateUserInput.password,
        10,
      );
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserInput,
      });
    } catch (error) {
      // if (error.code === 'P2025') {
      //   throw new NotFoundException(`User with ID ${id} not found`);
      // }
      // throw error;
      console.log('error', error);
    }
  }
  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.log('error', error);
      // if (error.code === 'P2025') {
      //   throw new NotFoundException(`User with ID ${id} not found`);
      // }
      // throw new error;
    }
  }

  // Additional method to get user with role
  async findOneWithRole(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }
}
