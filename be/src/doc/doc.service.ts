import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PageInfoModel } from 'src/model/page-info.model'
import { pageInfo2typeorm } from 'src/utils/page-info2typeorm'
import { FindConditions, FindManyOptions, Like, Repository } from 'typeorm'
import { DocModel } from './doc.model'
import { CreateDocInput } from './dto/doc.dto'

@Injectable()
export class DocService {
  constructor(
    @InjectRepository(DocModel)
    private readonly repository: Repository<DocModel>
  ) {}

  async create(input: Partial<DocModel>) {
    const doc = this.repository.create({
      ...input
    })
    return this.repository.save(doc)
  }

  async findById(id: string) {
    return this.repository.findOne(id)
  }

  async findAndCount(input: Partial<DocModel>, pageInfo?: PageInfoModel) {
    const page = pageInfo2typeorm(pageInfo)

    const query = {
      where: { ...input } as FindConditions<DocModel>,
      ...page
    }
    if (query.where.name) {
      query.where.name = Like(`%${input.name}%`)
    }

    return this.repository.findAndCount(query)
  }
  async remove(doc: DocModel) {
    return this.repository.remove(doc)
  }

  async update(doc: Partial<DocModel>) {
    return this.repository.update({ id: doc.id }, doc)
  }

  async findParentPath(id: string): Promise<DocModel[]> {
    const result = []
    const findParent = async (id: string) => {
      const doc = await this.findById(id)
      result.push(doc)
      if (doc.parentId) {
        findParent(doc.parentId)
      }
    }
    await findParent(id)

    return result
  }
}
