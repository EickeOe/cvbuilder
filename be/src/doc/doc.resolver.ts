import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from 'src/decorator/current-user'
import { ENTITY_TYPE } from 'src/enums/enums'
import { LicenseService } from 'src/license/license.service'
import { PageInfoModel } from 'src/model/page-info.model'
import { UserModel } from 'src/user/user.model'
import { isLicenseCollaborator, isLicenseOwner } from 'src/utils/isLicense'
import { DocModel } from './doc.model'
import { DocService } from './doc.service'
import { CreateDocInput, PaginatedDoc, UpdateDocInput } from './dto/doc.dto'

@Resolver(() => DocModel)
export class DocResolver {
  constructor(private readonly docService: DocService, private readonly licenseService: LicenseService) {}

  // TODO: 鉴权

  @Query(() => DocModel)
  async doc(@Args('id') id: string): Promise<DocModel> {
    const doc = await this.docService.findById(id)

    if (!doc) {
      throw new NotFoundException()
    }
    return doc
  }

  @Query(() => PaginatedDoc)
  async docs(
    @Args('parentId', { nullable: true }) parentId?: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('pageInfo', { nullable: true }) pageInfo?: PageInfoModel
  ): Promise<PaginatedDoc> {
    const query = {}
    if (parentId) {
      Object.assign(query, { parentId })
    }
    if (name) {
      Object.assign(query, { name })
    }
    const [data, totalCount] = await this.docService.findAndCount(query, pageInfo)
    return {
      data,
      totalCount
    }
  }

  @Mutation(() => DocModel)
  async createDoc(@CurrentUser() user: UserModel, @Args('input') input: CreateDocInput): Promise<DocModel> {
    const license = await this.licenseService.findDocLicense(user.id, input.parentId)

    if (!(isLicenseCollaborator(license) || isLicenseOwner(license))) {
      throw new ForbiddenException('无权限创建应用！')
    }

    return this.docService.create({
      createdUserId: user.id,
      createdAt: Date.now(),
      updatedUserId: user.id,
      updatedAt: Date.now(),
      ...input
    })
  }

  @Mutation(() => DocModel)
  async deleteDoc(@CurrentUser() user: UserModel, @Args('id') id: string) {
    const license = await this.licenseService.findDocLicense(user.id, id)

    if (!(isLicenseCollaborator(license) || isLicenseOwner(license))) {
      throw new ForbiddenException('无权限创建应用！')
    }
    const doc = await this.docService.findById(id)

    if (!doc) {
      throw new NotFoundException()
    }
    const result = await this.docService.remove(doc)

    return {
      id,
      ...result
    }
  }

  @Mutation(() => DocModel)
  async updateDoc(@CurrentUser() user: UserModel, @Args('input') input: UpdateDocInput) {
    const license = await this.licenseService.findDocLicense(user.id, input.id)

    if (!(isLicenseCollaborator(license) || isLicenseOwner(license))) {
      throw new ForbiddenException('无权限创建应用！')
    }

    const doc = await this.docService.findById(input.id)

    if (!doc) {
      throw new NotFoundException()
    }
    const nDoc = {
      ...input,
      updatedUserId: user.id,
      updatedAt: Date.now()
    }
    await this.docService.update(nDoc)

    return {
      ...doc,
      ...nDoc
    }
  }
}
