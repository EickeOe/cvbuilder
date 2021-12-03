import { ObjectType } from '@nestjs/graphql'
import { Paginated } from 'src/model/page-info.model'
import { UserModel } from '../user.model'

@ObjectType()
export class PaginatedUser extends Paginated(UserModel) {}
