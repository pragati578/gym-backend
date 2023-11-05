import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { PrismaService } from 'src/common/@services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMembershipDto: CreateMembershipDto) {
    return await this.prisma.memberShip.create({
      data: {
        ...createMembershipDto,
      },
    });
  }

  async findAll() {
    return await this.prisma.memberShip.findMany();
  }

  async findOne(id: string) {
    const data = await this.prisma.memberShip.findUnique({
      where: { id },
    });

    if (!data) {
      throw new BadRequestException('Membership not found');
    }
  }

  async findAllMemberships() {
    return await this.prisma.memberShip.findMany();
  }

  async findUserMembership(user: User) {
    const membership = await this.prisma.userMemberShip.findFirst({
      where: { userId: user.id },
      include: { membership: true },
    });

    if (!membership) {
      throw new BadRequestException('Membership not found');
    }

    return membership;
  }

  async join(id: string, user: User) {
    await this.findOne(id);

    //check if user is associated with any membership, if yes update if not create
    const membership = await this.prisma.userMemberShip.findFirst({
      where: { userId: user.id },
    });

    if (membership) {
      return await this.prisma.userMemberShip.update({
        where: { id: membership.id },
        data: {
          membershipId: id,
        },
      });
    } else {
      return await this.prisma.userMemberShip.create({
        data: {
          membershipId: id,
          userId: user.id,
        },
      });
    }
  }

  async update(id: string, updateMembershipDto: UpdateMembershipDto) {
    await this.findOne(id);

    return await this.prisma.memberShip.update({
      where: { id },
      data: {
        ...updateMembershipDto,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return `This action removes a #${id} membership`;
  }
}
