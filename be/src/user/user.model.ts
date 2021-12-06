import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'
import { Field, ID, InterfaceType, ObjectType } from '@nestjs/graphql'

@InterfaceType('User')
@ObjectType('user', { description: 'user' })
@Entity({ name: 'user' })
export class UserModel {
  @Field((type) => ID)
  @PrimaryColumn()
  id: string
  @Field()
  @Column({ type: 'text', nullable: false })
  name: string
}
