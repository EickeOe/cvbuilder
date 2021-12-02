import { createUnionType, Field, InterfaceType, ObjectType } from '@nestjs/graphql'
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
