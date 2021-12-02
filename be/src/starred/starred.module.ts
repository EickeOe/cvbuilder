import { Module } from '@nestjs/common'
import { StarredService } from './starred.service'
import { StarredResolver } from './starred.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StarredModel } from './starred.model'
import { AppModule } from 'src/app/app.module'

@Module({
  imports: [TypeOrmModule.forFeature([StarredModel]), AppModule],
  providers: [StarredService, StarredResolver],
  exports: [StarredService]
})
export class StarredModule {}
