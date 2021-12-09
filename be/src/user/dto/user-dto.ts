import { Field, InterfaceType, ObjectType } from '@nestjs/graphql'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { Paginated } from 'src/model/page-info.model'
import { UserModel } from '../user.model'

@ObjectType()
class UserLicense extends UserModel {
  role: LICENSE_ROLE
}

@ObjectType()
export class PaginatedUser extends Paginated(UserModel) {}
