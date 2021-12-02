import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'
import { Field, ID, InputType, InterfaceType, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
@InputType('MenuConfigInput')
@ObjectType()
export class MenuConfig {
  @Field((type) => GraphQLJSON, { nullable: true })
  menus: { [key: string]: any }
  @Field()
  enabled: boolean
}

@InputType('MicroAppOptionsInput')
@ObjectType()
export class MicroAppOptions {
  @Field()
  shadowDOM: boolean
  @Field()
  inline: boolean
  @Field()
  disableSandbox: boolean
}
@InputType('DevOptionsInput')
@ObjectType()
export class DevOptions {
  @Field((type) => MicroAppOptions, { nullable: true })
  microAppOptions: MicroAppOptions
}

@ObjectType('app', { description: 'app' })
@Entity({ name: 'app' })
export class AppModel {
  @Field((type) => ID)
  @PrimaryColumn()
  key: string

  @Field(() => Boolean)
  @Column({ type: 'bool', nullable: false })
  isBaseApp: boolean
  @Field()
  @Column({ type: 'text', nullable: false })
  label: string

  @Field()
  @Column({ type: 'text', nullable: false })
  path: string

  @Field()
  @Column({ type: 'text', nullable: false })
  classification: string

  @Field(() => Boolean)
  @Column({ type: 'bool', default: true })
  disabled: boolean

  @Field()
  @Column({ type: 'text', nullable: true })
  icon: string

  @Field(() => MenuConfig, { nullable: true })
  @Column({ type: 'json', nullable: true, default: {} })
  menuConfig: MenuConfig

  @Field(() => DevOptions, { nullable: true })
  @Column({ type: 'json', nullable: true, default: {} })
  devOptions: DevOptions
}
