import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType('starred', { description: 'Starred' })
@Entity({ name: 'starred' })
export class StarredModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('identity')
  id: string
  @Field()
  @Column('varchar')
  userId: string
  @Column('varchar')
  starrableId: string
  @Column('varchar')
  type: string
  @Column('int4', { nullable: true })
  index: number
}
