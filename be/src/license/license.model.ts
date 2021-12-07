import { ObjectType, Field, ID } from '@nestjs/graphql'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType('License')
@Entity({ name: 'license' })
export class LicenseModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('identity')
  id: number

  @Field()
  @Column('varchar')
  userId: string

  @Field()
  @Column('varchar')
  licensableId: string

  @Field()
  @Column('varchar')
  licensableType: string

  @Field()
  @Column('varchar')
  role: LICENSE_ROLE
}
