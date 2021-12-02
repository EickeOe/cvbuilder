import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AppModel } from 'src/app/app.model'
import { Repository } from 'typeorm'
import { StarredModel } from './starred.model'

@Injectable()
export class StarredService {
  constructor(
    @InjectRepository(StarredModel)
    private readonly repository: Repository<StarredModel>
  ) {}

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
  async findAppsByUserAndType(userId: string, type?: string): Promise<StarredModel[]> {
    return this.repository.find({
      where: {
        userId,
        type
      }
    })
  }
}
