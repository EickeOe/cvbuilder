import { ForbiddenException, NotFoundException, PreconditionFailedException } from '@nestjs/common'
import { Args, Int, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { AppService } from 'src/app/app.service'
import { CurrentUser } from 'src/decorator/current-user'
import { DocService } from 'src/doc/doc.service'
import { ENTITY_TYPE } from 'src/enums/enums'
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
    private readonly docService: DocService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => LicenseActionResult, {
    name: 'addLicense'
  })
  async addLicense(
    @CurrentUser() user: UserModel,
    @Args('licensableId') licensableId: string,
    @Args('userId') userId: string,
    @Args('licensableType', { type: () => ENTITY_TYPE }) licensableType: ENTITY_TYPE,
    @Args('role', { type: () => LICENSE_ROLE }) role: LICENSE_ROLE
  ): Promise<LicenseActionResult> {
    const actorLicense = await this.licenseService.findLicense(user.id, licensableId, licensableType)

    if (!isLicenseOwner(actorLicense)) {
      throw new ForbiddenException('无操作权限！')
    }

    let licensable = null

    if (licensableType === ENTITY_TYPE.APP) {
      licensable = await this.appService.findOneByKey(licensableId)
    } else if (licensableType === ENTITY_TYPE.DOC) {
      licensable = await this.docService.findById(licensableId)
    }

    if (!licensable) {
      throw new NotFoundException('无此licensable！')
    }

    await this.licenseService.addLicense(userId, licensableId, licensableType, role)

    return {
      licensable
    }
  }

  @Mutation(() => LicenseActionResult, {
    name: 'removeLicense'
  })
  async removeLicense(
    @CurrentUser() user: UserModel,
    @Args('id', { nullable: true }) id: string
  ): Promise<LicenseActionResult> {
    let license = await this.licenseService.findOne({ id })

    if (!license) {
      throw new NotFoundException('无此授权！')
    }

    const actorLicense = await this.licenseService.findLicense(user.id, license.id, license.licensableType)

    if (!isLicenseOwner(actorLicense)) {
      throw new ForbiddenException('无操作权限！')
    }
    let licensable = null

    if (license.licensableType === ENTITY_TYPE.APP) {
      licensable = await this.appService.findOneByKey(license.licensableId)
    } else if (license.licensableType === ENTITY_TYPE.DOC) {
      licensable = await this.docService.findById(license.licensableId)
    }

    if (!licensable) {
      throw new NotFoundException('无此licensable！')
    }

    await this.licenseService.removeLicense(license.id)
    return {
      licensable
    }
  }

  @ResolveField(() => Licensable, { name: 'licensable' })
  async fetchLicense(@Parent() license: LicenseModel): Promise<typeof Licensable> {
    let licensable = null
    if (license.licensableType === ENTITY_TYPE.APP) {
      licensable = await this.appService.findOneByKey(license.licensableId)
    } else if (license.licensableType === ENTITY_TYPE.DOC) {
      licensable = await this.docService.findById(license.licensableId)
    }
    if (!licensable) {
      throw new NotFoundException('无此licensable！')
    }
    return licensable
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
