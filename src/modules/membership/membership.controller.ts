import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { JwtAuthGuard } from 'src/common/@guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/@guards/roles.guard';
import { Roles } from 'src/common/@decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User, UserType } from '@prisma/client';
import { GetUser } from 'src/common/@decorators/user.decorator';

@ApiTags('Membership')
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @ApiOperation({ summary: 'Create a new membership' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipService.create(createMembershipDto);
  }

  @ApiOperation({ summary: 'Get all memberships' })
  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  @ApiOperation({ summary: 'Get a membership by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipService.findOne(id);
  }

  @ApiOperation({ summary: 'Get the membership of the authenticated user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.USER)
  @Get('my-membership')
  findUserMembership(@GetUser() user: User) {
    return this.membershipService.findUserMembership(user);
  }

  @ApiOperation({ summary: 'Get all memberships (Admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @Get('all-memberships')
  findAllMemberships() {
    return this.membershipService.findAllMemberships();
  }

  @ApiOperation({ summary: 'Join a membership (User only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.USER)
  @Post('join/:id')
  @ApiParam({ name: 'id', type: 'string' })
  join(@Param('id') id: string, @GetUser() user: User) {
    return this.membershipService.join(id, user);
  }

  @ApiOperation({ summary: 'Update a membership (Admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string' })
  update(
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return this.membershipService.update(id, updateMembershipDto);
  }

  @ApiOperation({ summary: 'Remove a membership (Admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.membershipService.remove(id);
  }
}
