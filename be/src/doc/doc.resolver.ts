import { NotFoundException } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from 'src/decorator/current-user'
import { PageInfoModel } from 'src/model/page-info.model'
import { UserModel } from 'src/user/user.model'
import { DocModel } from './doc.model'
import { DocService } from './doc.service'
import { CreateDocInput, PaginatedDoc, UpdateDocInput } from './dto/doc.dto'

@Resolver(() => DocModel)
export class DocResolver {
  constructor(private readonly docService: DocService) {}

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
  createDoc(@CurrentUser() user: UserModel, @Args('input') input: CreateDocInput): Promise<DocModel> {
    return this.docService.create({
      createdUserId: user.id,
      createdAt: Date.now(),
      updatedUserId: user.id,
      updatedAt: Date.now(),
      ...input
    })
  }

  @Mutation(() => DocModel)
  async deleteDoc(@Args('id') id: string) {
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
