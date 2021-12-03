import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { AppResolver } from './app.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppModel } from './app.model'
import { LicenseModule } from 'src/license/license.module'

@Module({
  imports: [TypeOrmModule.forFeature([AppModel]), LicenseModule],
  providers: [AppService, AppResolver],
  exports: [AppService]
})
export class AppModule {}
