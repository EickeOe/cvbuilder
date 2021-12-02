import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AppModel } from 'src/app/app.model'
import { AppService } from 'src/app/app.service'
import { CurrentUser } from 'src/decorator/current-user'
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
  async StarredApps(@Parent() user: UserModel): Promise<AppModel[]> {
    const starredApps = await this.starredService.findAppsByUserAndType(user.id, 'app')
    starredApps.sort((a, b) => a.index - b.index)
    const apps = await Promise.all(starredApps.map((item) => this.appService.findOneByKey(item.starrableId)))
    return apps
  }
}
