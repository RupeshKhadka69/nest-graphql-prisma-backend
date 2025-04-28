import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
console.log('PrismaService');
import { PrismaClient } from '@prisma/client';
console.log('PrismaClient', PrismaClient);
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
