import { ObjectType } from '@nestjs/graphql'
import { Paginated } from 'src/model/page-info.model'
import { AppModel } from '../app.model'

@ObjectType()
export class PaginatedApp extends Paginated(AppModel) {}
