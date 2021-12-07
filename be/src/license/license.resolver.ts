import { ForbiddenException, NotFoundException, PreconditionFailedException } from '@nestjs/common'
import { Args, Int, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { AppService } from 'src/app/app.service'
import { CurrentUser } from 'src/decorator/current-user'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { UserModel } from 'src/user/user.model'
import { UserService } from 'src/user/user.service'
import { isLicenseOwner } from 'src/utils/isLicense'
import { Licensable, LicenseActionResult } from './dto/license.dto'
import { LicenseModel } from './license.model'
import { LicenseService } from './license.service'

@Resolver(() => LicenseModel)
export class LicenseResolver {
  constructor(
    private readonly appService: AppService,
    private readonly licenseService: LicenseService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => LicenseActionResult, {
    name: 'addLicense'
  })
  async addLicense(
    @CurrentUser() user: UserModel,
    @Args('licensableId') licensableId: string,
    @Args('userId') userId: string,
    @Args('role', { type: () => LICENSE_ROLE }) role: LICENSE_ROLE
  ): Promise<LicenseActionResult> {
    const license = await this.licenseService.findOne({ userId: user.id, licensableId: licensableId })

    if (!isLicenseOwner(license)) {
      throw new ForbiddenException('无操作权限！')
    }
    const app = await this.appService.findOneByKey(licensableId)
    if (!app) {
      throw new NotFoundException('无此应用！')
    }
    await this.licenseService.addLicense(userId, licensableId, 'app', role)
    return {
      licensable: app
    }
  }

  @Mutation(() => LicenseActionResult, {
    name: 'removeLicense'
  })
  async removeLicense(
    @CurrentUser() user: UserModel,
    @Args('id', { nullable: true, type: () => Int }) id: number,
    @Args('licensableId', { nullable: true }) licensableId: string,
    @Args('userId', { nullable: true }) userId: string
  ): Promise<LicenseActionResult> {
    let license = null
    if (id) {
      license = await this.licenseService.findOne({ id })
    } else if (licensableId && userId) {
      license = await this.licenseService.findOne({ userId: user.id, licensableId: licensableId })
    } else {
      throw new PreconditionFailedException('参数异常!')
    }

    if (!isLicenseOwner(license)) {
      throw new ForbiddenException('无操作权限！')
    }
    const app = await this.appService.findOneByKey(licensableId)
    if (!app) {
      throw new NotFoundException('无此应用！')
    }
    const nowLicense = await this.licenseService.findOne({ userId: userId, licensableId: licensableId })

    if (nowLicense) {
      await this.licenseService.removeLicense(nowLicense.id)
    }

    return {
      licensable: app
    }
  }

  @ResolveField(() => Licensable, { name: 'licensable' })
  async fetchLicense(@Parent() license: LicenseModel): Promise<typeof Licensable> {
    if (license.licensableType === 'app') {
      const app = this.appService.findOneByKey(license.licensableId)
      if (!app) {
        throw new NotFoundException()
      }

      return app
    }
    throw new NotFoundException()
  }

  @ResolveField(() => UserModel, { name: 'user' })
  async fetchUser(@Parent() license: LicenseModel): Promise<UserModel> {
    const user = this.userService.findOne(license.userId)
    if (!user) {
      throw new NotFoundException()
    }

    return user
  }
}
