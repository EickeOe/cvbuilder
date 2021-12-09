import { ObjectType, Field, ID } from '@nestjs/graphql'
import { ENTITY_TYPE } from 'src/enums/enums'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType('License')
@Entity({ name: 'license' })
export class LicenseModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('identity')
  id: string

  @Field()
  @Column('varchar')
  userId: string

  @Field()
  @Column('varchar')
  licensableId: string

  @Field(() => ENTITY_TYPE)
  @Column('varchar')
  licensableType: ENTITY_TYPE

  @Field(() => LICENSE_ROLE)
  @Column('varchar')
  role: LICENSE_ROLE
}
