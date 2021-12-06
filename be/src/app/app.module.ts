import { forwardRef, Module } from '@nestjs/common'
import { AppService } from './app.service'
import { AppResolver } from './app.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppModel } from './app.model'
import { LicenseModule } from 'src/license/license.module'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([AppModel]), LicenseModule, forwardRef(() => UserModule)],
  providers: [AppService, AppResolver],
  exports: [AppService]
})
export class AppModule {}
