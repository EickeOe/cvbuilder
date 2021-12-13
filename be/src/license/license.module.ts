import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppModule } from 'src/app/app.module'
import { DocModule } from 'src/doc/doc.module'
import { UserModule } from 'src/user/user.module'
import { LicenseModel } from './license.model'
import { LicenseResolver } from './license.resolver'
import { LicenseService } from './license.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([LicenseModel]),
    forwardRef(() => AppModule),
    forwardRef(() => DocModule),
    forwardRef(() => UserModule)
  ],
  providers: [LicenseService, LicenseResolver],
  exports: [LicenseService]
})
export class LicenseModule {}
