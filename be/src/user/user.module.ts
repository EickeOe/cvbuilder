import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModel } from './user.model'
import { AppModule } from 'src/app/app.module'
import { StarredModule } from 'src/starred/starred.module'
import { LicenseModule } from 'src/license/license.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    forwardRef(() => AppModule),
    forwardRef(() => StarredModule),
    forwardRef(() => LicenseModule)
  ],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
