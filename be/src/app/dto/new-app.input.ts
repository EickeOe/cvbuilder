import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class NewAppInput {
  @Field()
  @MaxLength(5)
  key: string;

  @Field()
  @MaxLength(10)
  label: string;

  @Field(() => Boolean, { nullable: true })
  isBaseApp: boolean;

  @Field()
  path: string;

  @Field()
  classification: string;

  @Field(() => Boolean, { nullable: true })
  disabled: boolean;

  @Field()
  icon: string;

  menuConfig: {
    menus: {};
    enabled: boolean;
  };

  devOptions: {
    microAppOptions: {
      shadowDOM: boolean;
      inline: boolean;
      disableSandbox: boolean;
    };
  };
}

@InputType()
export class UpdateAppInput {
  @Field()
  @MaxLength(5)
  key: string;

  @Field({ nullable: true })
  @MaxLength(10)
  label: string;

  @Field(() => Boolean, { nullable: true })
  isBaseApp: boolean;

  @Field({ nullable: true })
  path: string;

  @Field({ nullable: true })
  classification: string;

  @Field(() => Boolean, { nullable: true })
  disabled: boolean;

  @Field({ nullable: true })
  icon: string;

  menuConfig: {
    menus: {};
    enabled: boolean;
  };

  devOptions: {
    microAppOptions: {
      shadowDOM: boolean;
      inline: boolean;
      disableSandbox: boolean;
    };
  };
}
