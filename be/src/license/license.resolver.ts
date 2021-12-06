import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AppService } from 'src/app/app.service'
import { CurrentUser } from 'src/decorator/current-user'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { UserModel } from 'src/user/user.model'
import { UserService } from 'src/user/user.service'
import { isLicenseOwner } from 'src/utils/isLicense'
import { LicenseActionResult } from './dto/license.dto'
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
    @Args('licensableId') licensableId: string,
    @Args('userId') userId: string
  ): Promise<LicenseActionResult> {
    const license = await this.licenseService.findOne({ userId: user.id, licensableId: licensableId })

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
}
