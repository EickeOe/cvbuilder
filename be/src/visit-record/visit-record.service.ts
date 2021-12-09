import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PageInfoModel } from 'src/model/page-info.model'
import { pageInfo2typeorm } from 'src/utils/page-info2typeorm'
import { Repository } from 'typeorm'
import { VisitRecordModel } from './visit-record.model'

@Injectable()
export class VisitRecordService {
  constructor(
    @InjectRepository(VisitRecordModel)
    private readonly repository: Repository<VisitRecordModel>
  ) {}

  findAndCount(model: Partial<VisitRecordModel>, pageInfo?: PageInfoModel) {
    const page = pageInfo2typeorm(pageInfo)
    return this.repository.findAndCount({
      where: { ...model },
      order: {
        recordTime: 'DESC'
      },
      ...page
    })
  }
  remove(id: string) {
    return this.repository.delete({ id })
  }
  save(model: Partial<VisitRecordModel>) {
    return this.repository.save(model)
  }
}
