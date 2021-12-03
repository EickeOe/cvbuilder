import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AppModel } from 'src/app/app.model'
import { AppService } from 'src/app/app.service'
import { CurrentUser } from 'src/decorator/current-user'
import { PageInfoModel } from 'src/model/page-info.model'
import { StarredService } from 'src/starred/starred.service'
import { UserModel } from './user.model'
import { UserService } from './user.service'

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly starredService: StarredService,
    private readonly appService: AppService
  ) {}

  @Query(() => UserModel, { name: 'user' })
  user(@CurrentUser() user: UserModel) {
    // TODO: 查询用户数据
    return user
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
}
