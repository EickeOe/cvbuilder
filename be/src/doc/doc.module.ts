import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DocModel } from './doc.model'
import { DocResolver } from './doc.resolver'
import { DocService } from './doc.service'

@Module({
  providers: [DocService, DocResolver],

  imports: [TypeOrmModule.forFeature([DocModel])],
  exports: [DocService]
})
export class DocModule {}
