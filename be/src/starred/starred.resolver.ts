import { NotFoundException } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AppService } from 'src/app/app.service'
import { CurrentUser } from 'src/decorator/current-user'
import { UserModel } from 'src/user/user.model'
import { StarActionResult, StarActionsResult, UpdateStarInput } from './dto/dto'
import { StarredService } from './starred.service'

@Resolver()
export class StarredResolver {
  constructor(private readonly starredService: StarredService, private readonly appService: AppService) {}
  @Mutation(() => StarActionResult, {
    name: 'addStar'
  })
  async addStar(@CurrentUser() user: UserModel, @Args('appKey') starrableId: string): Promise<StarActionResult> {
    const app = await this.appService.findOneByKey(starrableId)
    if (app) {
      const starred = await this.starredService.findByUserAndStarrableId(user.id, starrableId)
      if (!starred) {
        await this.starredService.addStar(user.id, starrableId, 'app')
      }
      return {
        starrable: app
      }
    }
    throw new NotFoundException(`未找到key为${starrableId}的应用`)
  }
  @Mutation(() => StarActionResult, {
    name: 'removeStar'
  })
  async removeStar(@CurrentUser() user: UserModel, @Args('appKey') starrableId: string): Promise<StarActionResult> {
    const app = await this.appService.findOneByKey(starrableId)
    if (app) {
      const starred = await this.starredService.findByUserAndStarrableId(user.id, starrableId)
      if (starred) {
        await this.starredService.removeStar(starred)
      }
      return {
        starrable: app
      }
    }
    throw new NotFoundException(`未找到key为${starrableId}的应用`)
  }

  @Mutation(() => StarActionsResult, {
    name: 'updateStar'
  })
  async updateStar(
    @CurrentUser() user: UserModel,
    @Args('updateStarredList', { name: 'updateStarredList', type: () => [UpdateStarInput] }) input: UpdateStarInput[],
    @Args('type') type: string
  ) {
    if (type === 'app') {
      const apps = await Promise.all(input.map((item) => this.appService.findOneByKey(item.starrableId)))
      const starredApps = await this.starredService.findAppsByUserAndType(user.id, type)

      const nStarredApps = input.map((item) => ({ ...item, userId: user.id, type }))
      const unStarredApps = []

      for (let item of starredApps) {
        const app = nStarredApps.find((a) => a.starrableId === item.starrableId)

        if (app) {
          const temp = { ...app }
          Object.assign(app, item, temp)
        } else {
          unStarredApps.push(item)
        }
      }

      await Promise.all([this.starredService.save(nStarredApps), this.starredService.remove(unStarredApps)])

      return {
        starrable: apps
      }
    }
    throw new NotFoundException('暂不支持！')
  }
}
