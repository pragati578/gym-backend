import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT } from 'src/constant';
import { PrismaService } from 'src/common/@services/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT.SECRET,
      expiresIn: JWT.EXPIRES_IN,
    });
  }

  async validate(payload: any) {
    // check if user exists and access_token is not malformed
    const user = await this.prismaService.user.findFirst({
      where: { id: payload.sub },
    });

    if (!user) throw new UnauthorizedException();
    delete user.password;
    return user;
  }
}
