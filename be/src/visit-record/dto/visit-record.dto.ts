import { ArgsType, createUnionType, Field, InputType, InterfaceType, ObjectType } from '@nestjs/graphql'
import { AppModel } from 'src/app/app.model'
import { Paginated } from 'src/model/page-info.model'
import { VisitRecordModel } from '../visit-record.model'

export const Visitable = createUnionType({
  name: 'Visitable',
  types: () => [AppModel]
})

@ObjectType()
export class VisitRecordActionResult {
  @Field(() => Visitable)
  visitable: typeof Visitable
}

@ObjectType()
export class PaginatedVisitRecord extends Paginated(VisitRecordModel) {}
