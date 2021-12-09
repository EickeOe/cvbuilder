import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ENTITY_TYPE } from 'src/enums/enums'
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType('VisitRecord', { description: '最近访问' })
@Entity({ name: 'recentVisit' })
export class VisitRecordModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('identity')
  id: string

  @Field()
  @Column('varchar')
  userId: string

  @Field()
  @Column('varchar')
  visitableId: string

  @Field(() => ENTITY_TYPE)
  @Column('varchar')
  visitableType: ENTITY_TYPE

  @Field()
  @Column('int8')
  recordTime: number
}
