import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LicenseModel } from './license.model'
import { LicenseService } from './license.service'

@Module({
  imports: [TypeOrmModule.forFeature([LicenseModel])],
  providers: [LicenseService],
  exports: [LicenseService]
})
export class LicenseModule {}
