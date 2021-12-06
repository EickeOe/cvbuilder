import { ObjectType } from '@nestjs/graphql'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { LicenseUser } from 'src/license/dto/license.dto'
import { Paginated } from 'src/model/page-info.model'
import { UserModel } from '../user.model'

@ObjectType()
class UserLicense extends UserModel {
  role: LICENSE_ROLE
}

@ObjectType()
export class PaginatedUser extends Paginated(UserModel) {}

@ObjectType()
export class PaginatedLicenseUser extends Paginated(LicenseUser) {}
