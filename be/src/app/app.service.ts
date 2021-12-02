import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInfoModel } from 'src/model/page-info.model';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { AppModel } from './app.model';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AppModel)
    private readonly repository: Repository<AppModel>,
  ) { }
  findOneByKey(key: string) {
    return this.repository.findOne({
      where: {
        key,
      },
    });
  }

  createInstance(app: Partial<AppModel>) {
    return this.repository.create(app)
  }

  async createApp(input: AppModel) {
    const app = this.repository.create(input);
    const result = await this.repository.insert(app);
    if (result.identifiers.length === 0) {
      return null;
    }
    return app;
  }

  async updateApp(input: AppModel) {
    const app = await this.findOneByKey(input.key);
    if (!app) {
      throw new NotFoundException(app);
    }
    await this.repository.update(app, { ...app, ...input });

    return { ...app, ...input };
  }

  async fetchApps(inputParams: Partial<AppModel>, pageInfo: PageInfoModel) {
    const take = pageInfo?.size;
    const skip = ((pageInfo?.page || 1) - 1) * pageInfo?.size;

    const query: FindManyOptions<AppModel> = {};

    if (Object.keys(inputParams).length > 0) {
      query.where = { ...inputParams };
      if (inputParams.key) {
        query.where.key = Like(`%${inputParams.key}%`);
      }
    }

    const [data, totalCount] = await this.repository.findAndCount({
      ...query,
      take: take,
      skip: skip,
    });
    return {
      data,
      totalCount,
    };
  }
}
