import { ArgsType, createUnionType, Field, InputType, InterfaceType, ObjectType } from '@nestjs/graphql'
import { AppModel } from 'src/app/app.model'

export const Starrable = createUnionType({
  name: 'starrable',
  types: () => [AppModel]
})

@ObjectType()
export class StarActionResult {
  @Field(() => Starrable)
  starrable: typeof Starrable
}

@ObjectType()
export class StarActionsResult {
  @Field(() => [Starrable])
  starrable: typeof Starrable[]
}

@InputType()
export class UpdateStarInput {
  @Field()
  starrableId: string

  @Field()
  index: number
}
