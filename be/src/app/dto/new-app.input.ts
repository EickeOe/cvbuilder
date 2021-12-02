import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, Length, MaxLength } from 'class-validator'
import { DevOptions, MenuConfig } from '../app.model'

@InputType()
export class NewAppInput {
  @Field()
  @MaxLength(5)
  key: string

  @Field()
  @MaxLength(10)
  label: string

  @Field(() => Boolean, { nullable: true })
  isBaseApp: boolean

  @Field()
  path: string

  @Field()
  classification: string

  @Field(() => Boolean, { nullable: true })
  disabled: boolean

  @Field()
  icon: string

  @Field(() => MenuConfig, { nullable: true })
  menuConfig: MenuConfig

  @Field(() => DevOptions, { nullable: true })
  devOptions: DevOptions
}

@InputType()
export class UpdateAppInput {
  @Field()
  @MaxLength(5)
  key: string

  @Field({ nullable: true })
  @MaxLength(10)
  label: string

  @Field(() => Boolean, { nullable: true })
  isBaseApp: boolean

  @Field({ nullable: true })
  path: string

  @Field({ nullable: true })
  classification: string

  @Field(() => Boolean, { nullable: true })
  disabled: boolean

  @Field({ nullable: true })
  icon: string

  @Field(() => MenuConfig, { nullable: true })
  menuConfig: MenuConfig

  @Field(() => DevOptions, { nullable: true })
  devOptions: DevOptions
}
