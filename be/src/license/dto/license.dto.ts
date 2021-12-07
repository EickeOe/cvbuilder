import { createUnionType, Field, InterfaceType, ObjectType } from '@nestjs/graphql'
import { AppModel } from 'src/app/app.model'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { Paginated } from 'src/model/page-info.model'
import { UserModel } from 'src/user/user.model'
import { LicenseModel } from '../license.model'

export const Licensable = createUnionType({
  name: 'licensable',
  types: () => [AppModel]
})

@ObjectType()
export class LicenseActionResult {
  @Field(() => Licensable)
  licensable: typeof Licensable
}

@ObjectType()
export class PaginatedLicense extends Paginated(LicenseModel) {}
