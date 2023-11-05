import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { PrismaService } from 'src/common/@services/prisma.service';

@Module({
  controllers: [MembershipController],
  providers: [MembershipService, PrismaService],
})
export class MembershipModule {}
