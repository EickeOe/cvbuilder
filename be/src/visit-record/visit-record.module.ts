import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppModule } from 'src/app/app.module'
import { VisitRecordModel } from './visit-record.model'
import { VisitRecordResolver } from './visit-record.resolver'
import { VisitRecordService } from './visit-record.service'

@Module({
  imports: [TypeOrmModule.forFeature([VisitRecordModel]), forwardRef(() => AppModule)],
  providers: [VisitRecordService, VisitRecordResolver],
  exports: [VisitRecordService]
})
export class VisitRecordModule {}
