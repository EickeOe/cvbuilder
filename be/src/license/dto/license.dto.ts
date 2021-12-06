import { createUnionType, Field, InterfaceType, ObjectType } from '@nestjs/graphql'
import { AppModel } from 'src/app/app.model'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { UserModel } from 'src/user/user.model'

export const Licensable = createUnionType({
  name: 'licensable',
  types: () => [AppModel]
})

@ObjectType({
  implements: () => [UserModel]
})
export class LicenseUser implements UserModel {
  id: string
  name: string
  @Field(() => LICENSE_ROLE)
  role: LICENSE_ROLE
}

@ObjectType()
export class LicenseActionResult {
  @Field(() => Licensable)
  licensable: typeof Licensable
}
