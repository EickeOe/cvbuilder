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

  @Query(() => DocModel)
  async doc(@Args('id') id: string): Promise<DocModel> {
    return null
  }

  @Query(() => PaginatedDoc)
  async docs(
    @Args('directoryId', { nullable: true }) directoryId?: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('pageInfo', { nullable: true }) pageInfo?: PageInfoModel
  ): Promise<PaginatedDoc> {
    return null
  }

  @Mutation(() => DocModel)
  createDoc(@CurrentUser() user: UserModel, @Args('input') input: CreateDocInput) {
    return this.docService.create()
  }

  @Mutation(() => DocModel)
  deleteDoc(@Args('id') id: string) {
    return
  }

  @Mutation(() => DocModel)
  updateDoc(@CurrentUser() user: UserModel, @Args('input') input: UpdateDocInput) {
    return
  }
}
