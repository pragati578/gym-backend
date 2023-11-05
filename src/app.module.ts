import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { OtpModule } from './otp/otp.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MembershipModule } from './membership/membership.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
    OtpModule,
    AuthModule,
    UserModule,
    MembershipModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
