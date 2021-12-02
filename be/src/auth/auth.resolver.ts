import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/decorator/public';
import { AuthService } from './auth.service';

@InputType()
class LoginInput {
  @Field()
  name: string
  @Field()
  id: string

}

@ObjectType()
class Token {
  @Field()
  token: string
}

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Mutation(() => Token)
  async login(@Args({ name: 'input', type: () => LoginInput }) input: LoginInput): Promise<Token> {
    return await this.authService.login(input)
  }

}
