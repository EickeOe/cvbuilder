import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AppModel } from 'src/app/app.model'
import { PageInfoModel } from 'src/model/page-info.model'
import { pageInfo2typeorm } from 'src/utils/page-info2typeorm'
import { Repository } from 'typeorm'
import { StarredModel } from './starred.model'

@Injectable()
export class StarredService {
  constructor(
    @InjectRepository(StarredModel)
    private readonly repository: Repository<StarredModel>
  ) {}

  save(a: any) {
    this.repository.save(a)
  }

  remove(a: any) {
    this.repository.remove(a)
  }
  async addStar(userId: string, starrableId: string, type: string) {
    const starred = this.repository.create({
      starrableId,
      userId,
      type
    })
    return this.repository.insert(starred)
  }

  async removeStar(starred: StarredModel) {
    return this.repository.remove(starred)
  }

  async findByUserAndStarrableId(userId: string, starrableId: string) {
    return this.repository.findOne({
      where: {
        userId,
        starrableId
      }
    })
  }
  async findAppsByUserAndType(userId: string, type?: string, pageInfo?: PageInfoModel): Promise<StarredModel[]> {
    const page = pageInfo2typeorm(pageInfo)
    return this.repository.find({
      where: {
        userId,
        type
      },
      order: {
        index: 'ASC'
      },
      ...page
    })
  }
}
