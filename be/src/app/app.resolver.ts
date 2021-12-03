import { NotFoundException } from '@nestjs/common'
import { Args, Field, Mutation, ObjectType, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { PageInfoModel, Paginated } from 'src/model/page-info.model'
import { AppModel } from './app.model'
import { AppService } from './app.service'
import { PaginatedApp } from './dto/apps-result'
import { NewAppInput, UpdateAppInput } from './dto/new-app.input'

@Resolver('app')
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query((returns) => AppModel, {
    name: 'app'
  })
  async queryAppByKey(@Args('key') key: string): Promise<AppModel> {
    const app = await this.appService.findOneByKey(key)
    if (!app) {
      throw new NotFoundException(key)
    }
    return app
  }

  @Query((returns) => PaginatedApp, {
    name: 'apps'
  })
  async queryAppByPageInfo(
    @Args({ name: 'key', nullable: true }) key: string,
    @Args({ name: 'disabled', nullable: true }) disabled: boolean,
    @Args({ name: 'pageInfo', nullable: true, type: () => PageInfoModel })
    pageInfo?: PageInfoModel
  ): Promise<PaginatedApp> {
    // if (key) {
    //   const app = await this.appService.findOneByKey(key);
    //   if (!app) {
    //     throw new NotFoundException(key);
    //   }
    //   return app;
    // }
    // console.log(pageInfo);
    return this.appService.fetchApps(
      Object.fromEntries(Object.entries({ key, disabled }).filter(([_, v]) => v != null && v != undefined)),
      pageInfo
    )
  }

  @Mutation((returns) => AppModel)
  async createApp(@Args('app') input: NewAppInput) {
    const app = await this.appService.createApp(input)
    if (!app) {
      throw new NotFoundException(app)
    }
    return app
  }

  @Mutation((returns) => AppModel)
  async updateApp(@Args('app') input: UpdateAppInput) {
    const app = await this.appService.updateApp(input)
    if (!app) {
      throw new NotFoundException(app)
    }
    return app
  }

  @Mutation((returns) => AppModel)
  async deleteApp(@Args('key') key: string) {
    const app = await this.appService.findOneByKey(key)
    if (!app) {
      throw new NotFoundException(key)
    }
    //TODO:  鉴权
    await this.appService.deleteApp(key)
    return app
  }
}
