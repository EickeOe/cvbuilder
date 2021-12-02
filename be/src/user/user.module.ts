import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModel } from './user.model'
import { AppModule } from 'src/app/app.module'
import { StarredModule } from 'src/starred/starred.module'

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), AppModule, StarredModule],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
