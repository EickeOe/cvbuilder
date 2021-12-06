import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'
import { Field, ID, InterfaceType, ObjectType } from '@nestjs/graphql'
import { LicenseUser } from './dto/user-dto'
import { LICENSE_ROLE } from 'src/enums/license.enum'

@ObjectType('User', { description: 'user', implements: () => [LicenseUser] })
@Entity({ name: 'user' })
export class UserModel implements LicenseUser {
  @Field((type) => ID)
  @PrimaryColumn()
  id: string
  @Field()
  @Column({ type: 'text', nullable: false })
  name: string

  role: LICENSE_ROLE
}
