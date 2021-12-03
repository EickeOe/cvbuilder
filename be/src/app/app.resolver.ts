import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Args, Field, Mutation, ObjectType, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { developerKey } from 'src/constants'
import { CurrentUser } from 'src/decorator/current-user'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { LicenseService } from 'src/license/license.service'
import { PageInfoModel, Paginated } from 'src/model/page-info.model'
import { PaginatedUser } from 'src/user/dto/user-dto'
import { UserModel } from 'src/user/user.model'
import { isLicenseMember, isLicenseOwner } from 'src/utils/isLicense'
import { AppModel } from './app.model'
import { AppService } from './app.service'
import { PaginatedApp } from './dto/apps-result'
import { NewAppInput, UpdateAppInput } from './dto/new-app.input'

@Resolver(() => AppModel)
export class AppResolver {
  constructor(private readonly appService: AppService, private readonly licenseService: LicenseService) {}

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
  async createApp(@CurrentUser() user: UserModel, @Args('app') input: NewAppInput) {
    const license = await this.licenseService.findOne({ userId: user.id, licensableId: developerKey })

    if (!(isLicenseMember(license) || isLicenseOwner(license))) {
      throw new ForbiddenException('无权限创建应用！')
    }

    const app = await this.appService.createApp(input)
    if (!app) {
      throw new NotFoundException(app)
    }
    // 添加权限
    await this.licenseService.addRole(user.id, app.key, 'app', LICENSE_ROLE.OWNER)

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
  async deleteApp(@CurrentUser() user: UserModel, @Args('key') key: string) {
    const license = await this.licenseService.findOne({ userId: user.id, licensableId: key })

    if (!isLicenseOwner(license)) {
      throw new ForbiddenException('无权限删除此应用！')
    }
    const app = await this.appService.findOneByKey(key)
    if (!app) {
      throw new NotFoundException(key)
    }
    //TODO:  鉴权
    await this.appService.deleteApp(key)
    return app
  }

  // @Query(() => PaginatedApp)
  // appOwner(@Args('userId') userId: string | number) {}

  @ResolveField(() => PaginatedUser, { name: 'owners' })
  async fetchOwners(
    @Parent() app: AppModel,
    @Args({ name: 'pageInfo', nullable: true }) pageInfo: PageInfoModel
  ): Promise<PaginatedUser> {
    return {
      data: [],
      totalCount: 0
    }
  }
}
