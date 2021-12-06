import { createUnionType, Field, InterfaceType, ObjectType } from '@nestjs/graphql'
import { AppModel } from 'src/app/app.model'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { UserModel } from 'src/user/user.model'

export const Licensable = createUnionType({
  name: 'licensable',
  types: () => [AppModel]
})

@ObjectType()
export class LicenseActionResult {
  @Field(() => Licensable)
  licensable: typeof Licensable
}
