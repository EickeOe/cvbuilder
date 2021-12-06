import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PageInfoModel } from 'src/model/page-info.model'
import { FindManyOptions, Like, Repository } from 'typeorm'
import { UserModel } from './user.model'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly repository: Repository<UserModel>
  ) {}

  private readonly users = [
    {
      id: '1',
      name: '1'
    },
    {
      id: '2',
      name: '2'
    }
  ] as UserModel[]

  async findOne(id: string): Promise<UserModel | undefined> {
    return this.users.find((user) => user.id === id)
  }
}
