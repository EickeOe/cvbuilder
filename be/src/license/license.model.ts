import { ObjectType, Field, ID } from '@nestjs/graphql'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'license' })
export class LicenseModel {
  @PrimaryGeneratedColumn('identity')
  id: number

  @Column('varchar')
  userId: string

  @Column('varchar')
  licensableId: string

  @Column('varchar')
  licensableType: string

  @Column('varchar')
  role: LICENSE_ROLE
}
