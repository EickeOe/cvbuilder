import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { MaxLength } from 'class-validator'
import { MenuConfig, DevOptions } from 'src/app/app.model'
import { Paginated } from 'src/model/page-info.model'
import { DocModel } from '../doc.model'

@ObjectType()
export class PaginatedDoc extends Paginated(DocModel) {}

@InputType()
export class CreateDocInput {
  @Field()
  name: string

  @Field()
  parentId: string

  @Field({ nullable: true })
  content?: string

  @Field({ nullable: true })
  url?: string
}

@InputType()
export class UpdateDocInput {
  @Field((type) => ID)
  id: string

  @Field({ nullable: true })
  name: string

  @Field({ nullable: true })
  parentId: string

  @Field({ nullable: true })
  content?: string

  @Field({ nullable: true })
  url?: string
}
