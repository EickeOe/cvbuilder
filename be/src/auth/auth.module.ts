import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { LocalStrategy } from './local.strategy'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '../constants'
import { GqlStrategy } from './gql.strategy'
import { AuthResolver } from './auth.resolver'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10000000s' }
    })
  ],
  providers: [AuthService, LocalStrategy, GqlStrategy, AuthResolver],
  exports: [AuthService]
})
export class AuthModule {}
