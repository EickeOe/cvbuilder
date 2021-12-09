import { NotFoundException } from '@nestjs/common'
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { AppModel } from 'src/app/app.model'
import { AppService } from 'src/app/app.service'
import { visitRecordMaxCount } from 'src/constants'
import { CurrentUser } from 'src/decorator/current-user'
import { ENTITY_TYPE } from 'src/enums/enums'
import { UserModel } from 'src/user/user.model'
import { Visitable, VisitRecordActionResult } from './dto/visit-record.dto'
import { VisitRecordModel } from './visit-record.model'
import { VisitRecordService } from './visit-record.service'

@Resolver(() => VisitRecordModel)
export class VisitRecordResolver {
  constructor(private readonly recentVisitService: VisitRecordService, private readonly appService: AppService) {}
  @Mutation(() => VisitRecordActionResult, {
    name: 'addVisit'
  })
  async addVisit(@CurrentUser() user: UserModel, @Args('visitableId') visitableId: string) {
    const app = await this.appService.findOneByKey(visitableId)
    if (app) {
      const [recentVisitList, count] = await this.recentVisitService.findAndCount({ userId: user.id })
      const currentAppRecord = recentVisitList.find((item) => item.visitableId === app.key)
      if (currentAppRecord) {
        await this.recentVisitService.save({ ...currentAppRecord, recordTime: Date.now() })
      } else {
        if (count >= visitRecordMaxCount) {
          const last = recentVisitList.pop()
          await this.recentVisitService.remove(last.id)
        }

        await this.recentVisitService.save({
          userId: user.id,
          visitableId: app.key,
          visitableType: ENTITY_TYPE.APP,
          recordTime: Date.now()
        })
      }
      return {
        visitable: app
      }
    }
  }

  @ResolveField(() => Visitable, { name: 'visitable' })
  async fetchLicense(@Parent() visitRecord: VisitRecordModel): Promise<typeof Visitable> {
    if (visitRecord.visitableType === ENTITY_TYPE.APP) {
      const app = this.appService.findOneByKey(visitRecord.visitableId)
      if (!app) {
        throw new NotFoundException()
      }

      return app
    }
    throw new NotFoundException()
  }
}
