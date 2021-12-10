import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DocModel } from './doc.model'
import { CreateDocInput } from './dto/doc.dto'

@Injectable()
export class DocService {
  constructor(
    @InjectRepository(DocModel)
    private readonly repository: Repository<DocModel>
  ) {}

  create(input: CreateDocInput) {
    return this.repository.insert({
      ...input,
      createdAt: Date.now()
    })
  }
}
