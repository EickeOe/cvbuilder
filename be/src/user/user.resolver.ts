import { NotFoundException } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AppModel } from 'src/app/app.model'
import { AppService } from 'src/app/app.service'
import { PaginatedApp } from 'src/app/dto/apps-result'
import { CurrentUser } from 'src/decorator/current-user'
import { ENTITY_TYPE } from 'src/enums/enums'
import { LicenseModel } from 'src/license/license.model'
import { LicenseService } from 'src/license/license.service'
import { PageInfoModel } from 'src/model/page-info.model'
import { StarredService } from 'src/starred/starred.service'
import { PaginatedVisitRecord } from 'src/visit-record/dto/visit-record.dto'
import { VisitRecordService } from 'src/visit-record/visit-record.service'
import { PaginatedUser } from './dto/user-dto'
import { UserModel } from './user.model'
import { UserService } from './user.service'

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly starredService: StarredService,
    private readonly appService: AppService,
    private readonly licenseService: LicenseService,
    private readonly visitRecordService: VisitRecordService
  ) {}

  @Query(() => UserModel, { name: 'user' })
  user(@CurrentUser() user: UserModel) {
    // TODO: 查询用户数据
    return user
  }

  @Query(() => PaginatedUser, { name: 'users' })
  async users(
    @CurrentUser() user: UserModel,
    @Args({ name: 'name', nullable: true }) name: string,
    @Args({ name: 'pageInfo', nullable: true }) pageInfo: PageInfoModel
  ): Promise<PaginatedUser> {
    // TODO: 查询用户数据
    return {
      data: [
        {
          id: '1',
          name: '1'
        }
      ],
      totalCount: 2
    }
  }

  @ResolveField(() => [AppModel], { name: 'starredApps' })
  async fetchStarredApps(
    @Parent() user: UserModel,
    @Args({ name: 'pageInfo', nullable: true }) pageInfo: PageInfoModel
  ): Promise<AppModel[]> {
    const starredApps = await this.starredService.findAppsByUserAndType(user.id, 'app', pageInfo)
    starredApps.sort((a, b) => a.index - b.index)
    const apps = await Promise.all(starredApps.map((item) => this.appService.findOneByKey(item.starrableId)))
    return apps.filter((app) => !!app)
  }

  @ResolveField(() => [AppModel], { name: 'apps' })
  async fetchApps(
    @Parent() user: UserModel,
    @Args({ name: 'pageInfo', nullable: true }) pageInfo: PageInfoModel
  ): Promise<AppModel[]> {
    return []
  }

  @ResolveField(() => PaginatedVisitRecord, { name: 'visitRecords' })
  async visitRecords(
    @Parent() user: UserModel,
    @Args({ name: 'visitableType', nullable: true, type: () => ENTITY_TYPE }) visitableType: ENTITY_TYPE,
    @Args({ name: 'pageInfo', nullable: true }) pageInfo: PageInfoModel
  ): Promise<PaginatedVisitRecord> {
    const model = {
      userId: user.id
    }
    if (visitableType) {
      Object.assign(model, { visitableType })
    }
    const [data, totalCount] = await this.visitRecordService.findAndCount(model, pageInfo)
    return {
      data,
      totalCount
    }
  }

  @ResolveField(() => LicenseModel, { name: 'license' })
  async fetchLicense(
    @Parent() user: UserModel,
    @Args({ name: 'licensableId' }) licensableId: string
  ): Promise<LicenseModel> {
    const license = await this.licenseService.findOne({ userId: user.id, licensableId })

    if (!license) {
      throw new NotFoundException()
    }
    return license
  }
}
