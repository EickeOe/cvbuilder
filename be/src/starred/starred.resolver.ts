import { NotFoundException } from '@nestjs/common'
import { Args, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql'
import { AppModel } from 'src/app/app.model'
import { AppService } from 'src/app/app.service'
import { CurrentUser } from 'src/decorator/current-user'
import { UserModel } from 'src/user/user.model'
import { StarActionResult } from './dto/dto'
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
      console.log(starred)
      if (starred) {
        await this.starredService.removeStar(starred)
      }
      return {
        starrable: app
      }
    }
    throw new NotFoundException(`未找到key为${starrableId}的应用`)
  }
}
