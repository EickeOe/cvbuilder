import { Type } from '@nestjs/common'
import { Field, InputType, Int, InterfaceType, ObjectType } from '@nestjs/graphql'

@InputType('pageInfo')
export class PageInfoModel {
  @Field(() => Number)
  page: number
  @Field(() => Number)
  size: number
}

export interface IPaginatedType<T> {
  data: T[]
  totalCount: number
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field((type) => [classRef], { nullable: true })
    data: T[]

    @Field((type) => Int)
    totalCount: number
  }
  return PaginatedType as Type<IPaginatedType<T>>
}
