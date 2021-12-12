import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'
import { Field, ID, InterfaceType, ObjectType } from '@nestjs/graphql'

@ObjectType('Doc', { description: '文档' })
@Entity({ name: 'doc' })
export class DocModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('identity')
  id: string
  @Field()
  @Column({ type: 'varchar', nullable: false })
  name: string

  @Field()
  @Column({ type: 'varchar', nullable: false })
  parentId: string

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  content?: string

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  url?: string

  @Field()
  @Column({ type: 'int8' })
  createdAt: number

  @Field()
  @Column({ type: 'int8' })
  updatedAt: number

  @Field()
  @Column({ type: 'varchar' })
  createdUserId: string

  @Field()
  @Column({ type: 'varchar' })
  updatedUserId: string
}
